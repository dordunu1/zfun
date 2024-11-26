// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Template is ERC20 {
    uint8 private _decimals;
    bool private initialized;

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
        
        // Set name and symbol using internal functions
        _update_name(name_);
        _update_symbol(symbol_);
        
        // Mint initial supply
        _mint(owner_, initialSupply_);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // Internal functions to update name and symbol
    function _update_name(string memory name_) internal {
        assembly {
            sstore(0x0, name_)
        }
    }

    function _update_symbol(string memory symbol_) internal {
        assembly {
            sstore(0x1, symbol_)
        }
    }
}