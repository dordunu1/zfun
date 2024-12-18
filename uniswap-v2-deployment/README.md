# Uniswap V2 Deployment

## Deployment Order

1. Clean previous deployments:
```bash
node scripts/clean.js
```

2. Deploy Factory:
```bash
npx hardhat run scripts/01_deploy_factory.js --network sepolia
```

3. Get INIT_CODE_HASH:
```bash
npx hardhat run scripts/getInitHash.js --network sepolia
```

4. Update UniswapV2Library.sol with new INIT_CODE_HASH

5. Deploy Router:
```bash
npx hardhat run scripts/03_deploy_router.js --network sepolia
```

## Contract Addresses (Sepolia)
- Factory: [Update after deployment]
- Router: [Update after deployment]
- WETH: 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14

## Protocol Fees
- Fee Collector: [Your address]
- Protocol Fee: 0.05% of each swap
- LP Fee: 0.25% of each swap

## Verification
All contracts will be automatically verified on Etherscan after deployment.

## Configuration
Make sure your .env file is properly configured with:
- PRIVATE_KEY
- ETHERSCAN_API_KEY
- INFURA_API_KEY 