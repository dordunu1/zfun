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
    "unichain-mainnet": {
      url: "https://mainnet.unichain.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 130,
      gasPrice: 1000000000  // 1 gwei
    },
    unichain: {
      url: `https://unichain-sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 1301,
      gasPrice: 1000000000  // 1 gwei
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: 100000000000 // 100 gwei
    }
  },
  etherscan: {
    apiKey: {
      moonwalker: "any-string-works-here", // Blockscout doesn't require an API key
      unichain: process.env.VITE_UNICHAIN_EXPLORER_API_KEY,
      "unichain-mainnet": process.env.VITE_UNICHAIN_EXPLORER_API_KEY,
      polygon: process.env.VITE_POLYGONSCAN_API_KEY // Add Polygonscan API key
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