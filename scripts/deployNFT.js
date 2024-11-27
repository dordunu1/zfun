const hre = require("hardhat");

async function main() {
  // Deploy NFT721 implementation first
  const NFT721 = await hre.ethers.getContractFactory("NFT721");
  const nft721Implementation = await NFT721.deploy();
  await nft721Implementation.waitForDeployment();
  console.log("NFT721 Implementation deployed to:", await nft721Implementation.getAddress());

  // Deploy NFT1155 implementation
  const NFT1155 = await hre.ethers.getContractFactory("NFT1155");
  const nft1155Implementation = await NFT1155.deploy();
  await nft1155Implementation.waitForDeployment();
  console.log("NFT1155 Implementation deployed to:", await nft1155Implementation.getAddress());

  // Deploy NFTFactory
  const NFTFactory = await hre.ethers.getContractFactory("NFTFactory");
  const factory = await NFTFactory.deploy(
    await nft721Implementation.getAddress(),
    await nft1155Implementation.getAddress()
  );
  await factory.waitForDeployment();
  console.log("NFTFactory deployed to:", await factory.getAddress());

  // Wait for a few block confirmations
  await factory.deploymentTransaction().wait(5);

  // Verify contracts on Etherscan
  console.log("Verifying contracts on Etherscan...");
  
  await hre.run("verify:verify", {
    address: await nft721Implementation.getAddress(),
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: await nft1155Implementation.getAddress(),
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: await factory.getAddress(),
    constructorArguments: [
      await nft721Implementation.getAddress(),
      await nft1155Implementation.getAddress()
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 