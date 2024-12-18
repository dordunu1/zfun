const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
    
    // Get the creation bytecode (not the runtime bytecode)
    const bytecode = UniswapV2Pair.bytecode;
    
    // Calculate the INIT_CODE_HASH
    const COMPUTED_INIT_CODE_HASH = ethers.utils.keccak256(bytecode);
    
    console.log("COMPUTED_INIT_CODE_HASH:", COMPUTED_INIT_CODE_HASH);
    console.log("UNISWAP_INIT_CODE_HASH: 0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f");
    
    // Also output the bytecode for verification
    console.log("\nPair Creation Bytecode Length:", bytecode.length);
    console.log("First 100 chars of bytecode:", bytecode.substring(0, 100));
    
    // Check if our computed hash matches Uniswap's
    if (COMPUTED_INIT_CODE_HASH === "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f") {
        console.log("\nSuccess: Our computed hash matches Uniswap's!");
    } else {
        console.log("\nNote: Our hash is different from Uniswap's.");
        console.log("This is expected if we've made any modifications to the pair contract.");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 