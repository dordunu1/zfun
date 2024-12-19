import { getTokenDeploymentByAddress } from '../services/firebase';
import { UNISWAP_ADDRESSES } from '../services/uniswap';
import { ipfsToHttp } from './ipfs';

// Common tokens with metadata
export const COMMON_TOKENS = [
  {
    address: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/usdc.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

export const getTokenMetadata = async (token) => {
  if (!token?.address) return null;

  // 1. Check if it's a common token
  const commonToken = COMMON_TOKENS.find(t => 
    t.address.toLowerCase() === token.address.toLowerCase()
  );
  if (commonToken) {
    return {
      ...token,
      ...commonToken,
      verified: true
    };
  }

  // 2. Check Firebase for custom tokens
  try {
    const tokenDeployment = await getTokenDeploymentByAddress(token.address);
    if (tokenDeployment) {
      return {
        ...token,
        name: tokenDeployment.name,
        symbol: tokenDeployment.symbol || 'ERC20 Token',
        decimals: tokenDeployment.decimals || 18,
        logo: tokenDeployment.logo,
        logoIpfs: tokenDeployment.logoIpfs,
        artworkType: tokenDeployment.artworkType,
        verified: true
      };
    }
  } catch (error) {
    console.error('Error fetching token from Firebase:', error);
  }

  // 3. Return token with default values if no metadata found
  return {
    ...token,
    name: token.name || 'ERC20 Token',
    symbol: token.symbol || 'ERC20',
    decimals: token.decimals || 18,
    logo: token.logo || '/token-default.png',
    verified: false
  };
};

export const getTokenLogo = (token) => {
  if (!token) return '/token-default.png';

  // Check if it's a common token
  const commonToken = COMMON_TOKENS.find(t => 
    t.address?.toLowerCase() === token.address?.toLowerCase()
  );
  if (commonToken) {
    return commonToken.logo;
  }

  // Check for IPFS or direct logo from token data
  if (token.logo || token.logoIpfs) {
    return token.logo || ipfsToHttp(token.logoIpfs);
  }

  // Default token logo
  return '/token-default.png';
}; 