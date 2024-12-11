// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../core/RandomNFT721.sol";
import "../core/RandomNFT1155.sol";
import "../interfaces/IRandomNFT.sol";

/**
 * @title RandomNFTFactory
 * @dev Factory contract for deploying random NFT collections
 */
contract RandomNFTFactory is Ownable, ReentrancyGuard {
    using Clones for address;

    // Immutable implementation addresses
    address public immutable randomNFT721Implementation;
    address public immutable randomNFT1155Implementation;
    
    // Network-specific fees
    mapping(uint256 => uint256) public chainFees;
    
    // Collection tracking
    mapping(address => address[]) public creatorCollections;
    mapping(address => string) public collectionMetadata;

    // Metadata format configuration
    enum MetadataFormat {
        ID_FIELD,          // "id": "CM-1"
        NAME_FIELD,        // "name": "CM-1"
        NESTED_NAME,       // metadata: { "name": "CM-1" }
        TAG_FIELD,         // "tag": "1"
        CUSTOM            // For any custom field
    }

    struct MetadataConfig {
        MetadataFormat format;     // Which format is being used
        string idField;            // Custom field name if format is CUSTOM
        bool isNested;            // If true, look in metadata.{idField}
        uint256 totalMetadata;    // Total number of metadata entries
    }

    // Collection info struct
    struct CollectionInfo {
        address creator;
        address collection;
        string collectionType;
        string name;
        string symbol;
        uint256 maxSupply;
        uint256 mintPrice;
        uint256 maxPerWallet;
        uint256 releaseDate;
        uint256 mintEndDate;
        bool infiniteMint;
        address paymentToken;
        bool enableWhitelist;
        uint96 royaltyFee;
        address royaltyRecipient;
        MetadataConfig metadataConfig;
    }
    
    // Events
    event RandomCollectionCreated(CollectionInfo info);
    event FeeUpdated(uint256 chainId, uint256 newFee);
    event Debug(string message, uint256 value);

    struct DeploymentParams {
        string name;
        string symbol;
        string baseURI;
        string collectionType; // "ERC721" or "ERC1155"
        uint256 maxSupply;
        uint256 mintPrice;
        uint256 maxPerWallet;
        uint256 releaseDate;
        uint256 mintEndDate;
        bool infiniteMint;
        address paymentToken;
        bool enableWhitelist;
        uint96 royaltyFee;
        address royaltyRecipient;
        
        // Advanced minting fields
        AdvancedMintingConfig advancedConfig;
        
        // Metadata configuration
        MetadataConfig metadataConfig;
    }

    struct AdvancedMintingConfig {
        address reservedMinter;      // Address that can mint reserved tokens
        uint256 reservedAmount;      // Amount reserved for special minting
        bool isFreeMint;            // Whether reserved minter mints for free
        bool canClaimUnminted;      // Whether can claim unminted after whitelist
        uint256 whitelistEndTime;   // When whitelist phase ends
    }

    constructor(
        address _randomNFT721Implementation,
        address _randomNFT1155Implementation
    ) Ownable(msg.sender) {
        require(
            _randomNFT721Implementation != address(0),
            "Invalid 721 implementation"
        );
        require(
            _randomNFT1155Implementation != address(0),
            "Invalid 1155 implementation"
        );
        
        randomNFT721Implementation = _randomNFT721Implementation;
        randomNFT1155Implementation = _randomNFT1155Implementation;
        
        // Set initial fees for different chains
        chainFees[11155111] = 0.015 ether;  // Sepolia
        chainFees[137] = 20 ether;          // Polygon
    }

    /**
     * @dev Maps a token ID to a metadata index based on the collection's metadata format
     * @param tokenId The token ID to map
     * @param config The metadata configuration
     * @param nonce The nonce to use for randomization
     * @return The metadata index (0 to totalMetadata - 1)
     */
    function _getMetadataIndex(
        uint256 tokenId,
        MetadataConfig memory config,
        uint256 nonce
    ) internal view returns (uint256) {
        // Generate a random index between 0 and totalMetadata - 1
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    nonce,
                    tokenId
                )
            )
        ) % config.totalMetadata;
        
        return randomIndex;
    }

    function createRandomCollection(
        DeploymentParams calldata params
    ) external payable nonReentrant returns (address collection) {
        _handleFees();

        bytes32 collectionType = keccak256(bytes(params.collectionType));
        address implementation = _getImplementation(collectionType);
        
        // Deploy collection using minimal proxy
        collection = implementation.clone();
        
        // Initialize the collection based on type
        if (collectionType == keccak256(bytes("ERC721"))) {
            RandomNFT721(collection).initialize(
                params.name,
                params.symbol,
                params.maxSupply,
                params.mintPrice,
                params.maxPerWallet,
                params.baseURI,
                params.royaltyRecipient,
                params.royaltyFee
            );
        } else {
            RandomNFT1155(collection).initialize(
                params.name,
                params.symbol,
                params.maxSupply,
                params.mintPrice,
                params.maxPerWallet,
                params.baseURI,
                params.royaltyRecipient,
                params.royaltyFee
            );
        }

        // Configure advanced minting if specified
        if (params.advancedConfig.reservedMinter != address(0)) {
            if (collectionType == keccak256(bytes("ERC721"))) {
                RandomNFT721(collection).configureTeamMinting(
                    params.advancedConfig.reservedMinter,
                    params.advancedConfig.reservedAmount,
                    params.advancedConfig.isFreeMint,
                    params.advancedConfig.canClaimUnminted
                );
            } else {
                RandomNFT1155(collection).configureTeamMinting(
                    params.advancedConfig.reservedMinter,
                    params.advancedConfig.reservedAmount,
                    params.advancedConfig.isFreeMint,
                    params.advancedConfig.canClaimUnminted
                );
            }

            // Set whitelist end time if specified
            if (params.advancedConfig.whitelistEndTime > 0) {
                if (collectionType == keccak256(bytes("ERC721"))) {
                    RandomNFT721(collection).setWhitelistEndTime(
                        params.advancedConfig.whitelistEndTime
                    );
                } else {
                    RandomNFT1155(collection).setWhitelistEndTime(
                        params.advancedConfig.whitelistEndTime
                    );
                }
            }
        }

        // Track collection
        creatorCollections[msg.sender].push(collection);
        
        // Create and emit collection info
        CollectionInfo memory info = CollectionInfo({
            creator: msg.sender,
            collection: collection,
            collectionType: params.collectionType,
            name: params.name,
            symbol: params.symbol,
            maxSupply: params.maxSupply,
            mintPrice: params.mintPrice,
            maxPerWallet: params.maxPerWallet,
            releaseDate: params.releaseDate,
            mintEndDate: params.mintEndDate,
            infiniteMint: params.infiniteMint,
            paymentToken: params.paymentToken,
            enableWhitelist: params.enableWhitelist,
            royaltyFee: params.royaltyFee,
            royaltyRecipient: params.royaltyRecipient,
            metadataConfig: params.metadataConfig
        });
        
        emit RandomCollectionCreated(info);

        return collection;
    }

    function _handleFees() internal view {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        
        uint256 fee = chainFees[chainId];
        require(fee > 0, "Chain not supported");
        require(msg.value >= fee, "Insufficient fee");
    }

    function _getImplementation(bytes32 collectionType) internal view returns (address) {
        if (collectionType == keccak256(bytes("ERC721"))) {
            return randomNFT721Implementation;
        } else if (collectionType == keccak256(bytes("ERC1155"))) {
            return randomNFT1155Implementation;
        }
        revert("Invalid collection type");
    }

    function updateChainFee(uint256 chainId, uint256 newFee) external onlyOwner {
        chainFees[chainId] = newFee;
        emit FeeUpdated(chainId, newFee);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }
} 