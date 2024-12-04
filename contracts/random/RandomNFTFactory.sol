// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./RandomNFT721.sol";
import "./RandomNFT1155.sol";
import "./IRandomNFT.sol";

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
    
    // Events
    event RandomCollectionCreated(
        address indexed creator,
        address indexed collection,
        string collectionType,
        string name,
        string symbol,
        uint256 maxSupply,
        uint256 mintPrice,
        uint256 maxPerWallet,
        uint256 releaseDate,
        uint256 mintEndDate,
        bool infiniteMint,
        address paymentToken,
        bool enableWhitelist,
        uint96 royaltyFee,
        address royaltyRecipient
    );
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
        
        // New advanced minting fields
        AdvancedMintingConfig advancedConfig;
    }

    struct AdvancedMintingConfig {
        address reservedMinter;      // Address that can mint reserved tokens
        uint256 reservedAmount;      // Amount reserved for special minting
        bool isFreeMint;            // Whether reserved minter mints for free
        bool canClaimUnminted;      // Whether can claim unminted after whitelist
        uint256 whitelistEndTime;   // When whitelist phase ends
    }

    /**
     * @dev Constructor
     * @param _randomNFT721Implementation Address of the ERC721 implementation
     * @param _randomNFT1155Implementation Address of the ERC1155 implementation
     */
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
     * @dev Creates a new random NFT collection with advanced minting config
     */
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
                msg.sender,
                params.royaltyRecipient,
                params.royaltyFee
            );
        } else {
            RandomNFT1155(collection).initialize(
                params.name,
                params.symbol,
                params.baseURI,
                msg.sender,
                params.royaltyRecipient,
                params.royaltyFee
            );
        }

        // Initialize mint configuration
        IRandomNFT(collection).initializeMintConfig(
            IRandomNFT.MintConfig({
                maxSupply: params.maxSupply,
                mintPrice: params.mintPrice,
                maxPerWallet: params.maxPerWallet,
                releaseDate: params.releaseDate,
                mintEndDate: params.mintEndDate,
                infiniteMint: params.infiniteMint,
                paymentToken: params.paymentToken,
                enableWhitelist: params.enableWhitelist,
                royaltyFee: params.royaltyFee,
                royaltyRecipient: params.royaltyRecipient
            })
        );

        // Configure advanced minting if specified
        if (params.advancedConfig.reservedMinter != address(0)) {
            IRandomNFT(collection).configureMinter(
                params.advancedConfig.reservedMinter,
                true, // isReserved
                params.advancedConfig.reservedAmount,
                params.advancedConfig.isFreeMint,
                params.advancedConfig.canClaimUnminted
            );

            // Set whitelist end time if specified
            if (params.advancedConfig.whitelistEndTime > 0) {
                IRandomNFT(collection).setWhitelistEndTime(
                    params.advancedConfig.whitelistEndTime
                );
            }
        }

        // Track collection
        creatorCollections[msg.sender].push(collection);
        
        emit RandomCollectionCreated(
            msg.sender,
            collection,
            params.collectionType,
            params.name,
            params.symbol,
            params.maxSupply,
            params.mintPrice,
            params.maxPerWallet,
            params.releaseDate,
            params.mintEndDate,
            params.infiniteMint,
            params.paymentToken,
            params.enableWhitelist,
            params.royaltyFee,
            params.royaltyRecipient
        );

        return collection;
    }

    /**
     * @dev Returns collections created by an address
     * @param creator Creator address
     */
    function getCreatorCollections(
        address creator
    ) external view returns (address[] memory) {
        return creatorCollections[creator];
    }

    /**
     * @dev Updates chain-specific fees
     * @param chainId Chain ID to update
     * @param fee New fee amount
     */
    function setChainFee(
        uint256 chainId,
        uint256 fee
    ) external onlyOwner {
        chainFees[chainId] = fee;
        emit FeeUpdated(chainId, fee);
    }

    /**
     * @dev Withdraws accumulated fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Returns the implementation address based on collection type
     * @param collectionType Hash of the collection type string
     */
    function _getImplementation(
        bytes32 collectionType
    ) internal view returns (address) {
        if (collectionType == keccak256(bytes("ERC721"))) {
            return randomNFT721Implementation;
        } else if (collectionType == keccak256(bytes("ERC1155"))) {
            return randomNFT1155Implementation;
        } else {
            revert("Invalid collection type");
        }
    }

    /**
     * @dev Handles creation fees based on network
     */
    function _handleFees() internal view {
        uint256 fee = chainFees[block.chainid];
        require(fee > 0, "Unsupported network");
        require(msg.value >= fee, "Insufficient fee");
    }

    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {}
} 