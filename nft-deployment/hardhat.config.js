require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config({ path: '../.env' });

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    unichain: {
      url: `https://unichain-sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    }
  },
  etherscan: {
    apiKey: "34c3a5f3ecf943498710543fe38b50f4",
    customChains: [
      {
        network: "unichain",
        chainId: 1301,
        urls: {
          apiURL: "https://sepolia.uniscan.xyz/api",
          browserURL: "https://sepolia.uniscan.xyz"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    root: ".",
    nodeModules: "./node_modules"
  }
}; 