const hre = require("hardhat");

async function main() {
  console.log("Deploying ERC20 Token Factory...");

  // Deploy the factory
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await (await TokenFactory.deploy()).waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("Token Factory deployed to:", factoryAddress);

  // Set the chain fee based on the network
  const network = await hre.ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId === 1301) { // Unichain
    const unichainFee = hre.ethers.parseEther("0.01"); // 0.01 ETH for Unichain
    await factory.setChainFee(chainId, unichainFee);
    console.log("Chain fee set for Unichain:", hre.ethers.formatEther(unichainFee), "ETH");
  } else if (chainId === 1828369849) { // Moonwalker
    const moonwalkerFee = hre.ethers.parseEther("369"); // 369 ZERO for Moonwalker
    await factory.setChainFee(chainId, moonwalkerFee);
    console.log("Chain fee set for Moonwalker:", hre.ethers.formatEther(moonwalkerFee), "ZERO");
  }

  // Wait for fee setting to be mined
  console.log("Waiting for fee setting to be confirmed...");
  await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay

  // Transfer ownership to specified address
  const newOwner = "0x5828D525fe00902AE22f2270Ac714616651894fF";
  await factory.transferOwnership(newOwner);
  console.log("Ownership transferred to:", newOwner);

  // Verify the contract
  console.log("Verifying contract...");
  await hre.run("verify:verify", {
    address: factoryAddress,
    constructorArguments: []
  });

  console.log("Contract verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 