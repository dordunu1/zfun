// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IRandomNFT.sol";
import "./RandomTraitLibrary.sol";
import "./RoyaltyEnforcer.sol";

/**
 * @title RandomNFT721
 * @dev ERC721 Token with random trait assignment and instant reveal
 */
contract RandomNFT721 is 
    IRandomNFT, 
    ERC721, 
    RoyaltyEnforcer, 
    ReentrancyGuard, 
    Pausable 
{
    using Strings for uint256;
    using RandomTraitLibrary for *;

    // State variables
    MintConfig public mintConfig;
    bytes32 public merkleRoot;
    uint256 private nonce;
    uint256 public totalSupply;
    
    // Trait storage
    Trait[] private traits;
    mapping(uint256 => string[]) private tokenTraits;
    mapping(address => uint256) public mintedPerWallet;

    // Events
    event MintConfigUpdated(MintConfig config);
    event WhitelistUpdated(bytes32 merkleRoot);
    event TraitAdded(string traitType, string[] values, uint256[] weights);

    // Base URI for token metadata
    string private _baseURIStorage;
    
    // Initialization status
    bool private _initialized;

    // Metadata freeze status
    bool public metadataFrozen;

    // Events
    event BaseURIUpdated(string newBaseURI);
    event MetadataFrozen();
    event Initialized(
        string name,
        string symbol,
        address owner,
        address royaltyReceiver,
        uint96 royaltyFee
    );

    // Metadata mapping
    mapping(uint256 => string) private _tokenMetadataIds;
    string[] private _availableMetadataIds;
    uint256 private _nextMetadataIndex;
    
    // Events
    event MetadataIdsAdded(uint256 count);
    event TokenMetadataAssigned(uint256 indexed tokenId, string metadataId);

    // Advanced minting configurations
    struct MinterConfig {
        bool isReserved;      // Has reserved allocation
        uint256 reserved;     // Reserved amount
        bool isFree;          // Can mint for free
        bool canClaimUnminted; // Can claim unminted tokens after whitelist
    }
    
    // Advanced minting state
    mapping(address => MinterConfig) public minterConfigs;
    uint256 public whitelistEndTime;
    bool public claimingEnabled;
    
    // Additional events
    event MinterConfigured(
        address indexed minter,
        bool isReserved,
        uint256 reserved,
        bool isFree,
        bool canClaimUnminted
    );
    event ReservedMinted(
        address indexed minter,
        uint256 startTokenId,
        uint256 quantity
    );
    event UnmintedClaimed(
        address indexed claimer,
        uint256 startTokenId,
        uint256 quantity
    );

    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     * @param initialOwner Initial contract owner
     * @param royaltyReceiver Address to receive royalties
     * @param royaltyFee Royalty fee in basis points
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner,
        address royaltyReceiver,
        uint96 royaltyFee
    ) ERC721(name, symbol) RoyaltyEnforcer(initialOwner, royaltyReceiver, royaltyFee) {
    }

    /**
     * @dev Initializes the mint configuration
     * @param config Initial mint configuration
     */
    function initializeMintConfig(MintConfig memory config) external onlyOwner {
        require(mintConfig.maxSupply == 0, "Already initialized");
        require(config.maxSupply > 0, "Invalid max supply");
        require(config.maxPerWallet > 0, "Invalid max per wallet");
        mintConfig = config;
        emit MintConfigUpdated(config);
    }

    /**
     * @dev Adds a new trait type with its possible values and weights
     * @param trait Trait configuration to add
     */
    function addTrait(Trait memory trait) external onlyOwner {
        require(totalSupply == 0, "Minting has started");
        require(bytes(trait.traitType).length > 0, "Empty trait type");
        require(trait.values.length > 0, "No values provided");
        require(trait.values.length == trait.weights.length, "Length mismatch");
        
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < trait.weights.length; i++) {
            totalWeight += trait.weights[i];
        }
        require(totalWeight == 100, "Weights must sum to 100");

        traits.push(trait);
        emit TraitAdded(trait.traitType, trait.values, trait.weights);
    }

    /**
     * @dev Sets the merkle root for whitelist verification
     * @param _merkleRoot New merkle root
     */
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit WhitelistUpdated(_merkleRoot);
    }

    /**
     * @dev Implements the mint function
     * @param quantity Number of tokens to mint
     */
    function mint(
        uint256 quantity
    ) external payable override nonReentrant whenNotPaused {
        require(quantity > 0, "Invalid quantity");
        require(
            block.timestamp >= mintConfig.releaseDate,
            "Minting not started"
        );
        require(
            mintConfig.infiniteMint || block.timestamp <= mintConfig.mintEndDate,
            "Minting ended"
        );
        require(
            totalSupply + quantity <= mintConfig.maxSupply,
            "Exceeds max supply"
        );
        require(
            mintedPerWallet[msg.sender] + quantity <= mintConfig.maxPerWallet,
            "Exceeds wallet limit"
        );

        uint256 payment = mintConfig.mintPrice * quantity;
        _handlePayment(payment);

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply + 1;
            _assignRandomMetadataId(tokenId);  // Assign metadata before minting
            _safeMint(msg.sender, tokenId);
            totalSupply++;
        }

        mintedPerWallet[msg.sender] += quantity;
    }

    /**
     * @dev Implements the whitelist mint function
     * @param quantity Number of tokens to mint
     * @param merkleProof Proof of whitelist inclusion
     */
    function whitelistMint(
        uint256 quantity,
        bytes32[] calldata merkleProof
    ) external payable override nonReentrant whenNotPaused {
        require(mintConfig.enableWhitelist, "Whitelist not enabled");
        require(
            _verifyWhitelist(msg.sender, merkleProof),
            "Not whitelisted"
        );
        
        mint(quantity);
    }

    /**
     * @dev Returns the traits of a specific token
     * @param tokenId Token ID to query
     */
    function getTokenTraits(uint256 tokenId) 
        external 
        view 
        override 
        returns (
            string[] memory traitTypes,
            string[] memory traitValues
        ) 
    {
        require(_exists(tokenId), "Token does not exist");
        
        traitTypes = new string[](traits.length);
        traitValues = tokenTraits[tokenId];
        
        for (uint256 i = 0; i < traits.length; i++) {
            traitTypes[i] = traits[i].traitType;
        }
        
        return (traitTypes, traitValues);
    }

    /**
     * @dev Returns the mint configuration
     */
    function getMintConfig() external view override returns (MintConfig memory) {
        return mintConfig;
    }

    /**
     * @dev Checks if an address is whitelisted
     * @param user Address to check
     */
    function isWhitelisted(
        address user
    ) external view override returns (bool) {
        return mintConfig.enableWhitelist && merkleRoot != bytes32(0);
    }

    /**
     * @dev Returns the total possible combinations of traits
     */
    function getTotalPossibleCombinations() 
        external 
        view 
        override 
        returns (uint256) 
    {
        return RandomTraitLibrary.calculateCombinations(traits);
    }

    /**
     * @dev Handles payment in native token or ERC20
     * @param amount Amount to pay
     */
    function _handlePayment(uint256 amount) internal {
        if (minterConfigs[msg.sender].isFree) {
            return; // Skip payment for free minters
        }
        
        // Regular payment logic
        if (amount > 0) {
            if (mintConfig.paymentToken == address(0)) {
                require(msg.value >= amount, "Insufficient payment");
                (bool success, ) = payable(owner()).call{value: amount}("");
                require(success, "Transfer failed");
                
                // Refund excess payment
                if (msg.value > amount) {
                    (success, ) = payable(msg.sender).call{
                        value: msg.value - amount
                    }("");
                    require(success, "Refund failed");
                }
            } else {
                require(msg.value == 0, "Native token not accepted");
                require(
                    IERC20(mintConfig.paymentToken).transferFrom(
                        msg.sender,
                        owner(),
                        amount
                    ),
                    "ERC20 transfer failed"
                );
            }
        }
    }

    /**
     * @dev Generates and assigns random traits to a token
     * @param tokenId Token ID to assign traits to
     */
    function _generateAndAssignTraits(uint256 tokenId) internal {
        string[] memory values = new string[](traits.length);
        
        for (uint256 i = 0; i < traits.length; i++) {
            uint256 seed = RandomTraitLibrary.generateSeed(
                msg.sender,
                nonce++,
                tokenId
            );
            
            values[i] = RandomTraitLibrary.selectTraitValue(
                seed,
                traits[i].values,
                traits[i].weights
            );
        }
        
        tokenTraits[tokenId] = values;
        
        emit TokenMinted(
            msg.sender,
            tokenId,
            _getTraitTypes(),
            values
        );
    }

    /**
     * @dev Returns array of trait types
     */
    function _getTraitTypes() internal view returns (string[] memory) {
        string[] memory traitTypes = new string[](traits.length);
        for (uint256 i = 0; i < traits.length; i++) {
            traitTypes[i] = traits[i].traitType;
        }
        return traitTypes;
    }

    /**
     * @dev Verifies if an address is whitelisted
     * @param user Address to verify
     * @param proof Merkle proof to verify
     */
    function _verifyWhitelist(
        address user,
        bytes32[] calldata proof
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(user));
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721, RoyaltyEnforcer) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Pause minting
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause minting
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Initializes the contract. Called by factory
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address owner_,
        address royaltyReceiver_,
        uint96 royaltyFee_
    ) external {
        require(!_initialized, "Already initialized");
        require(owner_ != address(0), "Invalid owner");
        
        _initialized = true;
        _transferOwnership(owner_);
        _setRoyaltyInfo(royaltyReceiver_, royaltyFee_);
        
        emit Initialized(
            name_,
            symbol_,
            owner_,
            royaltyReceiver_,
            royaltyFee_
        );
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI_ New base URI (IPFS/HTTP)
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        require(!metadataFrozen, "Metadata is frozen");
        _baseURIStorage = baseURI_;
        emit BaseURIUpdated(baseURI_);
    }

    /**
     * @dev Freezes metadata permanently
     */
    function freezeMetadata() external onlyOwner {
        require(!metadataFrozen, "Already frozen");
        metadataFrozen = true;
        emit MetadataFrozen();
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseURIStorage;
    }

    /**
     * @dev Returns the token URI with correct metadata ID
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        
        string memory baseURI = _baseURI();
        require(bytes(baseURI).length > 0, "Base URI not set");

        string memory metadataId = _tokenMetadataIds[tokenId];
        require(bytes(metadataId).length > 0, "No metadata ID assigned");

        return string(abi.encodePacked(baseURI, metadataId));
    }

    /**
     * @dev Adds available metadata IDs (e.g., "CM-1", "NS-1")
     * @param metadataIds Array of metadata IDs from JSON
     */
    function addMetadataIds(string[] calldata metadataIds) external onlyOwner {
        require(totalSupply == 0, "Minting has started");
        for(uint256 i = 0; i < metadataIds.length; i++) {
            _availableMetadataIds.push(metadataIds[i]);
        }
        emit MetadataIdsAdded(metadataIds.length);
    }

    /**
     * @dev Internal function to assign random metadata ID to a token
     */
    function _assignRandomMetadataId(uint256 tokenId) internal {
        require(_availableMetadataIds.length > 0, "No metadata IDs available");
        require(_nextMetadataIndex < _availableMetadataIds.length, "All metadata used");
        
        // Use the nonce and token ID to generate a random index
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    tokenId,
                    nonce++
                )
            )
        ) % (_availableMetadataIds.length - _nextMetadataIndex);
        
        // Get the metadata ID at the random index
        string memory selectedId = _availableMetadataIds[randomIndex + _nextMetadataIndex];
        
        // Store the mapping
        _tokenMetadataIds[tokenId] = selectedId;
        
        // Increment the next metadata index
        _nextMetadataIndex++;
        
        emit TokenMetadataAssigned(tokenId, selectedId);
    }

    /**
     * @dev Returns the metadata ID for a token
     */
    function getTokenMetadataId(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenMetadataIds[tokenId];
    }

    /**
     * @dev Configure special minting rights for an address
     */
    function configureMinter(
        address minter,
        bool isReserved,
        uint256 reserved,
        bool isFree,
        bool canClaimUnminted
    ) external onlyOwner {
        require(minter != address(0), "Invalid address");
        require(
            reserved <= mintConfig.maxSupply,
            "Reserved exceeds max supply"
        );
        
        minterConfigs[minter] = MinterConfig({
            isReserved: isReserved,
            reserved: reserved,
            isFree: isFree,
            canClaimUnminted: canClaimUnminted
        });
        
        emit MinterConfigured(
            minter,
            isReserved,
            reserved,
            isFree,
            canClaimUnminted
        );
    }

    /**
     * @dev Set whitelist end time
     */
    function setWhitelistEndTime(uint256 endTime) external onlyOwner {
        require(endTime > block.timestamp, "Invalid end time");
        whitelistEndTime = endTime;
    }

    /**
     * @dev Enable/disable claiming of unminted tokens
     */
    function setClaimingEnabled(bool enabled) external onlyOwner {
        claimingEnabled = enabled;
    }

    /**
     * @dev Reserved minting function
     */
    function reservedMint(
        uint256 quantity
    ) external nonReentrant whenNotPaused {
        MinterConfig storage config = minterConfigs[msg.sender];
        require(config.isReserved, "Not a reserved minter");
        require(config.reserved >= quantity, "Exceeds reserved amount");
        require(
            totalSupply + quantity <= mintConfig.maxSupply,
            "Exceeds max supply"
        );
        
        // Update reserved amount
        config.reserved -= quantity;
        
        // Handle payment if not free
        if (!config.isFree) {
            uint256 payment = mintConfig.mintPrice * quantity;
            _handlePayment(payment);
        }
        
        uint256 startTokenId = totalSupply + 1;
        
        // Mint tokens
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = startTokenId + i;
            _assignRandomMetadataId(tokenId);
            _safeMint(msg.sender, tokenId);
            totalSupply++;
        }
        
        emit ReservedMinted(msg.sender, startTokenId, quantity);
    }

    /**
     * @dev Claim unminted tokens after whitelist
     */
    function claimUnminted(
        uint256 quantity
    ) external nonReentrant whenNotPaused {
        require(claimingEnabled, "Claiming not enabled");
        require(
            block.timestamp > whitelistEndTime,
            "Whitelist still active"
        );
        
        MinterConfig storage config = minterConfigs[msg.sender];
        require(
            config.canClaimUnminted,
            "Not authorized to claim"
        );
        
        require(
            totalSupply + quantity <= mintConfig.maxSupply,
            "Exceeds max supply"
        );
        
        uint256 startTokenId = totalSupply + 1;
        
        // Mint tokens
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = startTokenId + i;
            _assignRandomMetadataId(tokenId);
            _safeMint(msg.sender, tokenId);
            totalSupply++;
        }
        
        emit UnmintedClaimed(msg.sender, startTokenId, quantity);
    }
} 