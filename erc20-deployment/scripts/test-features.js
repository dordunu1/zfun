const { ethers } = require("hardhat");

async function main() {
    const tokenAddress = process.env.TOKEN_ADDRESS;
    if (!tokenAddress) {
        console.error("Please set TOKEN_ADDRESS environment variable");
        process.exit(1);
    }

    console.log("\n🔍 Testing token features for:", tokenAddress);

    const Token = await ethers.getContractFactory("MemeToken");
    const token = await Token.attach(tokenAddress);
    const [owner, addr1] = await ethers.getSigners();

    // 1. Get initial balances and settings
    console.log("\n📊 Initial State:");
    const totalSupply = await token.totalSupply();
    console.log("- Total Supply:", ethers.formatUnits(totalSupply, 18));
    
    const ownerBalance = await token.balanceOf(owner.address);
    console.log("- Owner Balance:", ethers.formatUnits(ownerBalance, 18));
    
    const marketingWallet = await token.marketingWallet();
    const marketingBalance = await token.balanceOf(marketingWallet);
    console.log("- Marketing Wallet:", marketingWallet);
    console.log("- Marketing Balance:", ethers.formatUnits(marketingBalance, 18));

    const deadBalance = await token.balanceOf("0x000000000000000000000000000000000000dEaD");
    console.log("- Burn Address Balance:", ethers.formatUnits(deadBalance, 18));

    // 2. Check fees
    console.log("\n💰 Fee Configuration:");
    const communityFee = await token.communityFeePercent();
    const liquidityFee = await token.liquidityFeePercent();
    const burnFee = await token.burnFeePercent();
    console.log("- Community Fee:", communityFee.toString(), "%");
    console.log("- Liquidity Fee:", liquidityFee.toString(), "%");
    console.log("- Burn Fee:", burnFee.toString(), "%");

    // 3. Check exclusions
    console.log("\n🔒 Address Exclusions:");
    const ownerExcluded = await token.isExcludedFromFees(owner.address);
    const tokenExcluded = await token.isExcludedFromFees(tokenAddress);
    const marketingExcluded = await token.isExcludedFromFees(marketingWallet);
    console.log("- Owner excluded from fees:", ownerExcluded);
    console.log("- Token excluded from fees:", tokenExcluded);
    console.log("- Marketing wallet excluded from fees:", marketingExcluded);

    // 4. Check liquidity settings
    console.log("\n💧 Liquidity Settings:");
    const pair = await token.uniswapV2Pair();
    const router = await token.uniswapV2Router();
    const minTokensBeforeSwap = await token.minTokensBeforeSwap();
    console.log("- Pair Address:", pair);
    console.log("- Router Address:", router);
    console.log("- Min Tokens Before Swap:", ethers.formatUnits(minTokensBeforeSwap, 18));

    // 5. Make a test transfer
    console.log("\n🔄 Performing test transfer...");
    try {
        // Use a test address
        const testAddress = "0x000000000000000000000000000000000000dEaD";
        
        // Transfer 1% of owner's balance
        const transferAmount = ownerBalance / BigInt(100);
        console.log("- Transfer Amount:", ethers.formatUnits(transferAmount, 18));
        
        // Perform transfer
        const tx = await token.transfer(testAddress, transferAmount);
        await tx.wait();
        console.log("✅ Transfer completed");

        // Get post-transfer balances
        const newMarketingBalance = await token.balanceOf(marketingWallet);
        const newDeadBalance = await token.balanceOf("0x000000000000000000000000000000000000dEaD");
        const contractBalance = await token.balanceOf(tokenAddress);

        console.log("\n📊 Post-Transfer State:");
        console.log("- Marketing Wallet New Balance:", ethers.formatUnits(newMarketingBalance, 18));
        console.log("- Burn Address New Balance:", ethers.formatUnits(newDeadBalance, 18));
        console.log("- Contract Balance:", ethers.formatUnits(contractBalance, 18));

        // Calculate and display fee amounts
        console.log("\n💰 Fee Collection:");
        console.log("- Marketing Fee Collected:", ethers.formatUnits(newMarketingBalance - marketingBalance, 18));
        console.log("- Tokens Burned:", ethers.formatUnits(newDeadBalance - deadBalance, 18));
        
    } catch (error) {
        console.error("❌ Transfer failed:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 