// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Template is ERC20 {
    uint8 private _decimals;
    bool private initialized;
    string private _storedName;
    string private _storedSymbol;

    // Empty constructor
    constructor() ERC20("", "") {}

    function initialize(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply_,
        address owner_
    ) external {
        require(!initialized, "Already initialized");
        require(owner_ != address(0), "Invalid owner address");
        
        initialized = true;
        _decimals = decimals_;
        _storedName = name_;
        _storedSymbol = symbol_;
        
        // Mint initial supply
        _mint(owner_, initialSupply_);
    }

    function name() public view virtual override returns (string memory) {
        return _storedName;
    }

    function symbol() public view virtual override returns (string memory) {
        return _storedSymbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
} 