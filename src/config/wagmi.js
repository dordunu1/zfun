import { createConfig, configureChains } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

const metadata = {
  name: 'Token Factory',
  description: 'Create your own ERC20 tokens',
  url: 'https://token-factory.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
)

// Configure MetaMask connector
const metaMask = new InjectedConnector({ 
  chains,
  options: {
    name: 'MetaMask',
    shimDisconnect: true,
  }
})

export const config = createConfig({
  autoConnect: true,
  connectors: [
    metaMask,
    ...w3mConnectors({ projectId, chains })
  ],
  publicClient
})

export const ethereumClient = new EthereumClient(config, chains)