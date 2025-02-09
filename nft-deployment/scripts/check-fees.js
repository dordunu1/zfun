const { ethers } = require("hardhat");
require('dotenv').config({ path: '../.env' });

async function main() {
  const factoryAddress = process.env.VITE_NFT_FACTORY_UNICHAIN;
  console.log("NFT Factory address:", factoryAddress);
  
  // Get the factory contract
  const factory = await ethers.getContractAt("NFTFactory", factoryAddress);
  
  // Get the chain fee for Unichain (1301)
  const fee = await factory.chainFees(1301);
  console.log("Current Unichain NFT creation fee:", ethers.formatEther(fee), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 