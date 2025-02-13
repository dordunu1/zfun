const { ethers, network } = require("hardhat");
require('dotenv').config();

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Network:", network.name);

    const factoryAddress = process.env.FACTORY_ADDRESS;
    
    // Use appropriate WETH address based on network
    let WETHAddress;
    if (network.name === 'sepolia') {
        WETHAddress = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"; // Sepolia WETH
    } else if (network.name === 'unichain') {
        WETHAddress = "0x4200000000000000000000000000000000000006"; // Unichain Mainnet WETH
    } else {
        throw new Error("Unsupported network");
    }
    
    console.log("Using WETH address:", WETHAddress);
    console.log("Using Factory address:", factoryAddress);

    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.deploy(factoryAddress, WETHAddress);
    await router.waitForDeployment();
    const routerAddress = await router.getAddress();

    console.log("Router deployed to:", routerAddress);

    // Update the .env file with the new router address
    const fs = require('fs');
    const envFile = '../.env';
    let envContent = fs.readFileSync(envFile, 'utf8');
    
    // Update network-specific router address
    if (network.name === 'sepolia') {
        envContent = envContent.replace(/VITE_ROUTER_ADDRESS_SEPOLIA=.*/g, `VITE_ROUTER_ADDRESS_SEPOLIA=${routerAddress}`);
    } else if (network.name === 'unichain') {
        envContent = envContent.replace(/VITE_ROUTER_ADDRESS_UNICHAIN=.*/g, `VITE_ROUTER_ADDRESS_UNICHAIN=${routerAddress}`);
    }
    
    fs.writeFileSync(envFile, envContent);
    console.log("Environment file updated with router address");

    // Wait for block confirmations
    console.log("Waiting for block confirmations...");
    const deployTx = await router.deploymentTransaction();
    await deployTx.wait(5);

    // Verify the contract
    try {
        console.log("Verifying contract...");
        await hre.run("verify:verify", {
            address: routerAddress,
            constructorArguments: [factoryAddress, WETHAddress],
        });
    } catch (error) {
        console.log("Verification error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 