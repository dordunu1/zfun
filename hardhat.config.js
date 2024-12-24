require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

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
      url: "https://rpc.unichain.io",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    }
  },
  sourcify: {
    enabled: true
  },
  etherscan: {
    apiKey: {
      unichain: "any" // Uniscan doesn't require an API key
    },
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
    artifacts: "./artifacts"
  }
};