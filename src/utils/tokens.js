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
    logo: '/logos/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/logos/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/logos/usdc.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logo: '/logos/usdt.png'
  }
];

// Add Monad specific tokens
export const MONAD_TOKENS = [
  {
    symbol: 'MON',
    name: 'Monad',
    decimals: 18,
    logo: '/monad.png',
    isNative: true
  },
  {
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    symbol: 'WMONAD',
    name: 'Wrapped Monad',
    decimals: 18,
    logo: '/monad.png'
  },
  {
    address: '0xc60A9A0E7F3cBea1852B945EdB35Be52c2c8954e',
    symbol: 'PYRO',
    name: 'PYRO',
    decimals: 18,
    logo: '/pyro.png'
  },
  {
    address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logo: '/eth.png'
  }
];

// Helper function to get chain-specific token addresses
export const getChainTokens = (chainId) => {
  switch (chainId) {
    case 10143: // Monad Testnet
      return MONAD_TOKENS; // Return the full MONAD_TOKENS array directly
    case 1301: // Unichain
      return [
        {
          address: 'ETH',
          symbol: 'ETH',
          name: 'Ethereum',
          decimals: 18,
          logo: '/logos/eth.png'
        },
        {
          address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
          symbol: 'WETH',
          name: 'Wrapped Ethereum',
          decimals: 18,
          logo: '/logos/eth.png'
        },
        {
          address: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logo: '/logos/usdc.png'
        },
        {
          address: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          logo: '/logos/usdt.png'
        }
      ];
    default:
      return COMMON_TOKENS.filter(token => !token.chainId || token.chainId === chainId);
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
  if (!token) return generateTokenInitialsLogo('??');

  // Check if it's a common token by address
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
    const logoUrl = token.logo || ipfsToHttp(token.logoIpfs);
    if (!logoUrl.includes('token-default.png')) {
      return logoUrl;
    }
  }

  // Generate token initials logo
  return generateTokenInitialsLogo(token.symbol || '??');
};

// Helper function to generate a data URL for token initials
const generateTokenInitialsLogo = (symbol) => {
  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = '#1a1b1f';
  ctx.beginPath();
  ctx.arc(20, 20, 20, 0, Math.PI * 2);
  ctx.fill();

  // Draw text
  ctx.fillStyle = '#00ffbd';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol.slice(0, 2).toUpperCase(), 20, 20);

  return canvas.toDataURL('image/png');
}; 