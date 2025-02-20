const hre = require("hardhat");

// Network-specific configurations
const NETWORK_CONFIG = {
  // Monad Testnet
  10143: {
    name: 'Monad Testnet',
    blockConfirmations: 5,
    verifyDelay: 30000, // 30s for Monad Testnet
  }
};

async function main() {
  console.log("Starting deployment...");

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  const networkConfig = NETWORK_CONFIG[chainId] || { name: 'Unknown Network', blockConfirmations: 5, verifyDelay: 30000 };

  console.log(`Deploying on ${networkConfig.name} (Chain ID: ${chainId})...`);

  const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF";

  // Get deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the current nonce
  const currentNonce = await deployer.getNonce();
  console.log("Current nonce:", currentNonce);

  try {
    // Deploy MemeToken template
    console.log("Deploying MemeToken template...");
    const MemeToken = await hre.ethers.getContractFactory("MemeToken");
    const memeToken = await MemeToken.deploy({ nonce: currentNonce });
    await memeToken.waitForDeployment();
    console.log("MemeToken template deployed to:", await memeToken.getAddress());

    // Deploy ERC20Template
    console.log("Deploying ERC20Template...");
    const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
    const erc20Template = await ERC20Template.deploy({ nonce: currentNonce + 1 });
    await erc20Template.waitForDeployment();
    console.log("ERC20Template deployed to:", await erc20Template.getAddress());

    // Deploy TokenFactory
    console.log("Deploying TokenFactory...");
    const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
    const tokenFactory = await TokenFactory.deploy({ nonce: currentNonce + 2 });
    await tokenFactory.waitForDeployment();
    console.log("TokenFactory deployed to:", await tokenFactory.getAddress());

    // Transfer ownership of TokenFactory to admin wallet
    console.log("\nTransferring ownership to admin wallet...");
    try {
      const tx = await tokenFactory.transferOwnership(ADMIN_WALLET, { nonce: currentNonce + 3 });
      await tx.wait();
      console.log("Ownership transferred to:", ADMIN_WALLET);
    } catch (error) {
      console.error("Error transferring ownership:", error);
    }

    // Verify contracts
    console.log("\nWaiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, networkConfig.verifyDelay));

    console.log("\nVerifying contracts on Etherscan/Blockscout...");
    
    try {
      await hre.run("verify:verify", {
        address: await memeToken.getAddress(),
        constructorArguments: [],
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
  } catch (error) {
    console.error("\nDeployment failed:", error);
    // If it's a nonce error, provide more helpful information
    if (error.message.includes('nonce')) {
      console.log("\nTry running these commands to fix nonce issues:");
      console.log("1. npx hardhat clean");
      console.log("2. Delete the artifacts and cache folders");
      console.log("3. Wait a few minutes for any pending transactions to complete");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 