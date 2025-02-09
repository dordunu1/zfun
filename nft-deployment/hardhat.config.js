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
    moonwalker: {
      url: "https://moonwalker-rpc.eu-north-2.gateway.fm",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1828369849,
      verify: {
        etherscan: {
          apiUrl: 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
        }
      }
    },
    unichain: {
      url: `https://unichain-sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    }
  },
  etherscan: {
    apiKey: {
      moonwalker: "any-string-works-here", // Blockscout doesn't require an API key
      unichain: "34c3a5f3ecf943498710543fe38b50f4"
    },
    customChains: [
      {
        network: "moonwalker",
        chainId: 1828369849,
        urls: {
          apiURL: "https://moonwalker-blockscout.eu-north-2.gateway.fm/api",
          browserURL: "https://moonwalker-blockscout.eu-north-2.gateway.fm"
        }
      },
      {
        network: "unichain",
        chainId: 1301,
        urls: {
          apiURL: "https://api-sepolia.uniscan.xyz/api",
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