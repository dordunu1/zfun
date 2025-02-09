// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC20Template.sol";
import "./MemeToken.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

/// @title Token Factory Contract
/// @notice Factory contract for creating new ERC20 tokens
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
    event LiquidityAdded(address indexed token, uint256 tokenAmount, uint256 maticAmount);
    event LiquidityAdditionFailed(address indexed token, uint256 tokenAmount, uint256 maticAmount);

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
        uint256 liquidityLockPeriod;  // New field for lock period in days
    }

    struct DEXConfig {
        address router;
        address factory;
        string name;
        bool isActive;
    }

    mapping(uint256 => DEXConfig) public dexConfigs;
    address public defaultDex;

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
        chainFees[137] = 20 ether;            // Polygon Mainnet
        chainFees[1301] = 0.01 ether;         // Unichain
        chainFees[1828369849] = 0.01 ether;   // Moonwalker

        // Configure DEXes for all supported networks
        
        // Sepolia - Uniswap V2
        dexConfigs[11155111] = DEXConfig({
            router: 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3,  // Uniswap V2 Router on Sepolia
            factory: 0xF62c03E08ada871A0bEb3097762E269862E260a7, // Uniswap V2 Factory on Sepolia
            name: "Uniswap V2",
            isActive: true
        });

        // Polygon - QuickSwap
        dexConfigs[137] = DEXConfig({
            router: 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff,  // QuickSwap Router
            factory: 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32, // QuickSwap Factory
            name: "QuickSwap",
            isActive: true
        });

        // Unichain - Uniswap V2
        dexConfigs[1301] = DEXConfig({
            router: 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640,  // Unichain Router
            factory: 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f, // Unichain Factory
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

        address token = standardImplementation.clone();
        ERC20Template(token).initialize(name, symbol, decimals, initialSupply, msg.sender);
        
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

    /// @notice Creates a new meme token with optional initial liquidity
    function createMemeToken(
        MemeTokenParams calldata params
    ) external payable nonReentrant returns (address) {
        uint256 requiredFee = getChainFee();
        require(requiredFee > 0, "Chain not supported");
        require(msg.value >= requiredFee, "Insufficient creation fee");
        require(bytes(params.name).length > 0, "Name cannot be empty");
        require(bytes(params.symbol).length > 0, "Symbol cannot be empty");
        require(bytes(params.logoURI).length > 0, "Logo URI cannot be empty");
        require(params.marketingWallet != address(0), "Invalid marketing wallet");
        require(params.communityFeePercent + params.liquidityFeePercent + params.burnFeePercent <= 25, "Total fees too high");

        // Calculate total required value
        uint256 totalRequired = requiredFee;
        if (params.addInitialLiquidity) {
            require(msg.value > requiredFee, "Must send MATIC for initial liquidity");
        }

        // Deploy token
        address token = memeImplementation.clone();
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
        
        tokenLogos[token] = params.logoURI;

        // Handle initial liquidity if requested
        if (params.addInitialLiquidity) {
            uint256 liquidityAmount = msg.value - requiredFee;
            uint256 tokensForLiquidity = (params.totalSupply * params.initialLiquidityPercent) / 100;
            
            // Transfer tokens to this contract
            MemeToken(token).transfer(address(this), tokensForLiquidity);
            
            // Approve DEX router
            MemeToken(token).approve(defaultDex, tokensForLiquidity);
            
            // Add liquidity
            try IUniswapV2Router02(defaultDex).addLiquidityETH{value: liquidityAmount}(
                token,
                tokensForLiquidity,
                0, // Accept any amount of tokens
                0, // Accept any amount of MATIC
                msg.sender, // LP tokens go to token creator
                block.timestamp + 300 // 5 minutes deadline
            ) {
                emit LiquidityAdded(token, tokensForLiquidity, liquidityAmount);
            } catch {
                // If liquidity addition fails, return MATIC to user
                (bool success, ) = msg.sender.call{value: liquidityAmount}("");
                require(success, "Failed to return MATIC");
                emit LiquidityAdditionFailed(token, tokensForLiquidity, liquidityAmount);
            }
        }
        
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

    /// @notice Withdraws accumulated fees
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
        
        emit FeeWithdrawn(owner(), balance);
    }

    function updateDexConfig(
        uint256 chainId,
        address router,
        address factory,
        string memory name,
        bool isActive
    ) external onlyOwner {
        dexConfigs[chainId] = DEXConfig({
            router: router,
            factory: factory,
            name: name,
            isActive: isActive
        });
    }

    function setDefaultDex(address router) external onlyOwner {
        require(router != address(0), "Invalid router address");
        defaultDex = router;
    }

    function getDexInfo(uint256 chainId) external view returns (
        address router,
        address factory,
        string memory name,
        bool isActive
    ) {
        DEXConfig memory config = dexConfigs[chainId];
        return (config.router, config.factory, config.name, config.isActive);
    }
}