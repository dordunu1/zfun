const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);

    const factoryAddress = process.env.FACTORY_ADDRESS;
    // Use Sepolia's standard WETH address
    const WETHAddress = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14";

    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = await Router.deploy(factoryAddress, WETHAddress);
    await router.deployed();

    // Update the .env file with the new router address
    const fs = require('fs');
    const envFile = '.env';
    let envContent = fs.readFileSync(envFile, 'utf8');
    envContent = envContent.replace(/ROUTER_ADDRESS=.*/g, `ROUTER_ADDRESS=${router.address}`);
    fs.writeFileSync(envFile, envContent);

    console.log("Environment file updated with router address");

    // Wait for 5 block confirmations for Etherscan verification
    console.log("Waiting for 5 block confirmations before verification...");
    await router.deployTransaction.wait(5);

    // Verify the contract on Etherscan
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
        address: router.address,
        constructorArguments: [factoryAddress, WETHAddress],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 