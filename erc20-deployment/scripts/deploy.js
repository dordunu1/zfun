const hre = require("hardhat");

async function main() {
  console.log("Deploying ERC20 Token Factory...");

  // Deploy the factory
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy();
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("Token Factory deployed to:", factoryAddress);

  // Set the chain fee for Unichain (0.01 ETH)
  const chainFee = hre.ethers.parseEther("0.01");
  await factory.setChainFee(1301, chainFee);
  console.log("Chain fee set for Unichain");

  // Verify the contract
  console.log("Verifying contract on Uniscan...");
  await hre.run("verify:verify", {
    address: factoryAddress,
    constructorArguments: []
  });

  console.log("Contract verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 