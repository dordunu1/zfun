const hre = require("hardhat");
require("dotenv").config({ path: '../.env' });

async function main() {
  // Contract addresses from deployment
  const nft721Address = "0x0cffc1CA40f5187fCa7a084708aa46E1A3F79868";
  const nft1155Address = "0xDE8624854b5a154314d667559C71e1441fB26D29";
  const factoryAddress = "0xeCF551aACd0DA9010A661C4D733c6C877B3C21E9";

  console.log("Starting contract verification on Polygon...");
  console.log("NFT721:", nft721Address);
  console.log("NFT1155:", nft1155Address);
  console.log("Factory:", factoryAddress);

  // Verify NFT721 Implementation
  console.log("\nVerifying NFT721 Implementation...");
  try {
    await hre.run("verify:verify", {
      address: nft721Address,
      constructorArguments: []
    });
    console.log("✅ NFT721 implementation verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }

  // Verify NFT1155 Implementation
  console.log("\nVerifying NFT1155 Implementation...");
  try {
    await hre.run("verify:verify", {
      address: nft1155Address,
      constructorArguments: []
    });
    console.log("✅ NFT1155 implementation verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }

  // Verify Factory
  console.log("\nVerifying Factory...");
  try {
    await hre.run("verify:verify", {
      address: factoryAddress,
      constructorArguments: [nft721Address, nft1155Address]
    });
    console.log("✅ Factory verified successfully!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }

  console.log("\nVerification Summary:");
  console.log("-------------------");
  console.log("Network: Polygon Mainnet");
  console.log("Chain ID: 137");
  console.log("NFT721 Implementation:", nft721Address);
  console.log("NFT1155 Implementation:", nft1155Address);
  console.log("NFT Factory:", factoryAddress);
  console.log("\nVerification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 