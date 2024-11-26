const hre = require("hardhat");

async function main() {
  // Deploy ERC20Template first
  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  const template = await ERC20Template.deploy(
    "Template", // name
    "TEMP", // symbol
    18, // decimals
    0, // initialSupply
    "0x0000000000000000000000000000000000000000" // owner
  );
  await template.waitForDeployment();
  console.log("ERC20Template deployed to:", await template.getAddress());

  // Deploy TokenFactory
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy(await template.getAddress());
  await factory.waitForDeployment();
  console.log("TokenFactory deployed to:", await factory.getAddress());

  // Wait for a few block confirmations
  await factory.deploymentTransaction().wait(5);

  // Verify contracts on Etherscan
  console.log("Verifying contracts on Etherscan...");
  
  await hre.run("verify:verify", {
    address: await template.getAddress(),
    constructorArguments: [
      "Template",
      "TEMP",
      18,
      0,
      "0x0000000000000000000000000000000000000000"
    ],
  });

  await hre.run("verify:verify", {
    address: await factory.getAddress(),
    constructorArguments: [await template.getAddress()],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });