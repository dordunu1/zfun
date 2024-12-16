export const NFTFactoryABI = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "collectionType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "metadataURI",
            "type": "string"
          },
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
            "internalType": "uint256",
            "name": "maxPerWallet",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "releaseDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mintEndDate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "infiniteMint",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "paymentToken",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "enableWhitelist",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "royaltyReceiver",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "royaltyFeeNumerator",
            "type": "uint96"
          }
        ],
        "internalType": "struct NFTFactory.CreateNFTCollectionParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createNFTCollection",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collection",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "collectionType",
        "type": "string"
      }
    ],
    "name": "CollectionCreated",
    "type": "event"
  }
]; 