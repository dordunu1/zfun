import { createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

// Define Unichain Testnet
const unichainTestnet = {
  id: 1301,
  name: 'Unichain Sepolia Testnet',
  network: 'unichain-testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://sepolia.unichain.org'] },
    public: { http: ['https://sepolia.unichain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Uniscan',
      url: 'https://sepolia.uniscan.xyz',
    },
  },
  testnet: true,
}

const { chains, publicClient } = configureChains(
  [mainnet, sepolia, unichainTestnet],
  [
    w3mProvider({ projectId }),
    publicProvider()
  ]
)

const metadata = {
  name: 'TokenFactory',
  description: 'Create and manage tokens on Unichain',
  url: 'https://tokenfactory.xyz',
  icons: ['https://tokenfactory.xyz/logo.png']
}

const wagmiConfig = createConfig({
  autoConnect: false, // Disable autoConnect to prevent provider errors
  connectors: [
    ...w3mConnectors({ chains, projectId, version: '2', showQrModal: true }),
    new InjectedConnector({ 
      chains,
      options: {
        name: 'Browser Wallet',
        shimDisconnect: true,
      }
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata,
        showQrModal: true,
      },
    })
  ],
  publicClient
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)
export const config = wagmiConfig

// Export the chain for use in other files
export { unichainTestnet }