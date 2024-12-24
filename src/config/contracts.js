// Network IDs
// Sepolia: 11155111
// Polygon Mainnet: 137
// Unichain Testnet: 1301

export const NFT_CONTRACTS = {
    // Sepolia Testnet
    11155111: {
        NFT721_IMPLEMENTATION: import.meta.env.VITE_NFT721_IMPLEMENTATION_SEPOLIA,
        NFT1155_IMPLEMENTATION: import.meta.env.VITE_NFT1155_IMPLEMENTATION_SEPOLIA,
        NFT_FACTORY: import.meta.env.VITE_NFT_FACTORY_SEPOLIA
    },
    // Polygon Mainnet
    137: {
        NFT721_IMPLEMENTATION: import.meta.env.VITE_NFT721_IMPLEMENTATION_POLYGON,
        NFT1155_IMPLEMENTATION: import.meta.env.VITE_NFT1155_IMPLEMENTATION_POLYGON,
        NFT_FACTORY: import.meta.env.VITE_NFT_FACTORY_POLYGON
    },
    // Unichain Testnet
    1301: {
        NFT721_IMPLEMENTATION: import.meta.env.VITE_NFT721_IMPLEMENTATION_UNICHAIN,
        NFT1155_IMPLEMENTATION: import.meta.env.VITE_NFT1155_IMPLEMENTATION_UNICHAIN,
        NFT_FACTORY: import.meta.env.VITE_NFT_FACTORY_UNICHAIN
    }
};

// Keep ERC20 contracts separate
export const TOKEN_CONTRACTS = {
    11155111: {
        FACTORY: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
        ROUTER: import.meta.env.VITE_ROUTER_ADDRESS_SEPOLIA
    },
    137: {
        FACTORY: import.meta.env.VITE_FACTORY_ADDRESS_137,
        ROUTER: import.meta.env.VITE_ROUTER_ADDRESS_POLYGON
    },
    1301: {
        FACTORY: import.meta.env.VITE_FACTORY_ADDRESS_UNICHAIN,
        ROUTER: import.meta.env.VITE_ROUTER_ADDRESS_UNICHAIN
    }
};

// Network-specific fees are handled by the contract:
// - Sepolia: 0.015 ETH
// - Polygon: 20 POL
// - Unichain: 0.015 ETH

export const TOKEN_ADDRESSES = {
    11155111: { // Sepolia
        USDC: import.meta.env.VITE_USDC_ADDRESS_SEPOLIA,
        USDT: import.meta.env.VITE_USDT_ADDRESS_SEPOLIA,
        WETH: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"
    },
    137: { // Polygon
        USDC: import.meta.env.VITE_USDC_ADDRESS_POLYGON,
        USDT: import.meta.env.VITE_USDT_ADDRESS_POLYGON,
        WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    },
    1301: { // Unichain Testnet
        USDC: import.meta.env.VITE_UNICHAIN_USDC_ADDRESS,
        USDT: import.meta.env.VITE_UNICHAIN_USDT_ADDRESS,
        WETH: "0x4E6F7372696F00000000000000000000000000FF"
    }
};