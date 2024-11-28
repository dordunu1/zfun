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
    "0x36e9df4040669ecd10534d3fb2569aa1c9999efe",  // NFT721 implementation
    "0xb0fcbb102cd769d9ef67a0fb1f9b63772898515c"   // NFT1155 implementation
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
      "0x36e9df4040669ecd10534d3fb2569aa1c9999efe",
      "0xb0fcbb102cd769d9ef67a0fb1f9b63772898515c"
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 