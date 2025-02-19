// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Template.sol";
import "./MemeToken.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

/// @title Token Factory Contract
/// @notice Factory contract for creating new ERC20 tokens and meme tokens
/// @dev Uses minimal proxy pattern for gas-efficient token deployment
contract TokenFactory is ReentrancyGuard {
    using Clones for address;

    // Immutable variables
    address public immutable standardImplementation;
    address public immutable memeImplementation;
    address public owner;
    
    // Chain-specific fee mapping
    mapping(uint256 => uint256) public chainFees;
    
    // Logo mapping
    mapping(address => string) public tokenLogos;

    // DEX Configuration
    struct DEXConfig {
        address router;
        address factory;
        string name;
        bool isActive;
    }

    mapping(uint256 => DEXConfig) public dexConfigs;
    address public defaultDex;

    // Structs
    struct MemeTokenParams {
        string name;
        string symbol;
        uint256 totalSupply;
        address marketingWallet;
        address treasuryAddress;
        address devAddress;
        address liquidityAddress;
        uint256 burnFee;
        uint256 treasuryFee;
        uint256 devFee;
        uint256 marketingFee;
        uint256 liquidityFee;
        uint256 buyFees;
        uint256 sellFees;
        address router;
        string logoURI;
    
    }
    
    // Events
    event TokenCreated(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        string logoURI,
        bool isMeme
    );
    event FeeWithdrawn(address indexed owner, uint256 amount);
    event FeeUpdated(uint256 chainId, uint256 newFee);
    event LiquidityAdded(
        address indexed token, 
        uint256 tokenAmount, 
        uint256 polAmount,
        uint256 liquidityAmount
    );
    event LiquidityAdditionFailed(address indexed token, uint256 tokenAmount, uint256 polAmount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    // Add new state variables
    bool public paused;
    
    // Add emergency pause
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    // Add DEX config update function
    function updateDexConfig(
        uint256 chainId,
        address router,
        address factory,
        string memory name,
        bool isActive
    ) external onlyOwner {
        require(router != address(0), "Invalid router");
        require(factory != address(0), "Invalid factory");
        dexConfigs[chainId] = DEXConfig({
            router: router,
            factory: factory,
            name: name,
            isActive: isActive
        });
    }

    /// @notice Creates the factory with implementation contracts and fees
    constructor() {
        owner = msg.sender;
        
        // Deploy the templates
        standardImplementation = address(new ERC20Template());
        memeImplementation = address(new MemeToken());
        
        // Set initial fees for different chains
        chainFees[11155111] = 0.01 ether;     // Sepolia
        chainFees[137] = 1 ether;             // Polygon Mainnet (1 POL)
        chainFees[130] = 0.01 ether;          // Unichain Mainnet
        chainFees[1301] = 0.01 ether;         // Unichain Testnet
        chainFees[1828369849] = 0.01 ether;   // Moonwalker

        // Configure DEXes for all supported networks
        
        // Sepolia - Uniswap V2
        dexConfigs[11155111] = DEXConfig({
            router: 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008,  // Uniswap V2 Router on Sepolia
            factory: 0x7E0987E5b3a30e3f2828572Bb659A548460a3003, // Uniswap V2 Factory on Sepolia
            name: "Uniswap V2",
            isActive: true
        });

        // Polygon - QuickSwap
        dexConfigs[137] = DEXConfig({
            router: 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff,  // QuickSwap
            factory: 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32,
            name: "QuickSwap",
            isActive: true
        });

         // Unichain Mainnet - Uniswap V2
        dexConfigs[130] = DEXConfig({
            router: 0x284F11109359a7e1306C3e447ef14D38400063FF,  // Unichain Mainnet Uniswap V2 Router
            factory: 0x1F98400000000000000000000000000000000002, // Unichain Mainnet Factory
            name: "Uniswap V2",
            isActive: true
        });

        // Unichain - Uniswap V2
        dexConfigs[1301] = DEXConfig({
            router: 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640,  // Unichain Uniswap V2 Router
            factory: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f, // Unichain Uniswap V2 Factory
            name: "Uniswap V2",
            isActive: true
        });

        // Set default DEX based on chain
        defaultDex = dexConfigs[block.chainid].router;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setChainFee(uint256 chainId, uint256 fee) external onlyOwner {
        chainFees[chainId] = fee;
        emit FeeUpdated(chainId, fee);
    }

    function getChainFee() public view returns (uint256) {
        return chainFees[block.chainid];
    }

    /// @notice Creates a new standard ERC20 token
    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        string memory logoURI
    ) external payable nonReentrant whenNotPaused returns (address) {
        uint256 requiredFee = getChainFee();
        require(requiredFee > 0, "Chain not supported");
        require(msg.value >= requiredFee, "Insufficient creation fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(decimals <= 18, "Decimals must be <= 18");
        require(bytes(logoURI).length > 0, "Logo URI cannot be empty");

        // Deploy new token using minimal proxy
        address token = standardImplementation.clone();
        
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
            logoURI,
            false
        );

        return token;
    }

    /// @notice Creates a new meme token
    function createMemeToken(MemeTokenParams calldata params) external payable nonReentrant whenNotPaused returns (address) {
        uint256 requiredFee = getChainFee();
        require(requiredFee > 0, "Chain not supported");
        require(msg.value >= requiredFee, "Insufficient creation fee");
        require(bytes(params.name).length > 0, "Name cannot be empty");
        require(bytes(params.symbol).length > 0, "Symbol cannot be empty");
        require(params.totalSupply > 0, "Supply must be > 0");
        
        // Validate addresses
        require(params.marketingWallet != address(0), "Invalid marketing wallet");
        require(params.treasuryAddress != address(0), "Invalid treasury address");
        require(params.devAddress != address(0), "Invalid dev address");
        require(params.liquidityAddress != address(0), "Invalid liquidity address");
        require(params.router != address(0), "Router address cannot be zero");
        require(bytes(params.logoURI).length > 0, "Logo URI cannot be empty");

        // Validate router is whitelisted for this chain
        DEXConfig memory dexConfig = dexConfigs[block.chainid];
        require(dexConfig.isActive, "No DEX configured for this chain");
        require(params.router == dexConfig.router, "Router not whitelisted for this chain");

        // Convert percentages to basis points (multiply by 100)
        uint256 totalSecondaryFees = params.burnFee + params.treasuryFee + params.devFee + 
                                    params.marketingFee + params.liquidityFee;
        require(totalSecondaryFees == 100, "Secondary fees must total 100%");

        uint256 buyFeesInBasis = params.buyFees * 100;
        uint256 sellFeesInBasis = params.sellFees * 100;
        require(buyFeesInBasis <= 2500, "Buy fees cannot exceed 25%");
        require(sellFeesInBasis <= 2500, "Sell fees cannot exceed 25%");

        // Deploy token using clone
        address payable token = payable(memeImplementation.clone());
        
        // Initialize the cloned token with msg.sender as the creator
        MemeToken(token).initialize(
            params.name,
            params.symbol,
            params.totalSupply,
            params.treasuryAddress,
            params.devAddress,
            params.marketingWallet,
            params.liquidityAddress,
            params.burnFee * 100,
            params.treasuryFee * 100,
            params.devFee * 100,
            params.marketingFee * 100,
            params.liquidityFee * 100,
            params.buyFees * 100,
            params.sellFees * 100,
            params.router
        );

        // Store logo URI
        tokenLogos[token] = params.logoURI;

        // Transfer ownership to creator
        MemeToken(token).transferOwnership(msg.sender);

        emit TokenCreated(
            msg.sender,
            token,
            params.name,
            params.symbol,
            18, // Meme tokens always use 18 decimals
            params.totalSupply,
            params.logoURI,
            true
        );

        return token;
    }

    /// @notice Withdraws accumulated fees to the owner
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FeeWithdrawn(owner, balance);
    }

    /// @notice Transfers ownership of the contract to a new account
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @notice Fallback function to receive ETH
    receive() external payable {}
} 