// Network IDs
// Sepolia: 11155111
// Polygon Mainnet: 137

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
    }
};

// Keep ERC20 contracts separate
export const TOKEN_CONTRACTS = {
    11155111: {
        FACTORY: import.meta.env.VITE_FACTORY_ADDRESS_11155111
    },
    137: {
        FACTORY: import.meta.env.VITE_FACTORY_ADDRESS_137
    }
};

// Network-specific fees are handled by the contract:
// - Sepolia: 0.015 ETH
// - Polygon: 20 POL 

export const TOKEN_ADDRESSES = {
    11155111: { // Sepolia
        USDC: import.meta.env.VITE_USDC_ADDRESS_SEPOLIA,
        USDT: import.meta.env.VITE_USDT_ADDRESS_SEPOLIA
    },
    137: { // Polygon
        USDC: import.meta.env.VITE_USDC_ADDRESS_POLYGON,
        USDT: import.meta.env.VITE_USDT_ADDRESS_POLYGON
    }
};