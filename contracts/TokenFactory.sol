// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Template.sol";

/// @title Token Factory Contract
/// @notice Factory contract for creating new ERC20 tokens
/// @dev Uses minimal proxy pattern for gas-efficient token deployment
contract TokenFactory is Ownable, ReentrancyGuard {
    using Clones for address;

    // Immutable variables
    address public immutable implementation;
    
    // Chain-specific fee mapping
    mapping(uint256 => uint256) public chainFees;
    
    // Logo mapping
    mapping(address => string) public tokenLogos;
    
    // Events
    event TokenCreated(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        string logoURI
    );
    event FeeWithdrawn(address indexed owner, uint256 amount);
    event FeeUpdated(uint256 chainId, uint256 newFee);

    /// @notice Creates the factory with an implementation contract and fee
    constructor() Ownable(msg.sender) {
        // Deploy the template with empty constructor
        implementation = address(new ERC20Template());
        
        // Set initial fees for different chains
        chainFees[11155111] = 0.01 ether;     // Sepolia
        chainFees[137] = 20 ether;            // Polygon Mainnet
        // Add Zchain when available
    }

    function setChainFee(uint256 chainId, uint256 fee) external onlyOwner {
        chainFees[chainId] = fee;
        emit FeeUpdated(chainId, fee);
    }

    function getChainFee() public view returns (uint256) {
        return chainFees[block.chainid];
    }

    /// @notice Creates a new ERC20 token
    /// @param name The name of the token
    /// @param symbol The symbol of the token
    /// @param decimals The number of decimals for the token
    /// @param initialSupply The initial supply of tokens
    /// @param logoURI The URI of the token logo
    /// @return The address of the newly created token
    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory logoURI
    ) external payable nonReentrant returns (address) {
        uint256 requiredFee = getChainFee();
        require(requiredFee > 0, "Chain not supported");
        require(msg.value >= requiredFee, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(decimals <= 18, "Decimals must be <= 18");
        require(bytes(logoURI).length > 0, "Logo URI cannot be empty");

        // Deploy new token using minimal proxy
        address token = implementation.clone();
        
        // Initialize the cloned token
        ERC20Template(token).initialize(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender
        );

        tokenLogos[token] = logoURI;

        emit TokenCreated(
            msg.sender,
            token,
            name,
            symbol,
            decimals,
            initialSupply,
            logoURI
        );

        return token;
    }

    /// @notice Withdraws accumulated fees to the owner
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FeeWithdrawn(owner(), balance);
    }

    /// @notice Fallback function to receive ETH
    receive() external payable {}
}