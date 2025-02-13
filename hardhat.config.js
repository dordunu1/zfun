require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
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
    "unichain-mainnet": {
      url: "http://mainnet.unichain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 130,
      gasPrice: 1000000000  // 1 gwei
    },
    unichain: {
      url: "https://unichain-sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    },
    moonwalker: {
      url: "https://moonwalker-rpc.eu-north-2.gateway.fm",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1828369849,
      verify: {
        etherscan: {
          apiUrl: 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
        }
      }
    },
    polygon: {
      url: "https://polygon-pokt.nodies.app",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: {
      unichain: process.env.VITE_UNICHAIN_EXPLORER_API_KEY,
      "unichain-mainnet": process.env.VITE_UNICHAIN_EXPLORER_API_KEY,
      moonwalker: "any-string-works-here", // Blockscout doesn't require an API key
      polygon: process.env.POLYGONSCAN_API_KEY
    },
    customChains: [
      {
        network: "unichain-mainnet",
        chainId: 130,
        urls: {
          apiURL: "https://unichain.blockscout.com/api",
          browserURL: "https://unichain.blockscout.com"
        }
      },
      {
        network: "unichain",
        chainId: 1301,
        urls: {
          apiURL: "https://api-sepolia.uniscan.xyz/api",
          browserURL: "https://sepolia.uniscan.xyz"
        }
      },
      {
        network: "moonwalker",
        chainId: 1828369849,
        urls: {
          apiURL: "https://moonwalker-blockscout.eu-north-2.gateway.fm/api",
          browserURL: "https://moonwalker-blockscout.eu-north-2.gateway.fm"
        }
      }
    ]
  }
};