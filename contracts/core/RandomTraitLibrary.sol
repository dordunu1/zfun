// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IRandomNFT.sol";

/**
 * @title RandomTraitLibrary
 * @dev Library for secure random trait generation and selection
 */
library RandomTraitLibrary {
    /**
     * @dev Generates a secure random seed
     * @param sender Address initiating the random generation
     * @param nonce Current nonce value
     * @param tokenId Token ID being minted
     * @return Random seed value
     */
    function generateSeed(
        address sender,
        uint256 nonce,
        uint256 tokenId
    ) internal view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    sender,
                    nonce,
                    tokenId,
                    blockhash(block.number - 1)
                )
            )
        );
    }

    /**
     * @dev Selects a trait value based on weights
     * @param seed Random seed for selection
     * @param values Possible trait values
     * @param weights Weight for each value (must sum to 100)
     * @return Selected trait value
     */
    function selectTraitValue(
        uint256 seed,
        string[] memory values,
        uint256[] memory weights
    ) internal pure returns (string memory) {
        require(
            values.length == weights.length,
            "Values and weights length mismatch"
        );
        require(values.length > 0, "No trait values provided");

        // Calculate total weight and validate weights
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            totalWeight += weights[i];
        }
        require(totalWeight == 100, "Weights must sum to 100");

        // Generate random number between 0 and total weight
        uint256 randomNumber = seed % 100;
        
        // Select trait based on weight distribution
        uint256 cumulativeWeight = 0;
        for (uint256 i = 0; i < weights.length; i++) {
            cumulativeWeight += weights[i];
            if (randomNumber < cumulativeWeight) {
                return values[i];
            }
        }

        // Fallback to last value (should never happen if weights sum to 100)
        return values[values.length - 1];
    }

    /**
     * @dev Calculates total possible combinations of traits
     * @param traits Array of trait configurations
     * @return Total number of possible combinations
     */
    function calculateCombinations(
        IRandomNFT.Trait[] memory traits
    ) internal pure returns (uint256) {
        if (traits.length == 0) return 0;
        
        uint256 combinations = 1;
        for (uint256 i = 0; i < traits.length; i++) {
            require(
                traits[i].values.length > 0,
                "Trait must have at least one value"
            );
            combinations *= traits[i].values.length;
        }
        return combinations;
    }

    /**
     * @dev Validates trait configuration
     * @param traits Array of trait configurations to validate
     */
    function validateTraits(
        IRandomNFT.Trait[] memory traits
    ) internal pure {
        for (uint256 i = 0; i < traits.length; i++) {
            require(
                traits[i].values.length == traits[i].weights.length,
                "Values and weights length mismatch"
            );
            require(
                traits[i].values.length > 0,
                "Trait must have at least one value"
            );
            
            uint256 totalWeight = 0;
            for (uint256 j = 0; j < traits[i].weights.length; j++) {
                totalWeight += traits[i].weights[j];
            }
            require(
                totalWeight == 100,
                "Weights must sum to 100"
            );
        }
    }
} 