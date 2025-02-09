require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
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
    unichain: {
      url: "https://sepolia.unichain.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1301
    },
    polygon: {
      url: "https://polygon-pokt.nodies.app",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    }
  },
  etherscan: {
    apiKey: {
      moonwalker: "any-string-works-here", // Blockscout doesn't require an API key
      polygon: process.env.POLYGONSCAN_API_KEY
    },
    customChains: [
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