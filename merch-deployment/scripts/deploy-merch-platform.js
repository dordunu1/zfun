const hre = require("hardhat");

async function main() {
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

  const MerchPlatform = await hre.ethers.getContractFactory("MerchPlatform");
  const merchPlatform = await MerchPlatform.deploy(usdtAddress, usdcAddress);
  await merchPlatform.waitForDeployment();

  const deployedAddress = await merchPlatform.getAddress();
  console.log("MerchPlatform deployed to:", deployedAddress);
  console.log("Waiting for block confirmations...");
  
  // Wait for block confirmations
  const deployTx = await merchPlatform.deploymentTransaction();
  await deployTx.wait(5);

  // Unpause the contract
  console.log("Unpausing contract...");
  const unpauseTx = await merchPlatform.unpause();
  await unpauseTx.wait();
  console.log("Contract unpaused");

  // Transfer ownership to ledger address
  const LEDGER_ADDRESS = "0x5828D525fe00902AE22f2270Ac714616651894fF";
  console.log("Transferring ownership to ledger:", LEDGER_ADDRESS);
  const transferTx = await merchPlatform.transferOwnership(LEDGER_ADDRESS);
  await transferTx.wait();
  console.log("Ownership transferred successfully");

  // Verify contract if on supported network
  if (chainId === 137) {
    console.log("Verifying contract on Polygonscan...");
    await hre.run("verify:verify", {
      address: deployedAddress,
      constructorArguments: [usdtAddress, usdcAddress],
    });
  }

  return deployedAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 