const hre = require("hardhat");

async function main() {
  const factoryAddress = '0xAE3511d8ad1bD1bDAdF8dF44d3158ED5aeF72703';
  const factory = await hre.ethers.getContractAt("UniswapV2Factory", factoryAddress);
  
  const feeTo = await factory.feeTo();
  const feeToSetter = await factory.feeToSetter();
  
  console.log("Current feeTo (receives protocol fees):", feeTo);
  console.log("Current feeToSetter (can change fees):", feeToSetter);
  
  const deployerAddress = '0x8Efff193475604790D04e3F972AB5b9047C3503d';
  console.log("\nDeployer address:", deployerAddress);
  console.log("Is deployer the feeTo?", feeTo.toLowerCase() === deployerAddress.toLowerCase());
  console.log("Is deployer the feeToSetter?", feeToSetter.toLowerCase() === deployerAddress.toLowerCase());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 