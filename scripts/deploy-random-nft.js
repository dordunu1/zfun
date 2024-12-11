const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RandomNFT721 Implementation
  const RandomNFT721 = await hre.ethers.getContractFactory("RandomNFT721");
  const randomNFT721 = await RandomNFT721.deploy();
  await randomNFT721.deployed();
  console.log("RandomNFT721 Implementation deployed to:", randomNFT721.address);

  // Deploy RandomNFT1155 Implementation
  const RandomNFT1155 = await hre.ethers.getContractFactory("RandomNFT1155");
  const randomNFT1155 = await RandomNFT1155.deploy();
  await randomNFT1155.deployed();
  console.log("RandomNFT1155 Implementation deployed to:", randomNFT1155.address);

  // Deploy Factory with implementations
  const RandomNFTFactory = await hre.ethers.getContractFactory("RandomNFTFactory");
  const factory = await RandomNFTFactory.deploy(
    randomNFT721.address,
    randomNFT1155.address
  );
  await factory.deployed();
  console.log("RandomNFTFactory deployed to:", factory.address);

  // Set initial fees for networks
  const sepoliaFee = hre.ethers.utils.parseEther("0.015"); // 0.015 ETH for Sepolia
  const polygonFee = hre.ethers.utils.parseEther("20");    // 20 MATIC for Polygon
  
  // Set fees based on network
  const networkName = hre.network.name;
  if (networkName === "sepolia") {
    await factory.setChainFee(11155111, sepoliaFee); // Sepolia chain ID
    console.log("Set Sepolia fee to:", hre.ethers.utils.formatEther(sepoliaFee), "ETH");
  } else if (networkName === "polygon") {
    await factory.setChainFee(137, polygonFee); // Polygon chain ID
    console.log("Set Polygon fee to:", hre.ethers.utils.formatEther(polygonFee), "MATIC");
  }

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("RandomNFT721:", randomNFT721.address);
  console.log("RandomNFT1155:", randomNFT1155.address);
  console.log("RandomNFTFactory:", factory.address);
  console.log("\nVerification Commands:");
  console.log("---------------------");
  console.log(`npx hardhat verify --network ${networkName} ${randomNFT721.address}`);
  console.log(`npx hardhat verify --network ${networkName} ${randomNFT1155.address}`);
  console.log(`npx hardhat verify --network ${networkName} ${factory.address} ${randomNFT721.address} ${randomNFT1155.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 