// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ICollectionTypes.sol";

contract NFT1155 is ERC1155, ReentrancyGuard, ICollectionTypes {
    using Strings for uint256;

    bool public initialized;
    address public owner;
    string public name;
    string public symbol;
    string public baseURI;
    CollectionConfig public config;
    uint256 public totalSupply;

    mapping(address => uint256) public mintedPerWallet;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public whitelistMintLimit;
    mapping(uint256 => uint256) public tokenSupply;

    event Minted(address indexed to, uint256 indexed tokenId, uint256 amount);
    event BatchMinted(address indexed to, uint256[] tokenIds, uint256[] amounts);
    event Debug(string message, uint256 value); // Debug event for troubleshooting

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() ERC1155("") {}

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        CollectionConfig memory _config,
        address _owner
    ) external {
        require(!initialized, "Already initialized");
        require(_owner != address(0), "Invalid owner");

        initialized = true;
        owner = _owner;
        name = _name;
        symbol = _symbol;
        baseURI = _baseURI;
        config = _config;

        _setURI(_baseURI);
    }

    function mint(uint256 tokenId, uint256 amount) external payable nonReentrant {
        // Mint start and end checks
        require(block.timestamp >= config.releaseDate, "Minting not started");
        emit Debug("Release Date", config.releaseDate);
        require(
            config.infiniteMint || block.timestamp <= config.mintEndDate,
            "Minting ended"
        );
        emit Debug("Mint End Date", config.mintEndDate);

        // Max supply and wallet limit checks
        require(totalSupply + amount <= config.maxSupply, "Exceeds max supply");
        emit Debug("Total Supply", totalSupply);
        emit Debug("Max Supply", config.maxSupply);
        require(
            mintedPerWallet[msg.sender] + amount <= config.maxPerWallet,
            "Exceeds wallet limit"
        );
        emit Debug("Minted Per Wallet", mintedPerWallet[msg.sender]);

        // Whitelist check
        if (config.enableWhitelist) {
            require(whitelist[msg.sender], "Not whitelisted");
            emit Debug("Whitelist Check", 1);
            require(
                mintedPerWallet[msg.sender] + amount <=
                    whitelistMintLimit[msg.sender],
                "Exceeds whitelist limit"
            );
            emit Debug("Whitelist Mint Limit", whitelistMintLimit[msg.sender]);
        }

        // Payment processing
        uint256 payment = config.mintPrice * amount;
        emit Debug("Mint Price", config.mintPrice);
        emit Debug("Payment Amount", payment);
        if (config.paymentToken == address(0)) {
            require(msg.value >= payment, "Insufficient payment");
            emit Debug("Msg Value", msg.value);

            // Safe ETH transfer
            (bool success, ) = owner.call{value: payment}("");
            require(success, "Transfer failed");
        } else {
            // ERC-20 token transfer
            bool tokenTransferSuccess = IERC20(config.paymentToken)
                .transferFrom(msg.sender, owner, payment);
            require(tokenTransferSuccess, "Payment failed");
        }

        // Mint the NFT
        _mint(msg.sender, tokenId, amount, "");
        mintedPerWallet[msg.sender] += amount;
        tokenSupply[tokenId] += amount;
        totalSupply += amount;

        emit Minted(msg.sender, tokenId, amount);
    }

    function mintBatch(
        uint256[] memory tokenIds,
        uint256[] memory amounts
    ) external payable nonReentrant {
        require(
            tokenIds.length == amounts.length,
            "Length mismatch"
        );

        require(block.timestamp >= config.releaseDate, "Minting not started");
        require(
            config.infiniteMint || block.timestamp <= config.mintEndDate,
            "Minting ended"
        );

        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        require(
            totalSupply + totalAmount <= config.maxSupply,
            "Exceeds max supply"
        );
        require(
            mintedPerWallet[msg.sender] + totalAmount <= config.maxPerWallet,
            "Exceeds wallet limit"
        );

        if (config.enableWhitelist) {
            require(whitelist[msg.sender], "Not whitelisted");
            require(
                mintedPerWallet[msg.sender] + totalAmount <=
                    whitelistMintLimit[msg.sender],
                "Exceeds whitelist limit"
            );
        }

        uint256 payment = config.mintPrice * totalAmount;
        if (config.paymentToken == address(0)) {
            require(msg.value >= payment, "Insufficient payment");
            (bool success, ) = owner.call{value: payment}("");
            require(success, "Transfer failed");
        } else {
            require(
                IERC20(config.paymentToken).transferFrom(
                    msg.sender,
                    owner,
                    payment
                ),
                "Payment failed"
            );
        }

        _mintBatch(msg.sender, tokenIds, amounts, "");
        mintedPerWallet[msg.sender] += totalAmount;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            tokenSupply[tokenIds[i]] += amounts[i];
        }
        totalSupply += totalAmount;

        emit BatchMinted(msg.sender, tokenIds, amounts);
    }

    function setWhitelist(
        address[] calldata addresses,
        uint256[] calldata limits
    ) external onlyOwner {
        require(addresses.length == limits.length, "Length mismatch");
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
            whitelistMintLimit[addresses[i]] = limits[i];
        }
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    // View functions
    function exists(uint256 tokenId) public view returns (bool) {
        return tokenSupply[tokenId] > 0;
    }

    function totalSupplyOf(uint256 tokenId) public view returns (uint256) {
        return tokenSupply[tokenId];
    }
}
