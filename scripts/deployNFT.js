const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

// Chain-specific configurations
const CHAIN_CONFIG = {
  // Polygon Mainnet
  137: {
    name: 'Polygon',
    isMainnet: true,
    fee: "0.05",  // 0.05 MATIC
    envPrefix: 'POLYGON'
  },
  // Unichain Mainnet
  130: {
    name: 'Unichain',
    isMainnet: true,
    fee: "0.0001",  // 0.0001 ETH (L2 optimized)
    envPrefix: 'UNICHAIN_MAINNET'
  },
  // Unichain Testnet
  1301: {
    name: 'Unichain Testnet',
    isMainnet: false,
    fee: "0.015", // 0.015 ETH
    envPrefix: 'UNICHAIN_TESTNET'
  },
  // Moonwalker
  1828369849: {
    name: 'Moonwalker',
    isMainnet: false,
    fee: "0.015", // 0.015 ETH
    envPrefix: 'MOONWALKER'
  }
};

async function main() {
  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const chainConfig = CHAIN_CONFIG[chainId];

  if (!chainConfig) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  console.log(`Starting deployments on ${chainConfig.name}...`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`Network type: ${chainConfig.isMainnet ? 'Mainnet' : 'Testnet'}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

  // Step 1: Deploy NFT721 Implementation
  console.log("\nDeploying NFT721 Implementation...");
  const NFT721 = await hre.ethers.getContractFactory("NFT721Royalty");
  const nft721 = await NFT721.deploy();
  await nft721.waitForDeployment();
  const nft721Address = await nft721.getAddress();
  console.log("NFT721 Implementation deployed to:", nft721Address);
  
  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await nft721.deploymentTransaction().wait(5);

  // Step 2: Deploy NFT1155 Implementation
  console.log("\nDeploying NFT1155 Implementation...");
  const NFT1155 = await hre.ethers.getContractFactory("NFT1155Royalty");
  const nft1155 = await NFT1155.deploy();
  await nft1155.waitForDeployment();
  const nft1155Address = await nft1155.getAddress();
  console.log("NFT1155 Implementation deployed to:", nft1155Address);

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await nft1155.deploymentTransaction().wait(5);

  // Step 3: Deploy Factory
  console.log("\nDeploying NFT Factory...");
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy(nft721Address, nft1155Address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("NFT Factory deployed to:", factoryAddress);

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await factory.deploymentTransaction().wait(5);

  // Set chain fee
  const fee = hre.ethers.parseEther(chainConfig.fee);
  await factory.setChainFee(chainId, fee);
  console.log(`Set ${chainConfig.name} fee to:`, chainConfig.fee, "ETH/MATIC");

  // Wait for fee setting to be mined
  console.log("Waiting for fee setting to be confirmed...");
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Transfer ownership
  const newOwner = "0x5828D525fe00902AE22f2270Ac714616651894fF";
  await factory.transferOwnership(newOwner);
  console.log("Ownership transferred to:", newOwner);

  // Update .env file
  try {
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent
      .replace(new RegExp(`VITE_NFT721_IMPLEMENTATION_${chainConfig.envPrefix}=.*`), 
              `VITE_NFT721_IMPLEMENTATION_${chainConfig.envPrefix}=${nft721Address}`)
      .replace(new RegExp(`VITE_NFT1155_IMPLEMENTATION_${chainConfig.envPrefix}=.*`), 
              `VITE_NFT1155_IMPLEMENTATION_${chainConfig.envPrefix}=${nft1155Address}`)
      .replace(new RegExp(`VITE_NFT_FACTORY_${chainConfig.envPrefix}=.*`), 
              `VITE_NFT_FACTORY_${chainConfig.envPrefix}=${factoryAddress}`);
    
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with new contract addresses");
  } catch (error) {
    console.warn("Warning: Could not update .env file:", error.message);
  }

  // Verify contracts
  console.log("\nVerifying contracts...");
  
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
    console.log("NFT Factory verified");
  } catch (error) {
    console.error("Error verifying Factory:", error.message);
  }

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log(`Network: ${chainConfig.name} ${chainConfig.isMainnet ? 'Mainnet' : 'Testnet'}`);
  console.log("Chain ID:", chainId);
  console.log("NFT721 Implementation:", nft721Address);
  console.log("NFT1155 Implementation:", nft1155Address);
  console.log("NFT Factory:", factoryAddress);
  console.log("\nPlease save these addresses for frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 