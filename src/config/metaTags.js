const baseUrl = 'https://token-factory.xyz';

export const metaTagsConfig = {
  '/': {
    title: 'Token Factory - Create NFTs, Deploy Custom Tokens, Trade and Bridge',
    description: 'Create, deploy, and manage custom tokens on multiple blockchains with Token Factory. Features include token creation, trading, minting NFTs, snapshots, and more.',
  },
  '/create-token': {
    title: 'Token Factory - Create Custom Tokens',
    description: 'Create and deploy your own custom tokens on multiple blockchains. Simple interface with advanced features for token creation and management.',
  },
  '/create-nft': {
    title: 'Token Factory - Create NFT Collections',
    description: 'Launch your NFT collection with customizable minting, royalties, and advanced features. Support for multiple blockchains.',
  },
  '/dashboard': {
    title: 'Token Factory - Dashboard',
    description: 'Manage your tokens, NFTs, and DeFi activities from a single dashboard. Track your assets and transactions.',
  },
  '/collections': {
    title: 'Token Factory - NFT Collections',
    description: 'Browse and manage NFT collections. Create, mint, and trade NFTs with advanced collection management features.',
  },
  '/meme-factory': {
    title: 'Token Factory - Meme Factory',
    description: 'Create and launch your meme tokens with custom tokenomics. Simple interface for meme token deployment.',
  },
  '/trading': {
    title: 'Token Factory - DEX Trading Interface',
    description: 'Trade tokens across multiple chains with our DEX aggregator. Features include swap, liquidity provision, and yield farming.',
  },
  '/bridge': {
    title: 'Token Factory - Cross-chain Bridge',
    description: 'Bridge your tokens securely across different blockchains. Support for multiple networks and token standards.',
  },
  '/merch-store': {
    title: 'Token Factory - Merchandise Store',
    description: 'Official Token Factory merchandise and collectibles. Exclusive items for the community.',
  },
  '/account': {
    title: 'Token Factory - Account Management',
    description: 'Manage your Token Factory account settings, preferences, and security options.',
  },
  '/history': {
    title: 'Token Factory - Transaction History',
    description: 'View and track your complete transaction history across all Token Factory services.',
  }
};

export const getMetaTags = (path) => {
  const route = metaTagsConfig[path] || metaTagsConfig['/'];
  return {
    ...route,
    url: `${baseUrl}${path}`,
  };
}; 