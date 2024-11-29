export const NFTCollectionABI = {
  ERC721: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "config",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "maxSupply",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "mintPrice",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "paymentToken",
              "type": "address"
            }
          ],
          "internalType": "struct ICollectionTypes.CollectionConfig",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  ERC1155: [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialized",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "config",
      "outputs": [{
        "components": [
          { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
          { "internalType": "uint256", "name": "mintPrice", "type": "uint256" },
          { "internalType": "uint256", "name": "maxPerWallet", "type": "uint256" },
          { "internalType": "uint256", "name": "releaseDate", "type": "uint256" },
          { "internalType": "uint256", "name": "mintEndDate", "type": "uint256" },
          { "internalType": "bool", "name": "infiniteMint", "type": "bool" },
          { "internalType": "address", "name": "paymentToken", "type": "address" },
          { "internalType": "bool", "name": "enableWhitelist", "type": "bool" }
        ],
        "internalType": "struct ICollectionTypes.CollectionConfig",
        "name": "",
        "type": "tuple"
      }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": false, "internalType": "string", "name": "message", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
      ],
      "name": "Debug",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "baseURI",
          "type": "string"
        }
      ],
      "name": "Initialized",
      "type": "event"
    }
  ]
}; 