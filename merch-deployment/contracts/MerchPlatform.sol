// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MerchPlatform is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    // Supported tokens
    IERC20 public USDT;
    IERC20 public USDC;
    
    // Platform fee percentage (5% = 500)
    uint256 public platformFeePercentage = 500;
    uint256 public constant PERCENTAGE_DENOMINATOR = 10000;

    struct Order {
        uint256 orderId;
        address buyer;
        address seller;
        address token;      // USDT or USDC address
        uint256 amount;
        bool isCompleted;
        uint256 timestamp;
    }

    // Seller balances for each token
    mapping(address => mapping(address => uint256)) public sellerBalances; // seller => token => amount
    // Platform fees for each token
    mapping(address => uint256) public platformFees; // token => amount
    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;

    event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, address token, uint256 amount);
    event WithdrawalRequested(address indexed seller, address token, uint256 amount);
    event WithdrawalApproved(address indexed seller, address token, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);
    event PlatformFeeWithdrawn(address indexed token, uint256 amount);

    constructor(address _usdt, address _usdc) {
        USDT = IERC20(_usdt);
        USDC = IERC20(_usdc);
        _pause(); // Start paused for safety
    }

    function createOrder(address _seller, address _token, uint256 _amount) external nonReentrant whenNotPaused {
        require(_token == address(USDT) || _token == address(USDC), "Unsupported token");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 platformFee = _amount * platformFeePercentage / PERCENTAGE_DENOMINATOR;
        uint256 sellerAmount = _amount - platformFee;

        // Transfer tokens from buyer to contract
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        // Create order
        orders[nextOrderId] = Order({
            orderId: nextOrderId,
            buyer: msg.sender,
            seller: _seller,
            token: _token,
            amount: sellerAmount,
            isCompleted: false,
            timestamp: block.timestamp
        });

        // Update seller's balance and platform fees
        sellerBalances[_seller][_token] += sellerAmount;
        platformFees[_token] += platformFee;

        emit OrderCreated(nextOrderId, msg.sender, _seller, _token, _amount);
        nextOrderId++;
    }

    function requestWithdrawal(address _token, uint256 _amount) external nonReentrant {
        require(_token == address(USDT) || _token == address(USDC), "Unsupported token");
        require(sellerBalances[msg.sender][_token] >= _amount, "Insufficient balance");

        emit WithdrawalRequested(msg.sender, _token, _amount);
    }

    function approveWithdrawal(address _seller, address _token, uint256 _amount) external onlyOwner nonReentrant {
        require(sellerBalances[_seller][_token] >= _amount, "Insufficient balance");
        
        sellerBalances[_seller][_token] -= _amount;
        
        // Transfer tokens to seller
        IERC20(_token).safeTransfer(_seller, _amount);

        emit WithdrawalApproved(_seller, _token, _amount);
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    // Get available platform fees for a token
    function getPlatformFees(address _token) external view returns (uint256) {
        require(_token == address(USDT) || _token == address(USDC), "Unsupported token");
        return platformFees[_token];
    }

    // Admin can withdraw platform fees
    function withdrawPlatformFees(address _token, uint256 _amount) external onlyOwner {
        require(_token == address(USDT) || _token == address(USDC), "Unsupported token");
        require(platformFees[_token] >= _amount, "Insufficient platform fees");
        
        platformFees[_token] -= _amount;
        IERC20(_token).safeTransfer(owner(), _amount);
        
        emit PlatformFeeWithdrawn(_token, _amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
} 