const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the previously deployed factory address
  const addresses = JSON.parse(fs.readFileSync('deployed-addresses.json', 'utf8'));
  const factoryAddress = addresses.factory;

  // Deploy Router
  const WETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"; // Unichain WETH address
  const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factoryAddress, WETH);
  await router.deployed();

  console.log("UniswapV2Router02 deployed to:", router.address);

  // Update the addresses file
  addresses.router = router.address;
  addresses.WETH = WETH;

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