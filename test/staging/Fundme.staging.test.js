const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")
console.log(
    "---------------------------",
    developmentChains.includes(network.name)
)
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe
          let deployer
          const sendValue = "1000000000000000000"

          console.log("---------------------------", sendValue)
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              console.log("---------------------------", deployer)
              fundMe = await ethers.getContract("FundMe", deployer)
              console.log("---------------------------", fundMe)
          })

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await fundMe.runner.provider.getBalance(
                  fundMe.target
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
// const { assert } = require("chai")
// const { network, ethers, getNamedAccounts } = require("hardhat")
// const { developmentChains } = require("../../helper-hardhat-config")

// developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe Staging Tests", async function () {
//           let deployer
//           let fundMe
//           const sendValue = "1000000000000000000"
//           beforeEach(async () => {
//               deployer = (await getNamedAccounts()).deployer
//               fundMe = await ethers.getContract("FundMe", deployer)
//           })

//           it("allows people to fund and withdraw", async function () {
//               const fundTxResponse = await fundMe.fund({ value: sendValue })
//               await fundTxResponse.wait(1)
//               const withdrawTxResponse = await fundMe.withdraw()
//               await withdrawTxResponse.wait(1)

//               const endingFundMeBalance =
//                   await fundMe.runner.provider.getBalance(fundMe.target)
//               console.log(
//                   endingFundMeBalance.toString() +
//                       " should equal 0, running assert equal..."
//               )
//               assert.equal(endingFundMeBalance.toString(), "0")
//           })
//       })
