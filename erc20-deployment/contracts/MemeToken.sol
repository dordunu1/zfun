// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract MemeToken is ERC20, Ownable, ReentrancyGuard {
    using Address for address;

    // Token metadata storage
    string private _storedName;
    string private _storedSymbol;
    
    // Fees and wallets
    uint256 public communityFeePercent;
    uint256 public liquidityFeePercent;
    uint256 public burnFeePercent;
    address public marketingWallet;
    
    // Transaction limits
    uint256 public maxWalletAmount;
    uint256 public maxTransactionAmount;
    
    // Anti-bot
    bool public antiBotEnabled;
    mapping(address => bool) public isBot;
    uint256 public tradingEnabledTimestamp;
    uint256 public constant BOT_PROTECTION_PERIOD = 60; // 60 seconds after trading enabled
    
    // Liquidity
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;
    bool public autoLiquidityEnabled;
    uint256 public minTokensBeforeSwap;
    
    // Trading
    bool public tradingEnabled;
    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromLimits;
    
    // Router addresses for different networks
    mapping(uint256 => address) public networkRouters;
    
    // Events
    event TradingEnabled(uint256 timestamp);
    event ExcludedFromFees(address indexed account, bool isExcluded);
    event ExcludedFromLimits(address indexed account, bool isExcluded);
    event MarketingWalletUpdated(address indexed newWallet);
    event BotAddressIdentified(address indexed botAddress);
    event SwapAndLiquify(uint256 tokensSwapped, uint256 polReceived, uint256 tokensIntoLiquidity);
    event LiquidityAdded(
        uint256 tokenAmount,
        uint256 ethAmount,
        uint256 liquidity
    );

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address marketingWallet_,
        uint256 communityFeePercent_,
        uint256 liquidityFeePercent_,
        uint256 burnFeePercent_,
        uint256 maxWalletPercent_,
        uint256 maxTxPercent_,
        bool antiBot_,
        bool autoLiquidity_
    ) ERC20("", "") Ownable() {
        _storedName = name_;
        _storedSymbol = symbol_;
        
        require(marketingWallet_ != address(0), "Marketing wallet cannot be zero address");
        require(communityFeePercent_ + liquidityFeePercent_ + burnFeePercent_ <= 25, "Total fees cannot exceed 25%");
        
        // Set router addresses for different networks
        networkRouters[11155111] = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // Sepolia
        networkRouters[137] = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;      // Polygon (QuickSwap)
        networkRouters[1301] = 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640;     // Unichain
        networkRouters[1828369849] = 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640; // Moonwalker

        // Set up exclusions FIRST
        _isExcludedFromLimits[msg.sender] = true;
        _isExcludedFromFees[msg.sender] = true;
        _isExcludedFromFees[address(this)] = true;
        
        // Set up marketing wallet
        marketingWallet = marketingWallet_;
        _isExcludedFromFees[marketingWallet_] = true;
        _isExcludedFromLimits[marketingWallet_] = true;
        
        // Set fees
        communityFeePercent = communityFeePercent_;
        liquidityFeePercent = liquidityFeePercent_;
        burnFeePercent = burnFeePercent_;
        
        // Initialize router and pair
        address routerAddress = networkRouters[block.chainid];
        require(routerAddress != address(0), "Unsupported network");
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(routerAddress);
        uniswapV2Router = _uniswapV2Router;
        
        // Exclude router from fees and limits
        _isExcludedFromFees[address(_uniswapV2Router)] = true;
        _isExcludedFromLimits[address(_uniswapV2Router)] = true;
        
        // Create and exclude pair
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        _isExcludedFromLimits[uniswapV2Pair] = true;
        
        // Set other parameters
        antiBotEnabled = antiBot_;
        autoLiquidityEnabled = autoLiquidity_;
        minTokensBeforeSwap = 300 * 10**decimals();
        
        // Calculate and set limits
        maxWalletAmount = (totalSupply_ * 10**decimals() * maxWalletPercent_) / 100;
        maxTransactionAmount = (totalSupply_ * 10**decimals() * maxTxPercent_) / 100;
        
        // Finally, mint tokens
        _mint(msg.sender, totalSupply_ * 10**decimals());
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address marketingWallet_,
        uint256 communityFeePercent_,
        uint256 liquidityFeePercent_,
        uint256 burnFeePercent_,
        uint256 maxWalletPercent_,
        uint256 maxTxPercent_,
        bool antiBot_,
        bool autoLiquidity_
    ) external {
        require(owner() == address(0), "Already initialized");
        require(marketingWallet_ != address(0), "Marketing wallet cannot be zero address");
        require(communityFeePercent_ + liquidityFeePercent_ + burnFeePercent_ <= 25, "Total fees cannot exceed 25%");
        
        // Store name and symbol
        _storedName = name_;
        _storedSymbol = symbol_;
        
        // Initialize ownership
        _transferOwnership(msg.sender);
        
        // Set router addresses for different networks
        networkRouters[11155111] = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008; // Sepolia
        networkRouters[130] = 0x284F11109359a7e1306C3e447ef14D38400063FF;      // Unichain Mainnet
        networkRouters[137] = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;      // Polygon (QuickSwap)
        networkRouters[1301] = 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640;     // Unichain
        networkRouters[1828369849] = 0x920b806E40A00E02E7D2b94fFc89860fDaEd3640; // Moonwalker

        // Set up exclusions FIRST, before any token operations
        _isExcludedFromLimits[msg.sender] = true;
        _isExcludedFromFees[msg.sender] = true;
        _isExcludedFromFees[address(this)] = true;
        
        // Set up fees and limits
        marketingWallet = marketingWallet_;
        _isExcludedFromFees[marketingWallet_] = true;
        _isExcludedFromLimits[marketingWallet_] = true;
        
        communityFeePercent = communityFeePercent_;
        liquidityFeePercent = liquidityFeePercent_;
        burnFeePercent = burnFeePercent_;
        
        // Calculate limits
        maxWalletAmount = (totalSupply_ * 10**decimals() * maxWalletPercent_) / 100;
        maxTransactionAmount = (totalSupply_ * 10**decimals() * maxTxPercent_) / 100;
        
        // Initialize router and pair
        address routerAddress = networkRouters[block.chainid];
        require(routerAddress != address(0), "Unsupported network");
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(routerAddress);
        uniswapV2Router = _uniswapV2Router;
        
        // Exclude router from fees and limits
        _isExcludedFromFees[address(_uniswapV2Router)] = true;
        _isExcludedFromLimits[address(_uniswapV2Router)] = true;
        
        // Create and exclude pair
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());
        _isExcludedFromLimits[uniswapV2Pair] = true;
        
        // Set other parameters
        antiBotEnabled = antiBot_;
        autoLiquidityEnabled = autoLiquidity_;
        minTokensBeforeSwap = 300 * 10**decimals();
        
        // Finally, mint tokens after all setup is complete
        _mint(msg.sender, totalSupply_ * 10**decimals());
        
        // Enable trading by default
        tradingEnabled = true;
        tradingEnabledTimestamp = block.timestamp;
        emit TradingEnabled(block.timestamp);
    }
    
    // Override name and symbol functions
    function name() public view virtual override returns (string memory) {
        return _storedName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _storedSymbol;
    }
    
    // Override transfer function to implement fees and limits
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(from != address(0), "ERC20: transfer from zero address");
        require(to != address(0), "ERC20: transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Check if trading is enabled
        if (!_isExcludedFromFees[from] && !_isExcludedFromFees[to]) {
            require(tradingEnabled, "Trading not enabled yet");
        }
        
        // Check for bots during protection period
        if (antiBotEnabled && 
            block.timestamp < tradingEnabledTimestamp + BOT_PROTECTION_PERIOD) {
            require(!isBot[from] && !isBot[to], "Bot detected");
        }
        
        // Check transaction limits for everyone except excluded addresses
        if (!_isExcludedFromLimits[from] && !_isExcludedFromLimits[to]) {
            require(amount <= maxTransactionAmount, "Transfer amount exceeds max transaction limit");
            
            // Check wallet limits only for non-excluded recipients and non-pair addresses
            if (to != uniswapV2Pair) {
                uint256 recipientBalance = balanceOf(to);
                require(recipientBalance + amount <= maxWalletAmount, "Max wallet limit exceeded");
            }
        }
        
        // Handle fees
        bool takeFee = true;
        
        // Only skip fees for:
        // 1. Initial liquidity addition by owner
        // 2. Contract's own swap and liquify operations
        if ((to == uniswapV2Pair && from == owner()) || 
            (from == address(this)) || 
            (from == address(uniswapV2Router)) ||
            (to == address(uniswapV2Router))) {
            takeFee = false;
        }
        
        if (!takeFee) {
            super._transfer(from, to, amount);
        } else {
            uint256 fees = 0;
            bool isSwap = from == uniswapV2Pair || to == uniswapV2Pair;
            
            // Calculate fees - apply on both transfers and swaps
            if (communityFeePercent > 0) {
                uint256 communityFee = (amount * communityFeePercent) / 100;
                super._transfer(from, marketingWallet, communityFee);
                fees += communityFee;
            }
            
            if (burnFeePercent > 0) {
                uint256 burnFee = (amount * burnFeePercent) / 100;
                super._transfer(from, address(0xdead), burnFee);
                fees += burnFee;
            }
            
            if (liquidityFeePercent > 0 && autoLiquidityEnabled) {
                uint256 liquidityFee = (amount * liquidityFeePercent) / 100;
                super._transfer(from, address(this), liquidityFee);
                fees += liquidityFee;
                
                // Handle auto-liquidity only on swaps to prevent double swapping
                if (isSwap && balanceOf(address(this)) >= minTokensBeforeSwap) {
                    swapAndLiquify();
                }
            }
            
            // Transfer remaining amount
            super._transfer(from, to, amount - fees);
        }
    }
    
    // Swap tokens for ETH and add liquidity
    function swapAndLiquify() private {
        uint256 contractTokenBalance = balanceOf(address(this));
        uint256 half = contractTokenBalance / 2;
        uint256 otherHalf = contractTokenBalance - half;
        
        uint256 initialBalance = address(this).balance;
        
        // Swap tokens for ETH
        swapTokensForEth(half);
        
        uint256 newBalance = address(this).balance - initialBalance;
        
        // Add liquidity
        addLiquidity(otherHalf, newBalance);
        
        emit SwapAndLiquify(half, newBalance, otherHalf);
    }
    
    // Helper function to swap tokens for ETH
    function swapTokensForEth(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();
        
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        
        // Swap tokens for ETH
        try uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        ) {} catch {}
    }
    
    // Helper function to add liquidity
    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        _approve(address(this), address(uniswapV2Router), tokenAmount);
        
        // Add liquidity
        try uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        ) {} catch {}
    }
    
    // Admin functions
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
        tradingEnabledTimestamp = block.timestamp;
        emit TradingEnabled(block.timestamp);
    }
    
    function setMarketingWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Marketing wallet cannot be zero address");
        marketingWallet = newWallet;
        emit MarketingWalletUpdated(newWallet);
    }
    
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }
    
    function excludeFromLimits(address account, bool excluded) external onlyOwner {
        _isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }
    
    function identifyBot(address botAddress) external onlyOwner {
        require(antiBotEnabled, "Anti-bot protection is not enabled");
        isBot[botAddress] = true;
        emit BotAddressIdentified(botAddress);
    }
    
    // View functions
    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }
    
    function isExcludedFromLimits(address account) public view returns (bool) {
        return _isExcludedFromLimits[account];
    }
    
    // Override _transfer to handle basic checks
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    // Required for receiving ETH
    receive() external payable {}
} 