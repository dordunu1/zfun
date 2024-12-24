const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NFT721 Implementation
  const NFT721 = await hre.ethers.getContractFactory("NFT721Royalty");
  const nft721 = await NFT721.deploy();
  await nft721.waitForDeployment();
  const nft721Address = await nft721.getAddress();
  console.log("NFT721 Implementation deployed to:", nft721Address);

  // Deploy NFT1155 Implementation
  const NFT1155 = await hre.ethers.getContractFactory("NFT1155Royalty");
  const nft1155 = await NFT1155.deploy();
  await nft1155.waitForDeployment();
  const nft1155Address = await nft1155.getAddress();
  console.log("NFT1155 Implementation deployed to:", nft1155Address);

  // Deploy Factory with implementations
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy(nft721Address, nft1155Address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("NFTFactory deployed to:", factoryAddress);

  // Set initial fee for Unichain
  const unichainFee = hre.ethers.parseEther("0.01"); // 0.01 ETH for Unichain
  await factory.setChainFee(1301, unichainFee); // Unichain chain ID
  console.log("Set Unichain fee to:", hre.ethers.formatEther(unichainFee), "ETH");

  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await factory.deploymentTransaction().wait(5);

  // Update .env file with new addresses
  const envPath = path.join(__dirname, '../../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent
    .replace(/VITE_NFT721_IMPLEMENTATION_UNICHAIN=.*/, `VITE_NFT721_IMPLEMENTATION_UNICHAIN=${nft721Address}`)
    .replace(/VITE_NFT1155_IMPLEMENTATION_UNICHAIN=.*/, `VITE_NFT1155_IMPLEMENTATION_UNICHAIN=${nft1155Address}`)
    .replace(/VITE_NFT_FACTORY_UNICHAIN=.*/, `VITE_NFT_FACTORY_UNICHAIN=${factoryAddress}`);
  
  fs.writeFileSync(envPath, envContent);
  console.log("Updated .env file with new contract addresses");

  // Verify contracts
  console.log("\nVerifying contracts on Uniscan...");
  
  try {
    await hre.run("verify:verify", {
      address: nft721Address,
      constructorArguments: []
    });
    console.log("NFT721 implementation verified");
  } catch (error) {
    console.error("Error verifying NFT721:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: nft1155Address,
      constructorArguments: []
    });
    console.log("NFT1155 implementation verified");
  } catch (error) {
    console.error("Error verifying NFT1155:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [nft721Address, nft1155Address]
    });
    console.log("NFTFactory verified");
  } catch (error) {
    console.error("Error verifying NFTFactory:", error.message);
  }

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("NFT721 Implementation:", nft721Address);
  console.log("NFT1155 Implementation:", nft1155Address);
  console.log("NFTFactory:", factoryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 