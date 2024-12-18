const { ethers } = require("hardhat");

async function main() {
    const FACTORY_ADDRESS = "0xAE3511d8ad1bD1bDAdF8dF44d3158ED5aeF72703";
    const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
    const USDT = "0x148b1aB3e2321d79027C4b71B6118e70434B4784";

    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("Using signer:", signer.address);

    // Get factory contract
    const factory = await ethers.getContractAt("UniswapV2Factory", FACTORY_ADDRESS, signer);
    
    // Check if pair exists
    const existingPair = await factory.getPair(WETH, USDT);
    console.log("Existing pair:", existingPair);
    
    if (existingPair !== ethers.constants.AddressZero) {
        console.log("Pair already exists");
        return;
    }

    // Get gas estimate for createPair
    const gasEstimate = await factory.estimateGas.createPair(WETH, USDT);
    console.log("Gas estimate for createPair:", gasEstimate.toString());

    // Create pair with optimized gas settings
    console.log("Creating pair...");
    const tx = await factory.createPair(WETH, USDT, {
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
    });
    
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Get the created pair address from the event
    const pairCreatedEvent = receipt.logs.find(log => {
        const topics = log.topics || [];
        return topics[0] === ethers.id('PairCreated(address,address,address,uint256)');
    });

    if (pairCreatedEvent) {
        const decodedData = factory.interface.parseLog({
            topics: pairCreatedEvent.topics,
            data: pairCreatedEvent.data
        });
        console.log("Created pair address:", decodedData.args[2]);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 