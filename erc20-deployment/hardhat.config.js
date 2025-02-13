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
      },
      viaIR: true
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
      url: "https://sepolia.unichain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 11155111
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 137,
      gasPrice: 100000000000 // 100 gwei in POL
    },
    "unichain-mainnet": {
      url: "https://mainnet.unichain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 130,
      gasPrice: 500000000, // 0.5 gwei
      gas: 5000000,       // Set a fixed gas limit
      timeout: 60000      // Increase timeout to 60 seconds
    }
  },
  sourcify: {
    enabled: true
  },
  etherscan: {
    apiKey: {
      moonwalker: "any-string-works-here", // Blockscout doesn't require an API key
      unichain: "any-string-works-here",   // Uniscan doesn't require an API key
      sepolia: process.env.VITE_ETHERSCAN_API_KEY,
      polygon: process.env.VITE_POLYGONSCAN_API_KEY,
      "unichain-mainnet": process.env.VITE_UNICHAIN_EXPLORER_API_KEY
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
          apiURL: "https://unichain-sepolia.blockscout.com/api",
          browserURL: "https://unichain-sepolia.blockscout.com"
        }
      },
      {
        network: "unichain-mainnet",
        chainId: 130,
        urls: {
          apiURL: "https://unichain.blockscout.com/api",
          browserURL: "https://unichain.blockscout.com"
        }
      }
    ]
  }
}; 