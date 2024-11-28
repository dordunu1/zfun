const hre = require("hardhat");

async function main() {
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy(
    "0x67a7e96c3f5843c3e5182c8e228d9435cdbbfb78",  // Your ERC721 implementation
    "0x2babf73a84eb3a80b0f4612d9570542557991124"   // Your ERC1155 implementation
  );
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("NFTFactory deployed to:", factoryAddress);

  // Wait for a few block confirmations
  await factory.deploymentTransaction().wait(5);

  // Verify the factory contract
  console.log("Verifying NFTFactory contract...");
  await hre.run("verify:verify", {
    address: factoryAddress,
    constructorArguments: [
      "0x67a7e96c3f5843c3e5182c8e228d9435cdbbfb78",
      "0x2babf73a84eb3a80b0f4612d9570542557991124"
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 