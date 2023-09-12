require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-gas-reporter")
require("hardhat-deploy")
require("solidity-coverage")
require("@nomiclabs/hardhat-ethers")
const { setGlobalDispatcher, ProxyAgent } = require("undici")
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890")
setGlobalDispatcher(proxyAgent)

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [SEPOLIA_PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // hardhat provide accounts
            chainId: 31337,
        },
    },
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },

    gasReporter: {
        enabled: false,
        //outputFile: "gas-report.txt",
        //gasPrice: 21,
        noColors: true,
        currency: "CNY",
        //   coinmarketcap: COINMARKETCAP_API_KEY,
        //token: "ETH",
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        timeout: 600000,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            31337: 0,
        },
        users: {
            default: 0,
        },
    },
}
