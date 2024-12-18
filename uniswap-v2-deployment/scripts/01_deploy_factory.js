const hre = require("hardhat");
const fs = require('fs');
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(deployer.address);
  await factory.deployed();

  console.log("UniswapV2Factory deployed to:", factory.address);

  // Update the .env file with the new factory address
  const envContent = fs.readFileSync('.env', 'utf8');
  const updatedEnv = envContent.replace(
    /FACTORY_ADDRESS=.*/,
    `FACTORY_ADDRESS=${factory.address}`
  );
  fs.writeFileSync('.env', updatedEnv);

  console.log("Environment file updated with factory address");

  // Verify the contract on Etherscan
  console.log("Waiting for 5 block confirmations before verification...");
  await factory.deployTransaction.wait(5);

  console.log("Verifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [deployer.address],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 