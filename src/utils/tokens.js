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
    logo: '/weth.png'
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
    name: 'Tether USD',
    decimals: 6,
    logo: '/usdt.png'
  }
];

// Helper function to get chain-specific token addresses
export const getChainTokens = (chainId) => {
  switch (chainId) {
    case 1301: // Unichain
      return [
        {
          address: 'ETH',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          logo: '/eth.png'
        },
        {
          address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
          symbol: 'WETH',
          name: 'Wrapped Ethereum',
          decimals: 18,
          logo: '/weth.png'
        },
        {
          address: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logo: '/usdc.png'
        },
        {
          address: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          logo: '/usdt.png'
        }
      ];
    default:
      return COMMON_TOKENS.map(token => {
        if (token.address === 'ETH') return token;
        
        const chainAddresses = UNISWAP_ADDRESSES[chainId] || UNISWAP_ADDRESSES;
        const addressKey = Object.keys(chainAddresses).find(key => 
          key === token.symbol
        );
        
        return {
          ...token,
          address: addressKey ? chainAddresses[addressKey] : token.address
        };
      });
  }
};

export const getTokenMetadata = async (token, chainId) => {
  // Return default metadata if token is null/undefined
  if (!token) {
    return {
      address: '',
      symbol: 'Unknown',
      name: 'Unknown Token',
      decimals: 18,
      logo: '/token-default.png',
      verified: false
    };
  }

  // Handle case where token is just an address string
  const tokenAddress = typeof token === 'string' ? token : token.address;
  if (!tokenAddress) {
    return {
      address: '',
      symbol: 'Unknown',
      name: 'Unknown Token',
      decimals: 18,
      logo: '/token-default.png',
      verified: false
    };
  }

  // 1. Check if it's a common token
  const chainTokens = getChainTokens(chainId);
  const commonToken = chainTokens.find(t => {
    if (!t.address || !tokenAddress) return false;
    return t.address.toLowerCase() === tokenAddress.toLowerCase();
  });

  if (commonToken) {
    return {
      ...token,
      ...commonToken,
      verified: true
    };
  }

  // 2. Check Firebase for custom tokens
  try {
    const tokenDeployment = await getTokenDeploymentByAddress(tokenAddress);
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

export const getTokenLogo = (token, chainId) => {
  if (!token) return '/token-default.png';

  // Check if it's a common token
  const chainTokens = getChainTokens(chainId);
  const commonToken = chainTokens.find(t => {
    if (!t.address || !token.address) return false;
    return t.address.toLowerCase() === token.address.toLowerCase();
  });

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