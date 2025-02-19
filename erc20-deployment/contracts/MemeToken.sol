// SPDX-License-Identifier: MIT

/* @author
* ████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗
*    ██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
*    ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
*    ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
*    ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║
*    ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
* ███████╗ █████╗  ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗
* ██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
* █████╗  ███████║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝ 
* ██╔══╝  ██╔══██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝  
* ██║     ██║  ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║   
* ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
*
* @custom: version 2.0.0
*/

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

interface IUniswapV2Factory {
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

contract MemeToken is ERC20, ERC20Snapshot, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    // Trading control flags
    bool public tradingActive = true;
    uint256 public tradingEnabledTimestamp;
    bool private initialized;

    // Fee addresses
    address public DEV_ADDRESS;
    address public MARKETING_WALLET;
    address public LIQUIDITY_ADDRESS;
    address public TREASURY_ADDRESS;
    address public constant DEAD_ADDRESS = address(0xdead);

    // Fee percentages - set from frontend
    uint256 public burnFee;      
    uint256 public treasuryFee;
    uint256 public devFee;
    uint256 public marketingFee;
    uint256 public liquidityFee;

    // Buy/Sell fees - set from frontend
    uint256 public buyFees;
    uint256 public sellFees;

    // Router and pair
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    // Mappings
    mapping(address => bool) public automatedMarketMakerPairs;
    mapping(address => bool) public isBlacklisted;
    mapping(address => bool) private _isExcludedFromFees;

    // Events
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);

    // Modifiers
    modifier checkBlacklist(address addrs, address addrs2) {
        require(!isBlacklisted[addrs], "Sender or receiver is blacklisted!");
        require(!isBlacklisted[addrs2], "Sender or receiver is blacklisted!");
        _;
    }

    string private _tokenName;
    string private _tokenSymbol;

    constructor() ERC20("", "") {
        // Empty constructor for proxy initialization
    }

    function name() public view virtual override returns (string memory) {
        return _tokenName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _tokenSymbol;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address treasuryAddress_,
        address devAddress_,
        address marketingWallet_,
        address liquidityAddress_,
        uint256 burnFee_,
        uint256 treasuryFee_,
        uint256 devFee_,
        uint256 marketingFee_,
        uint256 liquidityFee_,
        uint256 buyFees_,
        uint256 sellFees_,
        address router_
    ) external {
        require(!initialized, "Already initialized");
        require(router_ != address(0), "Router address cannot be zero");
        
        // Set owner to msg.sender FIRST
        _transferOwnership(msg.sender);

        // Set name and symbol
        _tokenName = name_;
        _tokenSymbol = symbol_;
        
        // Set fee addresses
        TREASURY_ADDRESS = treasuryAddress_;
        DEV_ADDRESS = devAddress_;
        MARKETING_WALLET = marketingWallet_;
        LIQUIDITY_ADDRESS = liquidityAddress_;

        // Set fee percentages
        burnFee = burnFee_;         // Already in basis points
        treasuryFee = treasuryFee_; // Already in basis points
        devFee = devFee_;          // Already in basis points
        marketingFee = marketingFee_; // Already in basis points
        liquidityFee = liquidityFee_; // Already in basis points

        // Set buy/sell fees
        buyFees = buyFees_;        // Already in basis points
        sellFees = sellFees_;      // Already in basis points

        // Calculate total supply with decimals
        uint256 totalSupplyWithDecimals = totalSupply_ * (10 ** 18);

        // Setup router and create pair
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(router_);
        uniswapV2Router = _uniswapV2Router;
        
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

        automatedMarketMakerPairs[uniswapV2Pair] = true;

        // Mint tokens directly to the original transaction sender (the creator)
        _mint(tx.origin, totalSupplyWithDecimals);

        // Mark as initialized
        initialized = true;

        // Enable trading by default
        tradingActive = true;
        tradingEnabledTimestamp = block.timestamp;
    }

    receive() external payable {}

    // Snapshot functionality
    function snapshot() public onlyOwner {
        _snapshot();
    }

    // Blacklist management
    function setBlacklist(address[] memory addresses, bool[] memory states) public onlyOwner {
        require(addresses.length == states.length, "Arrays must be same length");
        for (uint256 i = 0; i < addresses.length; i++) {
            isBlacklisted[addresses[i]] = states[i];
        }
    }

    // AMM pair management
    function setAutomatedMarketMakerPair(address pair, bool value) public onlyOwner {
        require(pair != uniswapV2Pair, "Cannot remove initial pair");
        automatedMarketMakerPairs[pair] = value;
    }

    // Core transfer functionality
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(initialized, "Not initialized");
        require(tradingActive, "Trading not active");

        // For normal wallet-to-wallet transfers, skip DEX-related logic
        if (!automatedMarketMakerPairs[from] && !automatedMarketMakerPairs[to]) {
            super._transfer(from, to, amount);
            return;
        }

        // Handle fees
        bool takeFee = true;
        
        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
            takeFee = false;
        }

        if (takeFee) {
            uint256 fees = 0;
            
            // Calculate fees for sells
            if (automatedMarketMakerPairs[to] && sellFees > 0) {
                fees = amount.mul(sellFees).div(10000);
            }
            // Calculate fees for buys
            else if (automatedMarketMakerPairs[from] && buyFees > 0) {
                fees = amount.mul(buyFees).div(10000);
            }

            if (fees > 0) {
                // Calculate individual fee amounts
                uint256 totalFeeBasis = treasuryFee + devFee + marketingFee + liquidityFee + burnFee;
                
                if (burnFee > 0) {
                    uint256 burnAmount = fees.mul(burnFee).div(totalFeeBasis);
                    super._transfer(from, DEAD_ADDRESS, burnAmount);
                }
                
                if (treasuryFee > 0) {
                    uint256 treasuryAmount = fees.mul(treasuryFee).div(totalFeeBasis);
                    super._transfer(from, TREASURY_ADDRESS, treasuryAmount);
                }
                
                if (devFee > 0) {
                    uint256 devAmount = fees.mul(devFee).div(totalFeeBasis);
                    super._transfer(from, DEV_ADDRESS, devAmount);
                }
                
                if (marketingFee > 0) {
                    uint256 marketingAmount = fees.mul(marketingFee).div(totalFeeBasis);
                    super._transfer(from, MARKETING_WALLET, marketingAmount);
                }
                
                if (liquidityFee > 0) {
                    uint256 liquidityAmount = fees.mul(liquidityFee).div(totalFeeBasis);
                    super._transfer(from, LIQUIDITY_ADDRESS, liquidityAmount);
                }

                amount = amount.sub(fees);
            }
        }

        super._transfer(from, to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }
}
