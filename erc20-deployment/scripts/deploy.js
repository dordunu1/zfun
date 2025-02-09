const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MemeToken template
  console.log("Deploying MemeToken template...");
  const MemeToken = await hre.ethers.getContractFactory("MemeToken");
  const memeToken = await MemeToken.deploy(
    "TEMPLATE", 
    "TEMP",
    1,
    deployer.address, // Use deployer as marketing wallet
    1,
    1,
    1,
    1,
    1,
    false,
    false
  );
  await memeToken.waitForDeployment();
  console.log("MemeToken template deployed to:", await memeToken.getAddress());

  // Deploy ERC20Template
  console.log("Deploying ERC20Template...");
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const erc20Template = await ERC20Template.deploy();
  await erc20Template.waitForDeployment();
  console.log("ERC20Template deployed to:", await erc20Template.getAddress());

  // Deploy TokenFactory
  console.log("Deploying TokenFactory...");
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy();
  await tokenFactory.waitForDeployment();
  console.log("TokenFactory deployed to:", await tokenFactory.getAddress());

  // Verify contracts
  console.log("\nWaiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s for block confirmations

  console.log("\nVerifying contracts on Etherscan...");
  
  try {
    await hre.run("verify:verify", {
      address: await memeToken.getAddress(),
      constructorArguments: [
        "TEMPLATE", 
        "TEMP",
        1,
        deployer.address, // Use deployer as marketing wallet
        1,
        1,
        1,
        1,
        1,
        false,
        false
      ],
    });
    console.log("MemeToken template verified");
  } catch (error) {
    console.error("Error verifying MemeToken:", error);
  }

  try {
    await hre.run("verify:verify", {
      address: await erc20Template.getAddress(),
      constructorArguments: [],
    });
    console.log("ERC20Template verified");
  } catch (error) {
    console.error("Error verifying ERC20Template:", error);
  }

  try {
    await hre.run("verify:verify", {
      address: await tokenFactory.getAddress(),
      constructorArguments: [],
    });
    console.log("TokenFactory verified");
  } catch (error) {
    console.error("Error verifying TokenFactory:", error);
  }

  console.log("\nDeployment completed!");
  console.log("TokenFactory:", await tokenFactory.getAddress());
  console.log("ERC20Template:", await erc20Template.getAddress());
  console.log("MemeToken template:", await memeToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 