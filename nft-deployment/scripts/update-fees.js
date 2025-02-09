const { ethers } = require("hardhat");
require('dotenv').config({ path: '../.env' });

async function main() {
  const factoryAddress = process.env.VITE_NFT_FACTORY_UNICHAIN;
  console.log("NFT Factory address:", factoryAddress);
  
  // Get the owner's private key from env
  const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
  if (!ownerPrivateKey) {
    throw new Error("Owner private key not found in environment variables");
  }

  // Create a wallet instance
  const provider = await ethers.provider;
  const wallet = new ethers.Wallet(ownerPrivateKey, provider);
  
  // Get the factory contract with owner signer
  const factory = await ethers.getContractAt("NFTFactory", factoryAddress, wallet);
  
  // Update the chain fee for Unichain (1301) to 0.015 ETH
  const newFee = ethers.parseEther("0.015");
  console.log("Setting new fee to:", ethers.formatEther(newFee), "ETH");
  
  const tx = await factory.setChainFee(1301, newFee);
  console.log("Transaction hash:", tx.hash);
  
  await tx.wait();
  console.log("Fee updated successfully!");
  
  // Verify the new fee
  const updatedFee = await factory.chainFees(1301);
  console.log("New Unichain NFT creation fee:", ethers.formatEther(updatedFee), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 