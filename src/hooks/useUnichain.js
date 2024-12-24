import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { UnichainUniswapService } from '../services/unichain/uniswap';

export function useUnichain() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const unichain = useMemo(() => {
    if (!publicClient || !walletClient) return null;
    return new UnichainUniswapService(publicClient, walletClient);
  }, [publicClient, walletClient]);

  return unichain;
} 