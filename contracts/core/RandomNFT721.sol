// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";


contract RandomNFT721 is 
    Initializable,
    ERC721Upgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC2981
{
    using Strings for uint256;

    // Minting configuration
    uint256 public maxSupply;
    uint256 public mintPrice;
    uint256 public maxPerWallet;
    uint256 public totalSupply;
    mapping(uint256 => bool) public usedTokenIds;  // Track used token IDs
    
    // Whitelist configuration
    bytes32 public merkleRoot;
    mapping(address => uint256) public mintedPerWallet;
    
    // Metadata and URI configuration
    string private _baseTokenURI;  // IPFS base URI
    bool public metadataFrozen;
    mapping(uint256 => string) private _tokenURIs;  // Individual token URIs

    // Trait system
    struct Trait {
        string name;        // e.g., "Background"
        string[] values;    // e.g., ["Red", "Blue", "Green"]
        uint256[] weights;  // e.g., [30, 40, 30] (must sum to 100)
    }
    Trait[] public traits;
    mapping(uint256 => string[]) public tokenTraits;  // tokenId => trait values
    uint256 private nonce;  // For random number generation

    // Royalty configuration
    address public royaltyRecipient;
    uint96 public royaltyPercentage;  // In basis points (e.g., 500 = 5%)

    // Advanced minting configuration
    struct TeamMinting {
        address teamMinter;      // Address allowed to mint reserved tokens
        uint256 reservedAmount;  // Number of tokens reserved for team
        bool isFreeReserved;     // Whether reserved minting is free
        bool canClaimUnminted;   // Can claim unminted tokens after whitelist
    }
    
    TeamMinting public teamMinting;
    bool public whitelistEnded;
    uint256 public whitelistEndTime;

    // Events
    event TraitAdded(string name, string[] values, uint256[] weights);
    event TraitsAssigned(uint256 indexed tokenId, string[] traitValues);
    event RoyaltyUpdated(address indexed recipient, uint96 percentage);
    event TeamMintingConfigured(
        address indexed teamMinter,
        uint256 reservedAmount,
        bool isFreeReserved,
        bool canClaimUnminted
    );
    event ReservedTokensMinted(address indexed minter, uint256 quantity);
    event UnmintedTokensClaimed(address indexed claimer, uint256 quantity);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        string memory baseURI,
        address _royaltyRecipient,
        uint96 _royaltyPercentage
    ) public initializer {
        __ERC721_init(name, symbol);
        __Pausable_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        maxPerWallet = _maxPerWallet;
        _baseTokenURI = baseURI;
        royaltyRecipient = _royaltyRecipient;
        royaltyPercentage = _royaltyPercentage;
    }

    /**
     * @dev Add a new trait type with its possible values and weights
     */
    function addTrait(
        string calldata name,
        string[] calldata values,
        uint256[] calldata weights
    ) external onlyOwner {
        require(values.length > 0, "No values provided");
        require(values.length == weights.length, "Arrays length mismatch");
        
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        require(totalWeight == 100, "Weights must sum to 100");

        traits.push(Trait({
            name: name,
            values: values,
            weights: weights
        }));

        emit TraitAdded(name, values, weights);
    }

    /**
     * @dev Generates a random token ID that hasn't been used yet
     */
    function _generateRandomTokenId() internal returns (uint256) {
        uint256 randomId;
        do {
            randomId = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        nonce++,
                        totalSupply
                    )
                )
            );
        } while (usedTokenIds[randomId]);
        
        usedTokenIds[randomId] = true;
        return randomId;
    }

    /**
     * @dev Public mint function with random trait assignment
     */
    function mint(uint256 quantity) external payable nonReentrant whenNotPaused {
        require(quantity > 0, "Quantity must be greater than 0");
        require(totalSupply + quantity <= maxSupply, "Would exceed max supply");
        require(mintedPerWallet[msg.sender] + quantity <= maxPerWallet, "Would exceed max per wallet");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _generateRandomTokenId();
            _safeMint(msg.sender, tokenId);
            
            // Assign traits if configured
            if (traits.length > 0) {
                _assignRandomTraits(tokenId);
            }
            
            totalSupply++;
        }

        mintedPerWallet[msg.sender] += quantity;
    }

    /**
     * @dev Whitelist mint function with random trait assignment
     */
    function whitelistMint(
        uint256 quantity,
        bytes32[] calldata merkleProof
    ) external payable nonReentrant whenNotPaused {
        require(merkleRoot != bytes32(0), "Whitelist not enabled");
        require(
            MerkleProof.verify(
                merkleProof,
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Invalid proof"
        );

        require(quantity > 0, "Quantity must be greater than 0");
        require(totalSupply + quantity <= maxSupply, "Would exceed max supply");
        require(mintedPerWallet[msg.sender] + quantity <= maxPerWallet, "Would exceed max per wallet");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _generateRandomTokenId();
            _safeMint(msg.sender, tokenId);
            
            // Assign traits if configured
            if (traits.length > 0) {
                _assignRandomTraits(tokenId);
            }
            
            totalSupply++;
        }

        mintedPerWallet[msg.sender] += quantity;
    }

    /**
     * @dev Internal function to assign random traits to a token
     */
    function _assignRandomTraits(uint256 tokenId) internal {
        string[] memory values = new string[](traits.length);
        
        for (uint256 i = 0; i < traits.length; i++) {
            uint256 randomNumber = uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        nonce++,
                        tokenId,
                        i
                    )
                )
            );
            
            uint256 traitIndex = randomNumber % traits[i].values.length;
            if (traits[i].weights.length == 0) {
                values[i] = traits[i].values[traitIndex];
            } else {
                values[i] = _selectTraitValue(traits[i].values, traits[i].weights, randomNumber);
            }
        }
        
        tokenTraits[tokenId] = values;
        emit TraitsAssigned(tokenId, values);
    }

    /**
     * @dev Select a trait value based on weights and random number
     */
    function _selectTraitValue(
        string[] memory values,
        uint256[] memory weights,
        uint256 randomNumber
    ) private pure returns (string memory) {
        require(values.length > 0 && values.length == weights.length, "Invalid arrays");
        
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        
        uint256 random = randomNumber % totalWeight;
        uint256 currentWeight = 0;
        
        for (uint256 i = 0; i < weights.length; i++) {
            currentWeight += weights[i];
            if (random < currentWeight) {
                return values[i];
            }
        }
        
        return values[0];
    }

    /**
     * @dev See {ERC721-_exists}. This function is internal, so we need to implement it.
     */
    function _exists(
        uint256 tokenId
    ) internal view virtual returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Returns the traits of a specific token
     */
    function getTokenTraits(uint256 tokenId) external view returns (string[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenTraits[tokenId];
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        if (bytes(_tokenURIs[tokenId]).length > 0) {
            return _tokenURIs[tokenId];
        }
        
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    /**
     * @dev Base URI for computing {tokenURI}
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Set the base URI for token metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        require(!metadataFrozen, "Metadata is frozen");
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Freeze metadata permanently
     */
    function freezeMetadata() external onlyOwner {
        metadataFrozen = true;
    }

    /**
     * @dev Set the merkle root for whitelist verification
     */
    function setMerkleRoot(bytes32 root) external onlyOwner {
        merkleRoot = root;
    }

    /**
     * @dev Update royalty configuration
     */
    function setRoyaltyInfo(address recipient, uint96 percentage) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(percentage <= 1000, "Percentage too high"); // Max 10%
        
        royaltyRecipient = recipient;
        royaltyPercentage = percentage;
        
        emit RoyaltyUpdated(recipient, percentage);
    }

    /**
     * @dev See {IERC2981-royaltyInfo}
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        require(_exists(tokenId), "Token does not exist");
        return (royaltyRecipient, (salePrice * royaltyPercentage) / 10000);
    }

    /**
     * @dev Update mint price
     */
    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Transfer failed");
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
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Upgradeable, IERC165) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Configure team minting settings
     */
    function configureTeamMinting(
        address _teamMinter,
        uint256 _reservedAmount,
        bool _isFreeReserved,
        bool _canClaimUnminted
    ) external onlyOwner {
        require(_teamMinter != address(0), "Invalid team minter address");
        require(_reservedAmount <= maxSupply, "Reserved amount exceeds max supply");
        
        teamMinting = TeamMinting({
            teamMinter: _teamMinter,
            reservedAmount: _reservedAmount,
            isFreeReserved: _isFreeReserved,
            canClaimUnminted: _canClaimUnminted
        });

        emit TeamMintingConfigured(
            _teamMinter,
            _reservedAmount,
            _isFreeReserved,
            _canClaimUnminted
        );
    }

    /**
     * @dev Mint reserved tokens (team minting)
     */
    function mintReserved(uint256 quantity) external payable nonReentrant whenNotPaused {
        require(msg.sender == teamMinting.teamMinter, "Not team minter");
        require(quantity <= teamMinting.reservedAmount, "Exceeds reserved amount");
        require(totalSupply + quantity <= maxSupply, "Would exceed max supply");

        uint256 cost = teamMinting.isFreeReserved ? 0 : mintPrice * quantity;
        require(msg.value >= cost, "Insufficient payment");

        teamMinting.reservedAmount -= quantity;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply + 1;
            _safeMint(msg.sender, tokenId);
            _assignRandomTraits(tokenId);
            totalSupply++;
        }

        emit ReservedTokensMinted(msg.sender, quantity);
    }

    /**
     * @dev Set whitelist end time
     */
    function setWhitelistEndTime(uint256 endTime) external onlyOwner {
        require(endTime > block.timestamp, "End time must be in future");
        whitelistEndTime = endTime;
    }

    /**
     * @dev End whitelist phase
     */
    function endWhitelist() external onlyOwner {
        require(block.timestamp >= whitelistEndTime, "Whitelist period not over");
        whitelistEnded = true;
    }

    /**
     * @dev Claim unminted tokens after whitelist period
     */
    function claimUnminted(uint256 quantity) external payable nonReentrant whenNotPaused {
        require(whitelistEnded, "Whitelist not ended");
        require(teamMinting.canClaimUnminted, "Claims not enabled");
        require(msg.sender == teamMinting.teamMinter, "Not authorized to claim");
        require(totalSupply + quantity <= maxSupply, "Would exceed max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply + 1;
            _safeMint(msg.sender, tokenId);
            _assignRandomTraits(tokenId);
            totalSupply++;
        }

        emit UnmintedTokensClaimed(msg.sender, quantity);
    }
}
