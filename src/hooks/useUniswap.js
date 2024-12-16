import { useMemo } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { UniswapService } from '../services/uniswap';

export function useUniswap() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const uniswap = useMemo(() => {
    if (!publicClient || !walletClient) return null;
    return new UniswapService(publicClient, walletClient);
  }, [publicClient, walletClient]);

  return uniswap;
} 