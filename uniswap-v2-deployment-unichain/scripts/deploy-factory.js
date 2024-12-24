const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Factory from unified contract
  const UniswapV2Factory = await ethers.getContractFactory("contracts/UniswapV2.sol:UniswapV2Factory");
  const factory = await UniswapV2Factory.deploy(deployer.address);
  await factory.deployed();

  console.log("UniswapV2Factory deployed to:", factory.address);

  // Save the contract addresses
  const fs = require('fs');
  const addresses = {
    factory: factory.address,
    deployer: deployer.address
  };

  fs.writeFileSync(
    'deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 