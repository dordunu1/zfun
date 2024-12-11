export const RandomNFTFactoryABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_randomNFT721Implementation", "type": "address" },
      { "internalType": "address", "name": "_randomNFT1155Implementation", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "string", "name": "baseURI", "type": "string" },
          { "internalType": "string", "name": "collectionType", "type": "string" },
          { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "mintPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "maxPerWallet", "type": "uint256" },
          { "internalType": "uint256", "name": "releaseDate", "type": "uint256" },
          { "internalType": "uint256", "name": "mintEndDate", "type": "uint256" },
          { "internalType": "bool", "name": "infiniteMint", "type": "bool" },
          { "internalType": "address", "name": "paymentToken", "type": "address" },
          { "internalType": "bool", "name": "enableWhitelist", "type": "bool" },
          { "internalType": "uint96", "name": "royaltyFee", "type": "uint96" },
          { "internalType": "address", "name": "royaltyRecipient", "type": "address" },
          {
            "components": [
              { "internalType": "address", "name": "reservedMinter", "type": "address" },
              { "internalType": "uint256", "name": "reservedAmount", "type": "uint256" },
              { "internalType": "bool", "name": "isFreeMint", "type": "bool" },
              { "internalType": "bool", "name": "canClaimUnminted", "type": "bool" },
              { "internalType": "uint256", "name": "whitelistEndTime", "type": "uint256" }
            ],
            "internalType": "struct RandomNFTFactory.AdvancedMintingConfig",
            "name": "advancedConfig",
            "type": "tuple"
          },
          {
            "components": [
              { "internalType": "uint8", "name": "format", "type": "uint8" },
              { "internalType": "string", "name": "idField", "type": "string" },
              { "internalType": "bool", "name": "isNested", "type": "bool" },
              { "internalType": "uint256", "name": "totalMetadata", "type": "uint256" }
            ],
            "internalType": "struct RandomNFTFactory.MetadataConfig",
            "name": "metadataConfig",
            "type": "tuple"
          }
        ],
        "internalType": "struct RandomNFTFactory.DeploymentParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createRandomCollection",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "chainId", "type": "uint256" }],
    "name": "chainFees",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "address", "name": "collection", "type": "address" },
          { "internalType": "string", "name": "collectionType", "type": "string" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "mintPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "maxPerWallet", "type": "uint256" },
          { "internalType": "uint256", "name": "releaseDate", "type": "uint256" },
          { "internalType": "uint256", "name": "mintEndDate", "type": "uint256" },
          { "internalType": "bool", "name": "infiniteMint", "type": "bool" },
          { "internalType": "address", "name": "paymentToken", "type": "address" },
          { "internalType": "bool", "name": "enableWhitelist", "type": "bool" },
          { "internalType": "uint96", "name": "royaltyFee", "type": "uint96" },
          { "internalType": "address", "name": "royaltyRecipient", "type": "address" },
          {
            "components": [
              { "internalType": "uint8", "name": "format", "type": "uint8" },
              { "internalType": "string", "name": "idField", "type": "string" },
              { "internalType": "bool", "name": "isNested", "type": "bool" },
              { "internalType": "uint256", "name": "totalMetadata", "type": "uint256" }
            ],
            "internalType": "struct RandomNFTFactory.MetadataConfig",
            "name": "metadataConfig",
            "type": "tuple"
          }
        ],
        "indexed": false,
        "internalType": "struct RandomNFTFactory.CollectionInfo",
        "name": "info",
        "type": "tuple"
      }
    ],
    "name": "RandomCollectionCreated",
    "type": "event"
  }
]; 