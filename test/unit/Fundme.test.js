const { deployments, getNamedAccounts } = require("hardhat")
const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          const sendValue = "1000000000000000000" //1 ETH
          beforeEach(async function () {
              // deploy our fundMe contract
              // using Hardhat-deploy
              // const accounts = await ethers.getSingers()
              // const accountZero = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              // fixture is allow us run the whole deploy files
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)

              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("sets the aggregator address correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  console.log(`response address = ${response}`)
                  console.log(
                      `mockV3Aggregator address = ${mockV3Aggregator.target}`
                  )
                  assert.equal(response, mockV3Aggregator.target)
              })
          })

          describe("fund", async function () {
              it("Fails if you don't send enough ETH", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough!!"
                  )
              })

              it("updated the amount funded data structure", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of getFunder", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single funder", async function () {
                  // Arrang
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  console.log(startingFundMeBalance)
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  console.log(startingDeployerBalance)
                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecript = await transactionResponse.wait(1)

                  const { gasUsed, gasPrice } = transactionRecript
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  const endingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  // gasCost
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )
              })
              it("allows us to withdraw with multiple getFunder", async function () {
                  // Arrage
                  console.log("---------")
                  const accounts = await ethers.getSigners()
                  console.log(accounts)
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  console.log(startingFundMeBalance)
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionRecript = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionRecript
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  const endingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  // gasCost
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )
                  //Make sure that the getFunder are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[5]
                  )
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(
                      fundMeConnectedContract,
                      "FundMe__NotOwner"
                  )
              })
          })

          describe("cheaperWithdraw testing ... ", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single funder", async function () {
                  // Arrang
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  console.log(startingFundMeBalance)
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  console.log(startingDeployerBalance)
                  // Act

                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionRecript = await transactionResponse.wait(1)

                  const { gasUsed, gasPrice } = transactionRecript
                  const gasCost = gasUsed * gasPrice
                  const endingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  const endingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  // gasCost
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )
              })
              it("allows us to withdraw with multiple getFunder", async function () {
                  // Arrage
                  console.log("---------")
                  const accounts = await ethers.getSigners()
                  console.log(accounts)
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  console.log(startingFundMeBalance)
                  const startingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw()
                  const transactionRecript = await transactionResponse.wait(1)
                  const { gasUsed, gasPrice } = transactionRecript
                  const gasCost = gasUsed * gasPrice

                  const endingFundMeBalance =
                      await fundMe.runner.provider.getBalance(fundMe.target)
                  const endingDeployerBalance =
                      await fundMe.runner.provider.getBalance(deployer)
                  // gasCost
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance + startingDeployerBalance,
                      endingDeployerBalance + gasCost
                  )
                  //Make sure that the getFunder are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted

                  for (i = 1; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the owner to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[5]
                  )
                  await expect(
                      fundMeConnectedContract.cheaperWithdraw()
                  ).to.be.revertedWithCustomError(
                      fundMeConnectedContract,
                      "FundMe__NotOwner"
                  )
              })
          })
      })
