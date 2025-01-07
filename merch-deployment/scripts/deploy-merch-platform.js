const hre = require("hardhat");

async function main() {
  try {
    const network = await hre.ethers.provider.getNetwork();
    const chainId = Number(network.chainId);
    console.log("Deploying to network:", chainId);

    let usdtAddress, usdcAddress;

    if (chainId === 1301) { // Unichain testnet
      usdtAddress = "0x70262e266E50603AcFc5D58997eF73e5a8775844";
      usdcAddress = "0x31d0220469e10c4E71834a79b1f276d740d3768F";
    } else if (chainId === 137) { // Polygon mainnet
      usdtAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
      usdcAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    } else {
      throw new Error(`Unsupported network chainId: ${chainId}`);
    }

    console.log("Deploying MerchPlatform with the following parameters:");
    console.log("USDT:", usdtAddress);
    console.log("USDC:", usdcAddress);

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance));

    const MerchPlatform = await hre.ethers.getContractFactory("MerchPlatform");
    console.log("Contract factory created, preparing deployment...");

    // Get current gas price
    const feeData = await deployer.provider.getFeeData();
    console.log("Current gas price:", hre.ethers.formatUnits(feeData.gasPrice, "gwei"), "gwei");

    // Prepare deployment overrides
    const overrides = {
      gasLimit: chainId === 137 ? 5000000 : undefined,
    };
    
    if (chainId === 137) {
      overrides.maxFeePerGas = feeData.maxFeePerGas * 2n; // Double the current max fee
      overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas * 2n; // Double the current priority fee
      console.log("Using maxFeePerGas:", hre.ethers.formatUnits(overrides.maxFeePerGas, "gwei"), "gwei");
      console.log("Using maxPriorityFeePerGas:", hre.ethers.formatUnits(overrides.maxPriorityFeePerGas, "gwei"), "gwei");
    }

    console.log("Starting deployment with overrides:", overrides);
    const merchPlatform = await MerchPlatform.deploy(
      usdtAddress,
      usdcAddress,
      overrides
    );

    console.log("Deployment transaction sent, waiting for confirmation...");
    console.log("Transaction hash:", merchPlatform.deploymentTransaction().hash);
    
    await merchPlatform.waitForDeployment();

    const deployedAddress = await merchPlatform.getAddress();
    console.log("MerchPlatform deployed to:", deployedAddress);
    console.log("Waiting for block confirmations...");
    
    // Wait for block confirmations - reduced from 5 to 2 for Polygon
    const deployTx = await merchPlatform.deploymentTransaction();
    console.log("Waiting for", chainId === 137 ? "2" : "5", "block confirmations...");
    await deployTx.wait(chainId === 137 ? 2 : 5);
    console.log("Block confirmations received");

    // Unpause the contract
    console.log("Unpausing contract...");
    const unpauseTx = await merchPlatform.unpause({
      gasLimit: chainId === 137 ? 200000 : undefined
    });
    console.log("Unpause transaction sent, waiting for confirmation...");
    await unpauseTx.wait();
    console.log("Contract unpaused");

    // Transfer ownership to ledger address
    const LEDGER_ADDRESS = "0x5828D525fe00902AE22f2270Ac714616651894fF";
    console.log("Transferring ownership to ledger:", LEDGER_ADDRESS);
    const transferTx = await merchPlatform.transferOwnership(LEDGER_ADDRESS, {
      gasLimit: chainId === 137 ? 200000 : undefined
    });
    console.log("Transfer ownership transaction sent, waiting for confirmation...");
    await transferTx.wait();
    console.log("Ownership transferred successfully");

    // Verify contract if on supported network - wrapped in try-catch
    if (chainId === 137) {
      try {
        console.log("Waiting 30 seconds before verification...");
        await new Promise(resolve => setTimeout(resolve, 30000));
        console.log("Verifying contract on Polygonscan...");
        await hre.run("verify:verify", {
          address: deployedAddress,
          constructorArguments: [usdtAddress, usdcAddress],
        });
        console.log("Contract verified successfully");
      } catch (error) {
        console.log("Contract verification failed:", error.message);
        console.log("You can verify manually later using:");
        console.log(`npx hardhat verify --network polygon ${deployedAddress} "${usdtAddress}" "${usdcAddress}"`);
      }
    }

    return deployedAddress;
  } catch (error) {
    console.error("Deployment failed with error:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 