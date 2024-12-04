// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title RoyaltyEnforcer
 * @dev Abstract contract implementing EIP-2981 NFT Royalty Standard
 */
abstract contract RoyaltyEnforcer is IERC2981, ERC165, Ownable {
    /// @dev Royalty info
    struct RoyaltyInfo {
        address receiver;
        uint96 royaltyFraction;
    }

    /// @dev Store the royalty info
    RoyaltyInfo private _royaltyInfo;

    /// @dev Maximum royalty fee of 10% (10000 = 100%, 1000 = 10%)
    uint96 public constant MAX_ROYALTY_FEE = 1000;

    /// @dev Emitted when royalty info is changed
    event RoyaltyInfoUpdated(
        address indexed oldReceiver,
        address indexed newReceiver,
        uint96 oldFraction,
        uint96 newFraction
    );

    /**
     * @dev Constructor
     * @param initialOwner The initial owner of the contract
     * @param royaltyReceiver Address to receive royalties
     * @param royaltyFraction Royalty percentage (in basis points)
     */
    constructor(
        address initialOwner,
        address royaltyReceiver,
        uint96 royaltyFraction
    ) Ownable(initialOwner) {
        _setRoyaltyInfo(royaltyReceiver, royaltyFraction);
    }

    /**
     * @inheritdoc IERC2981
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (
        address receiver,
        uint256 royaltyAmount
    ) {
        RoyaltyInfo memory royalty = _royaltyInfo;
        return (
            royalty.receiver,
            (salePrice * royalty.royaltyFraction) / 10000
        );
    }

    /**
     * @dev Updates the royalty information for the contract
     * @param receiver Address to receive royalties
     * @param feeNumerator Fee percentage (in basis points)
     */
    function setRoyaltyInfo(
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        _setRoyaltyInfo(receiver, feeNumerator);
    }

    /**
     * @dev Internal function to set the royalty info
     * @param receiver Address to receive royalties
     * @param feeNumerator Fee percentage (in basis points)
     */
    function _setRoyaltyInfo(
        address receiver,
        uint96 feeNumerator
    ) internal {
        require(
            receiver != address(0),
            "RoyaltyEnforcer: Invalid receiver"
        );
        require(
            feeNumerator <= MAX_ROYALTY_FEE,
            "RoyaltyEnforcer: Fee exceeds maximum"
        );

        address oldReceiver = _royaltyInfo.receiver;
        uint96 oldFraction = _royaltyInfo.royaltyFraction;

        _royaltyInfo = RoyaltyInfo(receiver, feeNumerator);

        emit RoyaltyInfoUpdated(
            oldReceiver,
            receiver,
            oldFraction,
            feeNumerator
        );
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns the current royalty info
     */
    function getRoyaltyInfo() external view returns (
        address receiver,
        uint96 feeNumerator
    ) {
        return (
            _royaltyInfo.receiver,
            _royaltyInfo.royaltyFraction
        );
    }
} 