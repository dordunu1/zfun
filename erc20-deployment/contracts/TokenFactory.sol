// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Template.sol";
import "./MemeToken.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

/// @title Token Factory Contract
/// @notice Factory contract for creating new ERC20 tokens and meme tokens
/// @dev Uses minimal proxy pattern for gas-efficient token deployment
contract TokenFactory is Ownable, ReentrancyGuard {
    using Clones for address;

    // Immutable variables
    address public immutable standardImplementation;
    address public immutable memeImplementation;
    
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
        uint256 communityFeePercent;
        uint256 liquidityFeePercent;
        uint256 burnFeePercent;
        uint256 maxWalletPercent;
        uint256 maxTxPercent;
        bool antiBot;
        bool autoLiquidity;
        string logoURI;
        bool addInitialLiquidity;
        uint256 initialLiquidityPercent;
        uint256 liquidityLockPeriod;
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
        uint256 liquidityAmount,
        uint256 lockPeriod
    );
    event LiquidityAdditionFailed(address indexed token, uint256 tokenAmount, uint256 polAmount);

    /// @notice Creates the factory with implementation contracts and fees
    constructor() {
        // Deploy the templates
        standardImplementation = address(new ERC20Template());
        memeImplementation = address(new MemeToken(
            "TEMPLATE", 
            "TEMP",
            1,
            address(this),
            1,
            1,
            1,
            1,
            1,
            false,
            false
        ));
        
        // Set initial fees for different chains
        chainFees[11155111] = 0.01 ether;     // Sepolia
        chainFees[137] = 1 ether;             // Polygon Mainnet (1 POL)
        chainFees[1301] = 0.01 ether;         // Unichain
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
    ) external payable nonReentrant returns (address) {
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

    /// @notice Creates a new meme token with advanced features
    function createMemeToken(MemeTokenParams calldata params) external payable nonReentrant returns (address) {
        uint256 requiredFee = getChainFee();
        require(requiredFee > 0, "Chain not supported");
        require(msg.value >= requiredFee, "Insufficient creation fee");
        require(bytes(params.name).length > 0, "Name cannot be empty");
        require(bytes(params.symbol).length > 0, "Symbol cannot be empty");
        require(params.totalSupply > 0, "Supply must be > 0");
        require(params.marketingWallet != address(0), "Invalid marketing wallet");
        require(bytes(params.logoURI).length > 0, "Logo URI cannot be empty");

        // Calculate total required value
        uint256 totalRequired = requiredFee;
        if (params.addInitialLiquidity) {
            require(msg.value > requiredFee, "Must send ETH for initial liquidity");
            totalRequired = msg.value;
        }

        // Deploy token
        address payable token = payable(memeImplementation.clone());
        
        // Initialize token with creator as the initial token holder
        MemeToken(token).initialize(
            params.name,
            params.symbol,
            params.totalSupply,
            params.marketingWallet,
            params.communityFeePercent,
            params.liquidityFeePercent,
            params.burnFeePercent,
            params.maxWalletPercent,
            params.maxTxPercent,
            params.antiBot,
            params.autoLiquidity
        );

        // Enable trading immediately
        MemeToken(token).enableTrading();

        // Exclude factory and pair from limits and fees for initial setup
        MemeToken(token).excludeFromLimits(address(this), true);
        MemeToken(token).excludeFromLimits(MemeToken(token).uniswapV2Pair(), true);
        MemeToken(token).excludeFromFees(address(this), true);
        MemeToken(token).excludeFromFees(MemeToken(token).uniswapV2Pair(), true);
        MemeToken(token).excludeFromFees(address(defaultDex), true);  // Exclude router from fees
        
        // Store logo URI
        tokenLogos[token] = params.logoURI;

        // Transfer all tokens to the creator
        uint256 totalSupplyWithDecimals = params.totalSupply * (10 ** 18); // 18 decimals
        MemeToken(token).transfer(msg.sender, totalSupplyWithDecimals);

        // Handle initial liquidity if requested
        if (params.addInitialLiquidity) {
            uint256 tokensForLiquidity = (totalSupplyWithDecimals * params.initialLiquidityPercent) / 100;
            
            // Get tokens back from creator for liquidity
            MemeToken(token).transferFrom(msg.sender, address(this), tokensForLiquidity);
            
            // Approve router to spend tokens
            MemeToken(token).approve(address(defaultDex), tokensForLiquidity);
            
            // Add liquidity
            (,, uint256 liquidity) = IUniswapV2Router02(defaultDex).addLiquidityETH{value: msg.value - requiredFee}(
                token,
                tokensForLiquidity,
                0, // Accept any amount of tokens
                0, // Accept any amount of ETH
                msg.sender,
                block.timestamp + 300 // 5 minutes deadline
            );
            
            // Lock liquidity if requested
            if (params.liquidityLockPeriod > 0) {
                MemeToken(token).lockLiquidity(params.liquidityLockPeriod);
            }
            
            emit LiquidityAdded(token, tokensForLiquidity, msg.value - requiredFee, liquidity, params.liquidityLockPeriod);
        }

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

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FeeWithdrawn(owner(), balance);
    }

    /// @notice Fallback function to receive ETH
    receive() external payable {}
} 