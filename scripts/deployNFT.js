const hre = require("hardhat");

async function main() {
  console.log("Starting deployments on Moonwalker...");

  // Step 1: Deploy ERC721 Implementation
  console.log("\nDeploying ERC721 Implementation...");
  const ERC721Implementation = await hre.ethers.getContractFactory("ERC721Implementation");
  const erc721Implementation = await ERC721Implementation.deploy();
  await erc721Implementation.waitForDeployment();
  const erc721Address = await erc721Implementation.getAddress();
  console.log("ERC721 Implementation deployed to:", erc721Address);
  
  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await erc721Implementation.deploymentTransaction().wait(5);

  // Step 2: Deploy ERC1155 Implementation
  console.log("\nDeploying ERC1155 Implementation...");
  const ERC1155Implementation = await hre.ethers.getContractFactory("ERC1155Implementation");
  const erc1155Implementation = await ERC1155Implementation.deploy();
  await erc1155Implementation.waitForDeployment();
  const erc1155Address = await erc1155Implementation.getAddress();
  console.log("ERC1155 Implementation deployed to:", erc1155Address);

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await erc1155Implementation.deploymentTransaction().wait(5);

  // Step 3: Verify both implementations
  console.log("\nVerifying ERC721 Implementation...");
  try {
    await hre.run("verify:verify", {
      address: erc721Address,
      constructorArguments: []
    });
  } catch (error) {
    console.log("ERC721 verification error:", error.message);
  }

  console.log("\nVerifying ERC1155 Implementation...");
  try {
    await hre.run("verify:verify", {
      address: erc1155Address,
      constructorArguments: []
    });
  } catch (error) {
    console.log("ERC1155 verification error:", error.message);
  }

  // Step 4: Deploy the factory with the new implementation addresses
  console.log("\nDeploying NFT Factory...");
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy(
    erc721Address,
    erc1155Address
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("NFT Factory deployed to:", factoryAddress);

  // Wait for confirmations
  console.log("Waiting for confirmations...");
  await factory.deploymentTransaction().wait(5);

  // Step 5: Verify the factory
  console.log("\nVerifying NFT Factory...");
  try {
    await hre.run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [
        erc721Address,
        erc1155Address
      ],
    });
  } catch (error) {
    console.log("Factory verification error:", error.message);
  }

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Network: Moonwalker Testnet");
  console.log("ERC721 Implementation:", erc721Address);
  console.log("ERC1155 Implementation:", erc1155Address);
  console.log("NFT Factory:", factoryAddress);
  console.log("\nPlease save these addresses for frontend configuration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 