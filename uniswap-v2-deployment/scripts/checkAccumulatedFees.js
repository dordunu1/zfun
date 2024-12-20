const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const factoryAddress = '0xAE3511d8ad1bD1bDAdF8dF44d3158ED5aeF72703';
  const factory = await hre.ethers.getContractAt("UniswapV2Factory", factoryAddress);
  const feeAddress = '0x8Efff193475604790D04e3F972AB5b9047C3503d';

  // Get all pairs
  const pairCount = await factory.allPairsLength();
  console.log(`Total number of pairs: ${pairCount}`);

  const PAIR_ABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function balanceOf(address) external view returns (uint)",
    "function totalSupply() external view returns (uint)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
  ];

  const ERC20_ABI = [
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)"
  ];

  for (let i = 0; i < pairCount; i++) {
    const pairAddress = await factory.allPairs(i);
    const pair = await hre.ethers.getContractAt(PAIR_ABI, pairAddress);
    
    // Get tokens
    const token0Address = await pair.token0();
    const token1Address = await pair.token1();
    const token0 = await hre.ethers.getContractAt(ERC20_ABI, token0Address);
    const token1 = await hre.ethers.getContractAt(ERC20_ABI, token1Address);
    
    // Get symbols
    let token0Symbol, token1Symbol;
    try {
      token0Symbol = await token0.symbol();
      token1Symbol = await token1.symbol();
    } catch (e) {
      token0Symbol = token0Address.slice(0, 6) + "...";
      token1Symbol = token1Address.slice(0, 6) + "...";
    }

    // Get LP token balance
    const lpBalance = await pair.balanceOf(feeAddress);
    const totalSupply = await pair.totalSupply();
    
    if (lpBalance > 0) {
      // Get reserves
      const [reserve0, reserve1] = await pair.getReserves();
      
      // Calculate share of the pool
      const shareOfPool = lpBalance.mul(ethers.BigNumber.from(10000)).div(totalSupply);
      const token0Amount = reserve0.mul(lpBalance).div(totalSupply);
      const token1Amount = reserve1.mul(lpBalance).div(totalSupply);

      console.log(`\nPair ${i + 1}: ${token0Symbol}-${token1Symbol}`);
      console.log(`Pair Address: ${pairAddress}`);
      console.log(`LP Token Balance: ${ethers.utils.formatEther(lpBalance)}`);
      console.log(`Share of Pool: ${shareOfPool.toNumber() / 100}%`);
      console.log(`Token Amounts:`);
      console.log(`- ${token0Symbol}: ${ethers.utils.formatEther(token0Amount)}`);
      console.log(`- ${token1Symbol}: ${ethers.utils.formatEther(token1Amount)}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 