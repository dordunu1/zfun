const { ethers } = require("hardhat");

async function main() {
  console.log("Starting feature verification on Unichain...");
  
  // Get the deployed token contract
  const tokenAddress = process.env.TOKEN_ADDRESS;
  if (!tokenAddress) {
    console.error("Please set TOKEN_ADDRESS environment variable");
    process.exit(1);
  }
  console.log("Verifying token at address:", tokenAddress);

  const Token = await ethers.getContractFactory("MemeToken");
  const token = await Token.attach(tokenAddress);
  
  console.log("\n1. Verifying Auto-Liquidity");
  // Listen for SwapAndLiquify events
  token.on("SwapAndLiquify", (tokensSwapped, ethReceived, tokensIntoLiquidity) => {
    console.log("Auto-Liquidity Event Detected:");
    console.log("- Tokens Swapped:", ethers.formatUnits(tokensSwapped, 18));
    console.log("- ETH Received:", ethers.formatUnits(ethReceived, 18));
    console.log("- Tokens Added to Liquidity:", ethers.formatUnits(tokensIntoLiquidity, 18));
  });

  // Get initial liquidity info
  const router = await token.uniswapV2Router();
  console.log("Uniswap Router:", router);
  const pair = await token.uniswapV2Pair();
  console.log("Liquidity Pair:", pair);

  console.log("\n2. Verifying Max Limits");
  const [owner, user1] = await ethers.getSigners();
  console.log("Testing with owner address:", owner.address);
  
  try {
    const totalSupply = await token.totalSupply();
    console.log("Total Supply:", ethers.formatUnits(totalSupply, 18));
    const maxTxAmount = await token.maxTransactionAmount();
    console.log("Max Transaction Amount:", ethers.formatUnits(maxTxAmount, 18));
    const maxWalletAmount = await token.maxWalletAmount();
    console.log("Max Wallet Amount:", ethers.formatUnits(maxWalletAmount, 18));
  } catch (error) {
    console.log("Error getting limits:", error.message);
  }

  console.log("\n3. Verifying Anti-Bot Protection");
  try {
    const tradingEnabled = await token.tradingEnabled();
    console.log("Trading Enabled:", tradingEnabled);
    const antiBotEnabled = await token.antiBotEnabled();
    console.log("Anti-Bot Enabled:", antiBotEnabled);
    if (antiBotEnabled) {
      const protectionPeriod = await token.BOT_PROTECTION_PERIOD();
      console.log("Bot Protection Period:", protectionPeriod.toString(), "seconds");
    }
  } catch (error) {
    console.log("Error checking anti-bot:", error.message);
  }

  console.log("\n4. Verifying Fees and Burn");
  try {
    const communityFee = await token.communityFeePercent();
    const liquidityFee = await token.liquidityFeePercent();
    const burnFee = await token.burnFeePercent();
    
    console.log("Fee Configuration:");
    console.log("- Community Fee:", communityFee.toString(), "%");
    console.log("- Liquidity Fee:", liquidityFee.toString(), "%");
    console.log("- Burn Fee:", burnFee.toString(), "%");
    
    // Check if owner is excluded from fees
    const ownerExcluded = await token.isExcludedFromFees(owner.address);
    console.log("Owner excluded from fees:", ownerExcluded);
  } catch (error) {
    console.log("Error checking fees:", error.message);
  }

  // Keep the script running to catch events
  console.log("\nWaiting for SwapAndLiquify events... (Press Ctrl+C to exit)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 