const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const FACTORY_ADDRESS = "0x078223BfDf644e10B396B0b409489C06f7f83acF";
  const WETH_ADDRESS = "0xe2CdfDD063B9bEd0f951F3d4ac4A082B4b373a69";

  // Deploy UniswapV2Router02
  const Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(FACTORY_ADDRESS, WETH_ADDRESS);
  await router.waitForDeployment();

  const routerAddress = await router.getAddress();
  console.log("UniswapV2Router02 deployed to:", routerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 