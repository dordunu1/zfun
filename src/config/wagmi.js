import { createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { publicProvider } from 'wagmi/providers/public'

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

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({
    projectId,
    chains,
    version: '2'
  }),
  publicClient
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)
export const config = wagmiConfig

// Export the chain for use in other files
export { unichainTestnet }