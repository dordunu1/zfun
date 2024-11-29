import { useAccount, useNetwork, usePublicClient, useWalletClient } from 'wagmi';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  return {
    account: address,
    isConnected,
    chain,
    provider: publicClient,
    signer: walletClient
  };
} 