// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRandomNFT {
    /**
     * @dev Struct for trait configuration
     * @param traitType Name of the trait category (e.g., "Background", "Eyes")
     * @param values Possible values for this trait
     * @param weights Probability weights for each value (must sum to 100)
     */
    struct Trait {
        string traitType;
        string[] values;
        uint256[] weights;
    }

    /**
     * @dev Struct for minting configuration
     */
    struct MintConfig {
        uint256 maxSupply;        // Maximum number of tokens that can be minted
        uint256 mintPrice;        // Price per mint in native token or ERC20
        uint256 maxPerWallet;     // Maximum tokens per wallet
        uint256 releaseDate;      // Start time for minting
        uint256 mintEndDate;      // End time for minting (0 for no end)
        bool infiniteMint;        // Whether minting continues after mintEndDate
        address paymentToken;     // ERC20 token address (address(0) for native)
        bool enableWhitelist;     // Whether whitelist is enabled
        uint96 royaltyFee;        // Royalty fee in basis points (e.g., 500 = 5%)
        address royaltyRecipient; // Address to receive royalties
    }

    /**
     * @dev Initializes the minting configuration
     * @param config The minting configuration to set
     */
    function initializeMintConfig(MintConfig calldata config) external;

    /**
     * @dev Configures team minting settings
     * @param teamMinter The address to configure for team minting
     * @param reservedAmount Amount of tokens reserved for team
     * @param isFreeReserved Whether minting is free for team
     * @param canClaimUnminted Whether team can claim unminted after whitelist
     */
    function configureTeamMinting(
        address teamMinter,
        uint256 reservedAmount,
        bool isFreeReserved,
        bool canClaimUnminted
    ) external;

    /**
     * @dev Sets the whitelist end time
     * @param endTime The timestamp when whitelist ends
     */
    function setWhitelistEndTime(uint256 endTime) external;

    /**
     * @dev Main minting function
     * @param quantity Number of tokens to mint
     */
    function mint(uint256 quantity) external payable;

    /**
     * @dev Batch minting function for whitelisted addresses
     * @param quantity Number of tokens to mint
     * @param merkleProof Proof of whitelist inclusion
     */
    function whitelistMint(
        uint256 quantity,
        bytes32[] calldata merkleProof
    ) external payable;

    /**
     * @dev Returns the traits of a specific token
     * @param tokenId Token ID to query
     * @return traitTypes Array of trait types
     * @return traitValues Array of trait values
     */
    function getTokenTraits(uint256 tokenId) 
        external 
        view 
        returns (
            string[] memory traitTypes,
            string[] memory traitValues
        );

    /**
     * @dev Returns the mint configuration
     */
    function getMintConfig() external view returns (MintConfig memory);

    /**
     * @dev Returns whether an address is whitelisted
     * @param user Address to check
     */
    function isWhitelisted(address user) external view returns (bool);

    /**
     * @dev Returns the total possible combinations of traits
     */
    function getTotalPossibleCombinations() external view returns (uint256);

    // Events
    event TokenMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string[] traitTypes,
        string[] traitValues
    );

    event RoyaltyUpdated(
        address indexed recipient,
        uint96 fee
    );

    event TraitsInitialized(
        string[] traitTypes,
        uint256 totalCombinations
    );
} 