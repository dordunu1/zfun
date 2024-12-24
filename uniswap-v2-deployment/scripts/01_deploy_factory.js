const { ethers, network } = require("hardhat");
const fs = require('fs');
require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Network:", network.name);

  // Use the same address for both feeToSetter and feeTo initially
  const feeCollector = deployer.address;  // or specify a different address for fee collection
  
  console.log("Fee configuration:");
  console.log("feeToSetter (can change fees):", deployer.address);
  console.log("initialFeeTo (receives protocol fees):", feeCollector);

  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(deployer.address, feeCollector);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  console.log("UniswapV2Factory deployed to:", factoryAddress);
  console.log("Protocol fees (0.05% of swaps) will be collected at:", feeCollector);

  // Update the .env file with the new factory address
  const envFile = '../.env';
  let envContent = fs.readFileSync(envFile, 'utf8');
  
  // Update network-specific factory address
  if (network.name === 'sepolia') {
    envContent = envContent.replace(/VITE_FACTORY_ADDRESS_SEPOLIA=.*/g, `VITE_FACTORY_ADDRESS_SEPOLIA=${factoryAddress}`);
  } else if (network.name === 'unichain') {
    envContent = envContent.replace(/VITE_FACTORY_ADDRESS_UNICHAIN=.*/g, `VITE_FACTORY_ADDRESS_UNICHAIN=${factoryAddress}`);
  }
  
  fs.writeFileSync(envFile, envContent);
  console.log("Environment file updated with factory address");

  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = await factory.deploymentTransaction();
  await deployTx.wait(5);

  // Verify the contract
  try {
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [deployer.address, feeCollector],
    });
  } catch (error) {
    console.log("Verification error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 