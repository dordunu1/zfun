const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const factory = await ethers.getContractFactory("UniswapV2Pair");
    
    // Get the bytecode
    const bytecode = factory.bytecode;
    
    // Calculate the INIT_CODE_HASH
    const COMPUTED_INIT_CODE_HASH = ethers.utils.keccak256(bytecode);
    
    console.log("COMPUTED_INIT_CODE_HASH:", COMPUTED_INIT_CODE_HASH);
    console.log("UNISWAP_INIT_CODE_HASH: 0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f");
    console.log("\nIf these are different (they should be if we modified the contracts),");
    console.log("we need to update UniswapV2Library.sol with our computed hash.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 