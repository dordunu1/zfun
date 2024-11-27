// Network IDs
// Sepolia: 11155111
// Polygon Mainnet: 137

export const NFT_CONTRACTS = {
    // Sepolia Testnet
    11155111: {
        NFT721_IMPLEMENTATION: "0x356162fe2c60dff28903bddf607a322e92d759e5",
        NFT1155_IMPLEMENTATION: "0xa1d970560766b21acfa79d631a023d4fb1364365",
        NFT_FACTORY: "0x5949e4305c6299cde26c02d9fa80a5107f64afa7"
    },
    // Polygon Mainnet
    137: {
        NFT721_IMPLEMENTATION: "YOUR_POLYGON_721_IMPLEMENTATION_ADDRESS",
        NFT1155_IMPLEMENTATION: "YOUR_POLYGON_1155_IMPLEMENTATION_ADDRESS",
        NFT_FACTORY: "YOUR_POLYGON_FACTORY_ADDRESS"
    }
};

// Keep ERC20 contracts separate
export const TOKEN_CONTRACTS = {
    11155111: {
        FACTORY: "YOUR_EXISTING_SEPOLIA_TOKEN_FACTORY"
    },
    137: {
        FACTORY: "YOUR_EXISTING_POLYGON_TOKEN_FACTORY"
    }
};

// Deployment steps in Remix:
// 1. Deploy NFT721.sol
// 2. Deploy NFT1155.sol
// 3. Deploy NFTFactory.sol with constructor arguments:
//    - _nft721Implementation: address from step 1
//    - _nft1155Implementation: address from step 2
// 4. Update this file with the deployed addresses

// Network-specific fees are handled by the contract:
// - Sepolia: 0.015 ETH
// - Polygon: 20 POL 