const { ethers } = require("hardhat");

async function main() {
    const FACTORY_ADDRESS = "0xAE3511d8ad1bD1bDAdF8dF44d3158ED5aeF72703";
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const USDT = "0x148b1aB3e2321d79027C4b71B6118e70434B4784";

    // Get factory contract
    const factory = await ethers.getContractAt("UniswapV2Factory", FACTORY_ADDRESS);
    
    // Get actual pair address
    const actualPairAddress = await factory.getPair(WETH, USDT);
    console.log("\nActual pair address:", actualPairAddress);

    // Get the deployed pair's bytecode
    const deployedBytecode = await ethers.provider.getCode(actualPairAddress);
    console.log("\nDeployed pair bytecode length:", deployedBytecode.length);

    // Get our pair contract factory
    const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
    const creationBytecode = UniswapV2Pair.bytecode;
    
    // Calculate hash from creation bytecode
    const COMPUTED_INIT_CODE_HASH = ethers.utils.keccak256(creationBytecode);
    console.log("\nOur computed INIT_CODE_HASH:", COMPUTED_INIT_CODE_HASH);

    // Calculate expected pair address
    const [token0, token1] = WETH.toLowerCase() < USDT.toLowerCase() 
        ? [WETH, USDT] 
        : [USDT, WETH];
    
    const salt = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ['address', 'address'],
            [token0, token1]
        )
    );
    
    const expectedPairAddress = ethers.utils.getCreate2Address(
        FACTORY_ADDRESS,
        salt,
        COMPUTED_INIT_CODE_HASH
    );
    
    console.log("\nExpected pair address:", expectedPairAddress);
    console.log("Addresses match:", expectedPairAddress.toLowerCase() === actualPairAddress.toLowerCase());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 