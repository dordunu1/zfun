// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract RandomNFT1155 is 
    Initializable,
    ERC1155Upgradeable,
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
    mapping(uint256 => uint256) public tokenSupply;  // Track supply per token ID
    
    // Whitelist configuration
    bytes32 public merkleRoot;
    mapping(address => uint256) public mintedPerWallet;
    
    // Basic metadata
    string public name;
    string public symbol;
    string private _baseURI;

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
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        string memory baseURI,
        address _royaltyRecipient,
        uint96 _royaltyPercentage
    ) public initializer {
        __ERC1155_init(baseURI);
        __Pausable_init();
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        maxPerWallet = _maxPerWallet;
        _baseURI = baseURI;
        royaltyRecipient = _royaltyRecipient;
        royaltyPercentage = _royaltyPercentage;
    }

    /**
     * @dev Public mint function
     */
    function mint(uint256 tokenId, uint256 amount) external payable nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply + amount <= maxSupply, "Would exceed max supply");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Would exceed max per wallet");
        require(msg.value >= mintPrice * amount, "Insufficient payment");

        _mint(msg.sender, tokenId, amount, "");
        tokenSupply[tokenId] += amount;
        totalSupply += amount;
        mintedPerWallet[msg.sender] += amount;
    }

    /**
     * @dev Whitelist mint function
     */
    function whitelistMint(
        uint256 tokenId,
        uint256 amount,
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

        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply + amount <= maxSupply, "Would exceed max supply");
        require(mintedPerWallet[msg.sender] + amount <= maxPerWallet, "Would exceed max per wallet");
        require(msg.value >= mintPrice * amount, "Insufficient payment");

        _mint(msg.sender, tokenId, amount, "");
        tokenSupply[tokenId] += amount;
        totalSupply += amount;
        mintedPerWallet[msg.sender] += amount;
    }

    /**
     * @dev Returns the metadata URI for a token
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return bytes(_baseURI).length > 0 ? string(abi.encodePacked(_baseURI, tokenId.toString())) : "";
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
        require(tokenSupply[tokenId] > 0, "Token does not exist");
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
    ) public view virtual override(ERC1155Upgradeable, IERC165) returns (bool) {
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
    function mintReserved(uint256 tokenId, uint256 amount) external payable nonReentrant whenNotPaused {
        require(msg.sender == teamMinting.teamMinter, "Not team minter");
        require(amount <= teamMinting.reservedAmount, "Exceeds reserved amount");
        require(totalSupply + amount <= maxSupply, "Would exceed max supply");

        uint256 cost = teamMinting.isFreeReserved ? 0 : mintPrice * amount;
        require(msg.value >= cost, "Insufficient payment");

        teamMinting.reservedAmount -= amount;

        _mint(msg.sender, tokenId, amount, "");
        tokenSupply[tokenId] += amount;
        totalSupply += amount;

        emit ReservedTokensMinted(msg.sender, amount);
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
    function claimUnminted(uint256 tokenId, uint256 amount) external payable nonReentrant whenNotPaused {
        require(whitelistEnded, "Whitelist not ended");
        require(teamMinting.canClaimUnminted, "Claims not enabled");
        require(msg.sender == teamMinting.teamMinter, "Not authorized to claim");
        require(totalSupply + amount <= maxSupply, "Would exceed max supply");
        require(msg.value >= mintPrice * amount, "Insufficient payment");

        _mint(msg.sender, tokenId, amount, "");
        tokenSupply[tokenId] += amount;
        totalSupply += amount;

        emit UnmintedTokensClaimed(msg.sender, amount);
    }
}
