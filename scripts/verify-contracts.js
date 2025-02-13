const hre = require("hardhat");
require('dotenv').config();

// Chain-specific configurations
const CHAIN_CONFIG = {
  // Polygon Mainnet
  137: {
    name: 'Polygon',
    isMainnet: true,
    scannerName: 'Polygonscan',
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  // Polygon Mumbai
  80001: {
    name: 'Mumbai',
    isMainnet: false,
    scannerName: 'Polygonscan',
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  // Unichain Mainnet
  130: {
    name: 'Unichain',
    isMainnet: true,
    scannerName: 'Uniscan',
    apiKey: process.env.VITE_UNICHAIN_EXPLORER_API_KEY
  },
  // Unichain Testnet
  1301: {
    name: 'Unichain Testnet',
    isMainnet: false,
    scannerName: 'Uniscan',
    apiKey: process.env.VITE_UNICHAIN_EXPLORER_API_KEY
  }
};

async function verifyContract(address, constructorArgs = [], chainId) {
  const config = CHAIN_CONFIG[chainId];
  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  console.log(`\nVerifying contract on ${config.name}...`);
  console.log(`Scanner: ${config.scannerName}`);
  console.log(`Contract address: ${address}`);
  
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: constructorArgs
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

async function main() {
  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const config = CHAIN_CONFIG[chainId];

  if (!config) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  console.log(`Starting verification on ${config.name}...`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`Network type: ${config.isMainnet ? 'Mainnet' : 'Testnet'}`);

  // Get contract addresses from environment variables based on network
  const envPrefix = chainId === 137 ? 'POLYGON' :
                   chainId === 80001 ? 'MUMBAI' :
                   chainId === 130 ? 'UNICHAIN_MAINNET' :
                   chainId === 1301 ? 'UNICHAIN_TESTNET' : '';

  const nft721Address = process.env[`VITE_NFT721_IMPLEMENTATION_${envPrefix}`];
  const nft1155Address = process.env[`VITE_NFT1155_IMPLEMENTATION_${envPrefix}`];
  const factoryAddress = process.env[`VITE_NFT_FACTORY_${envPrefix}`];

  if (!nft721Address || !nft1155Address || !factoryAddress) {
    throw new Error(`Missing contract addresses for ${config.name} in .env file`);
  }

  // Verify NFT721 Implementation
  await verifyContract(nft721Address, [], chainId);

  // Verify NFT1155 Implementation
  await verifyContract(nft1155Address, [], chainId);

  // Verify Factory with constructor arguments
  await verifyContract(
    factoryAddress, 
    [nft721Address, nft1155Address],
    chainId
  );

  console.log("\nVerification Summary:");
  console.log("---------------------");
  console.log(`Network: ${config.name} ${config.isMainnet ? 'Mainnet' : 'Testnet'}`);
  console.log("Chain ID:", chainId);
  console.log("NFT721 Implementation:", nft721Address);
  console.log("NFT1155 Implementation:", nft1155Address);
  console.log("NFT Factory:", factoryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 