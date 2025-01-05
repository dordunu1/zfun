const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function updateEnvFile(envPath, newVars) {
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  
  for (const [key, value] of Object.entries(newVars)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }
  
  fs.writeFileSync(envPath, envContent.trim() + '\n');
}

async function main() {
  console.log("Starting deployment process...");
  
  const network = await hre.ethers.provider.getNetwork();
  console.log("Deploying to network:", network.chainId);

  let usdtAddress, usdcAddress;

  if (network.chainId === 1301) { // Unichain testnet
    usdtAddress = "0x70262e266E50603AcFc5D58997eF73e5a8775844";
    usdcAddress = "0x31d0220469e10c4E71834a79b1f276d740d3768F";
  } else if (network.chainId === 137) { // Polygon mainnet
    usdtAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  } else {
    throw new Error("Unsupported network");
  }

  console.log("Deploying MerchPlatform with the following parameters:");
  console.log("USDT:", usdtAddress);
  console.log("USDC:", usdcAddress);

  // Deploy contract
  const MerchPlatform = await hre.ethers.getContractFactory("MerchPlatform");
  console.log("Contract factory created, deploying...");
  
  const merchPlatform = await MerchPlatform.deploy(usdtAddress, usdcAddress);
  console.log("Deployment transaction sent...");

  await merchPlatform.deployed();
  console.log("MerchPlatform deployed to:", merchPlatform.address);
  
  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await merchPlatform.deployTransaction.wait(5);

  // Verify contract if on Polygon
  if (network.chainId === 137) {
    console.log("Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: merchPlatform.address,
        constructorArguments: [usdtAddress, usdcAddress],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }

  // Unpause the contract
  console.log("Unpausing contract...");
  const unpauseTx = await merchPlatform.unpause();
  await unpauseTx.wait();
  console.log("Contract unpaused");

  // Update environment variables
  const envVars = {
    [`VITE_MERCH_PLATFORM_ADDRESS_${network.chainId}`]: merchPlatform.address
  };

  // Update .env and .env.example
  console.log("Updating environment files...");
  await updateEnvFile(path.join(process.cwd(), '.env'), envVars);
  await updateEnvFile(path.join(process.cwd(), '.env.example'), envVars);

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`Network: ${network.chainId}`);
  console.log(`MerchPlatform: ${merchPlatform.address}`);
  console.log(`USDT: ${usdtAddress}`);
  console.log(`USDC: ${usdcAddress}`);
  console.log("\nNext steps:");
  console.log("1. Add the contract ABI to your frontend");
  console.log("2. Update your frontend code to interact with the contract");
  console.log("3. Test the integration on the deployed network");

  return merchPlatform.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 