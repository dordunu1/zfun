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

  console.log("\n1. Verifying Basic Info");
  try {
    const [name, symbol, totalSupply] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply()
    ]);
    console.log("Token Name:", name);
    console.log("Token Symbol:", symbol);
    console.log("Total Supply:", ethers.formatUnits(totalSupply, 18));
  } catch (error) {
    console.log("Error getting basic info:", error.message);
  }

  console.log("\n2. Verifying Fee Structure");
  try {
    const [
      burnFee,
      treasuryFee,
      devFee,
      marketingFee,
      liquidityFee,
      buyFees,
      sellFees
    ] = await Promise.all([
      token.burnFee(),
      token.treasuryFee(),
      token.devFee(),
      token.marketingFee(),
      token.liquidityFee(),
      token.buyFees(),
      token.sellFees()
    ]);

    console.log("\nIndividual Fees (in %):");
    console.log("- Burn Fee:", Number(burnFee) / 100, "%");
    console.log("- Treasury Fee:", Number(treasuryFee) / 100, "%");
    console.log("- Dev Fee:", Number(devFee) / 100, "%");
    console.log("- Marketing Fee:", Number(marketingFee) / 100, "%");
    console.log("- Liquidity Fee:", Number(liquidityFee) / 100, "%");

    console.log("\nTrading Fees:");
    console.log("- Buy Fee Total:", Number(buyFees) / 100, "%");
    console.log("- Sell Fee Total:", Number(sellFees) / 100, "%");

    const totalFeePercentage = (Number(burnFee) + Number(treasuryFee) + Number(devFee) + 
                               Number(marketingFee) + Number(liquidityFee)) / 100;
    console.log("\nTotal Fee Percentage:", totalFeePercentage, "%");
  } catch (error) {
    console.log("Error checking fees:", error.message);
  }

  console.log("\n3. Verifying Wallet Balances");
  try {
    const [
      treasuryAddress,
      devAddress,
      marketingWallet,
      liquidityAddress,
      deadAddress
    ] = await Promise.all([
      token.TREASURY_ADDRESS(),
      token.DEV_ADDRESS(),
      token.MARKETING_WALLET(),
      token.LIQUIDITY_ADDRESS(),
      "0x000000000000000000000000000000000000dEaD"
    ]);

    const [
      treasuryBalance,
      devBalance,
      marketingBalance,
      liquidityBalance,
      deadBalance
    ] = await Promise.all([
      token.balanceOf(treasuryAddress),
      token.balanceOf(devAddress),
      token.balanceOf(marketingWallet),
      token.balanceOf(liquidityAddress),
      token.balanceOf(deadAddress)
    ]);

    console.log("\nWallet Balances:");
    console.log("- Treasury:", ethers.formatUnits(treasuryBalance, 18));
    console.log("- Dev:", ethers.formatUnits(devBalance, 18));
    console.log("- Marketing:", ethers.formatUnits(marketingBalance, 18));
    console.log("- Liquidity:", ethers.formatUnits(liquidityBalance, 18));
    console.log("- Burned (Dead):", ethers.formatUnits(deadBalance, 18));
  } catch (error) {
    console.log("Error checking balances:", error.message);
  }

  console.log("\n4. Verifying Trading Limits");
  try {
    const [maxTxAmount, maxWalletAmount, minTokensBeforeSwap] = await Promise.all([
      token.maxTransactionAmount(),
      token.maxWallet(),
      token.swapTokensAtAmount()
    ]);

    console.log("Trading Limits:");
    console.log("- Max Transaction:", ethers.formatUnits(maxTxAmount, 18));
    console.log("- Max Wallet:", ethers.formatUnits(maxWalletAmount, 18));
    console.log("- Min Tokens Before Swap:", ethers.formatUnits(minTokensBeforeSwap, 18));
  } catch (error) {
    console.log("Error checking limits:", error.message);
  }

  console.log("\n5. Verifying Trading Status");
  try {
    const tradingEnabled = await token.tradingActive();
    console.log("Trading Enabled:", tradingEnabled);
  } catch (error) {
    console.log("Error checking trading status:", error.message);
  }

  console.log("\n6. Verifying Router and Pair");
  try {
    const [router, pair] = await Promise.all([
      token.uniswapV2Router(),
      token.uniswapV2Pair()
    ]);
    console.log("Router Address:", router);
    console.log("Pair Address:", pair);
  } catch (error) {
    console.log("Error checking router and pair:", error.message);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 