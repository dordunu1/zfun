import { createConfig, configureChains } from 'wagmi'
import { sepolia, polygon, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, connectorsForWallets, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  subWallet,
  phantomWallet,
  rainbowWallet,
  coinbaseWallet,
  walletConnectWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets'

if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide VITE_WALLET_CONNECT_PROJECT_ID env variable')
}

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

// Define Unichain Mainnet
const unichainMainnet = {
  id: 130,
  name: 'Unichain',
  network: 'unichain-mainnet',
  iconUrl: '/unichain-logo.png',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.unichain.org'],
    },
    public: {
      http: ['https://mainnet.unichain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Uniscan',
      url: 'https://unichain.blockscout.com',
    },
  },
  testnet: false,
}

// Define Unichain Testnet
const unichainTestnet = {
  id: 1301,
  name: 'Unichain Sepolia Testnet',
  network: 'unichain-testnet',
  iconUrl: '/unichain-logo.png',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.unichain.org'],
    },
    public: {
      http: ['https://sepolia.unichain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Uniscan',
      url: 'https://unichain-sepolia.blockscout.com',
    },
  },
  testnet: true,
}

// Define Moonwalker Chain
const moonwalkerChain = {
  id: 1828369849,
  name: 'Moonwalker',
  network: 'moonwalker',
  iconUrl: '/moonwalker.png',
  nativeCurrency: {
    name: 'ZERO',
    symbol: 'ZERO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://moonwalker-rpc.eu-north-2.gateway.fm'],
    },
    public: {
      http: ['https://moonwalker-rpc.eu-north-2.gateway.fm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Moonwalker Explorer',
      url: 'https://moonwalker-blockscout.eu-north-2.gateway.fm',
    },
  },
}

// Define available chains
const chains = [
  {
    ...mainnet,
    iconUrl: '/ethereum.png'
  },
  {
    ...sepolia,
    iconUrl: '/sepolia.png'
  },
  {
    ...polygon,
    iconUrl: '/polygon.png'
  },
  unichainMainnet,
  unichainTestnet, 
  moonwalkerChain
];

// Configure chains with optimized settings
const { publicClient } = configureChains(
  chains,  // Use the chains array directly
  [
    publicProvider({
      stallTimeout: 5000,
      timeout: 8000,
      pollingInterval: 8000,
      batch: {
        multicall: {
          batchSize: 1024 * 200,
          wait: 16,
        },
      },
    })
  ],
  {
    pollingInterval: 8000,
    stallTimeout: 5000,
    retryCount: 3,
    retryDelay: 3000,
  }
);

// Get Rainbow Kit's wallets
const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({ projectId, chains }),
      subWallet({ projectId, chains }),
      phantomWallet({ projectId, chains }),
    ],
  },
  {
    groupName: 'Popular',
    wallets: [
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ appName: 'Token Factory', chains }),
      walletConnectWallet({ projectId, chains }),
      okxWallet({ projectId, chains }),
    ],
  },
]);

// Create wagmi config with optimized settings
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  logger: {
    warn: null,
  },
  syncConnectedChain: true,
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
});

// Export everything needed
export { chains, wagmiConfig }
export { unichainMainnet, unichainTestnet, moonwalkerChain }