import { ethers } from 'ethers';

// Add ERC20 ABI for token approvals
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const POSITION_MANAGER_ADDRESS = '0xB7F724d6dDDFd008eFf5cc2834edDE5F9eF0d075';
const POSITION_MANAGER_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"},{"internalType":"address","name":"_tokenDescriptor_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"DecreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"IncreaseLiquidity","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"amount0Max","type":"uint128"},{"internalType":"uint128","name":"amount1Max","type":"uint128"}],"internalType":"struct INonfungiblePositionManager.CollectParams","name":"params","type":"tuple"}],"name":"collect","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"createAndInitializePoolIfNecessary","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.DecreaseLiquidityParams","name":"params","type":"tuple"}],"name":"decreaseLiquidity","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.IncreaseLiquidityParams","name":"params","type":"tuple"}],"name":"increaseLiquidity","outputs":[{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.MintParams","name":"params","type":"tuple"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes[]","name":"data","type":"bytes[]"}],"name":"multicall","outputs":[{"internalType":"bytes[]","name":"results","type":"bytes[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"positions","outputs":[{"internalType":"uint96","name":"nonce","type":"uint96"},{"internalType":"address","name":"operator","type":"address"},{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"feeGrowthInside0LastX128","type":"uint256"},{"internalType":"uint256","name":"feeGrowthInside1LastX128","type":"uint256"},{"internalType":"uint128","name":"tokensOwed0","type":"uint128"},{"internalType":"uint128","name":"tokensOwed1","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"refundETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowed","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitAllowedIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"selfPermitIfNecessary","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"sweepToken","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Owed","type":"uint256"},{"internalType":"uint256","name":"amount1Owed","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"uniswapV3MintCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountMinimum","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"}],"name":"unwrapWETH9","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}];

// Fee amounts for V3 pools
export const FeeAmount = {
  LOWEST: 100,    // 0.01%
  LOW: 500,       // 0.05%
  MEDIUM: 3000,   // 0.3%
  HIGH: 10000     // 1%
};

// Tick spacings for each fee tier
export const TICK_SPACINGS = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200
};

// Add QuoterV2 address
export const QUOTER_V2_ADDRESS = '0x6Dd37329A1A225a6Fca658265D460423DCafBF89';

// Add QuoterV2 ABI
const QUOTER_V2_ABI = [
  'function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) external view returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
  'function quoteExactOutputSingle(tuple(address tokenIn, address tokenOut, uint256 amount, uint24 fee, uint160 sqrtPriceLimitX96) params) external view returns (uint256 amountIn, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)'
];

// Add factory address at the top with other constants
const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

// Add pool interface ABI
const POOL_INTERFACE = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() external view returns (uint128)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
];

// Add UNISWAP_V3_ADDRESSES at the top with other constants
const UNISWAP_V3_ADDRESSES = {
  factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  quoter: '0x6Dd37329A1A225a6Fca658265D460423DCafBF89'
};

// Add pool address computation
export function computePoolAddress({ tokenA, tokenB, fee }) {
  // Sort tokens (token0 must be less than token1)
  const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() 
    ? [tokenA, tokenB] 
    : [tokenB, tokenA];

  // Uniswap V3 constants
  const POOL_INIT_CODE_HASH = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54';
  const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

  // First encode the tokens and fee using abi.encode
  const encodedTokenData = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'address', 'uint24'],
    [token0, token1, fee]
  );

  // Create the final encoded data matching the Solidity implementation
  const encodedData = ethers.concat([
    '0xff',
    FACTORY_ADDRESS,
    ethers.keccak256(encodedTokenData),
    POOL_INIT_CODE_HASH
  ]);

  // Compute the address using keccak256
  const poolAddress = ethers.getAddress(
    '0x' + ethers.keccak256(encodedData).slice(26)
  );

  return poolAddress;
}

export class V3PositionManager {
  constructor(signerOrProvider) {
    if (!signerOrProvider) {
      throw new Error('Signer or provider is required');
    }

    // If it's a signer with a provider, use those directly
    if (signerOrProvider.provider) {
      this.provider = signerOrProvider.provider;
      this.signer = signerOrProvider;
    }
    // If it's a provider with a getSigner method, get the signer
    else if (signerOrProvider.getSigner) {
      this.provider = signerOrProvider;
      this.signer = signerOrProvider.getSigner();
    }
    // Otherwise assume it's a provider
    else {
      this.provider = signerOrProvider;
      this.signer = null;
    }

    // Initialize the contract with the signer if available, otherwise use provider
    this.contract = new ethers.Contract(
      POSITION_MANAGER_ADDRESS,
      POSITION_MANAGER_ABI,
      this.signer || this.provider
    );
  }

  // Token Approval Methods
  async checkTokenAllowance(tokenAddress, ownerAddress) {
    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );
      
      const allowance = await tokenContract.allowance(
        ownerAddress,
        POSITION_MANAGER_ADDRESS
      );
      
      return allowance;
    } catch (error) {
      console.error('Error checking token allowance:', error);
      throw error;
    }
  }

  async approveToken(tokenAddress, amount) {
    if (!this.signer) {
      throw new Error('Signer is required for approving tokens');
    }

    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.signer
      );
      
      const tx = await tokenContract.approve(
        POSITION_MANAGER_ADDRESS,
        amount
      );
      
      return await tx.wait();
    } catch (error) {
      console.error('Error approving token:', error);
      throw error;
    }
  }

  // Helper method to check and approve tokens if needed
  async ensureTokenApprovals(params) {
    const { token0, token1, amount0Desired, amount1Desired, ownerAddress } = params;
    
    try {
      // Check allowances
      const allowance0 = await this.checkTokenAllowance(token0, ownerAddress);
      const allowance1 = await this.checkTokenAllowance(token1, ownerAddress);

      // Convert to BigNumber for comparison
      const amount0BN = ethers.getBigInt(amount0Desired.toString());
      const amount1BN = ethers.getBigInt(amount1Desired.toString());
      const allowance0BN = ethers.getBigInt(allowance0.toString());
      const allowance1BN = ethers.getBigInt(allowance1.toString());

      // Approve if needed
      if (allowance0BN < amount0BN) {
        await this.approveToken(token0, ethers.MaxUint256);
      }
      if (allowance1BN < amount1BN) {
        await this.approveToken(token1, ethers.MaxUint256);
      }
    } catch (error) {
      console.error('Error ensuring token approvals:', error);
      throw error;
    }
  }

  // Pool Management
  async createAndInitializePool(token0, token1, fee, sqrtPriceX96) {
    if (!this.signer) {
      throw new Error('Signer is required for creating pool');
    }

    try {
      // Ensure token0 and token1 are in the correct order
      let finalToken0 = token0;
      let finalToken1 = token1;
      let finalSqrtPriceX96 = sqrtPriceX96;

      if (BigInt(token0) > BigInt(token1)) {
        finalToken0 = token1;
        finalToken1 = token0;
        // If tokens were swapped and a specific price was provided, adjust it
        if (sqrtPriceX96) {
          finalSqrtPriceX96 = (2n ** 192n) / BigInt(sqrtPriceX96);
        }
      }

      // If no specific price is provided, use a reasonable default
      // This sets the initial price to 1:1 scaled by token decimals
      if (!finalSqrtPriceX96) {
        finalSqrtPriceX96 = ethers.toBigInt('79228162514264337593543950336'); // sqrt(1) * 2^96
      }

      // First, try to create and initialize the pool
      const tx = await this.contract.createAndInitializePoolIfNecessary(
        finalToken0,
        finalToken1,
        fee,
        finalSqrtPriceX96,
        { 
          gasLimit: 5000000 // Provide enough gas for pool creation
        }
      );

      const receipt = await tx.wait();
      
      // Parse logs to find pool address
      const events = receipt.logs.map(log => {
        try {
          return this.contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      // Look for pool creation event
      const poolCreatedEvent = events.find(event => 
        event.name === 'PoolCreated' || 
        event.name === 'Pool' || 
        event.fragment?.name === 'PoolCreated'
      );
      
      if (!poolCreatedEvent) {
        // If we can't find the event, the pool might already exist
        // We can derive the pool address from the factory
        const factory = await this.contract.factory();
        const factoryContract = new ethers.Contract(
          factory,
          ['function getPool(address,address,uint24) view returns (address)'],
          this.provider
        );
        const poolAddress = await factoryContract.getPool(finalToken0, finalToken1, fee);
        
        if (poolAddress === '0x0000000000000000000000000000000000000000') {
          throw new Error('Failed to create or find pool');
        }

        return {
          pool: poolAddress,
          token0: finalToken0,
          token1: finalToken1,
          fee,
          receipt
        };
      }

      return {
        pool: poolCreatedEvent.args.pool,
        token0: finalToken0,
        token1: finalToken1,
        fee,
        receipt
      };
    } catch (error) {
      console.error('Error creating pool:', error);
      throw error;
    }
  }

  // Position Management
  async mint(params) {
    if (!this.signer) {
      throw new Error('Signer is required for minting');
    }

    try {
      const {
        token0,
        token1,
        fee,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min = 0,
        amount1Min = 0,
        recipient,
        deadline = Math.floor(Date.now() / 1000) + 1200 // 20 minutes from now
      } = params;

      // Ensure tokens are in the correct order
      let finalToken0 = token0;
      let finalToken1 = token1;
      let finalAmount0Desired = amount0Desired;
      let finalAmount1Desired = amount1Desired;
      let finalAmount0Min = amount0Min;
      let finalAmount1Min = amount1Min;
      let finalTickLower = tickLower;
      let finalTickUpper = tickUpper;

      if (BigInt(token0) > BigInt(token1)) {
        finalToken0 = token1;
        finalToken1 = token0;
        finalAmount0Desired = amount1Desired;
        finalAmount1Desired = amount0Desired;
        finalAmount0Min = amount1Min;
        finalAmount1Min = amount0Min;
        // Swap ticks when tokens are swapped
        finalTickLower = -tickUpper;
        finalTickUpper = -tickLower;
      }

      // Ensure the ticks are spaced correctly
      const tickSpacing = TICK_SPACINGS[fee];
      finalTickLower = Math.floor(finalTickLower / tickSpacing) * tickSpacing;
      finalTickUpper = Math.floor(finalTickUpper / tickSpacing) * tickSpacing;

      // First approve the position manager to spend tokens if needed
      const signerAddress = await this.signer.getAddress();
      await this.ensureTokenApprovals({
        token0: finalToken0,
        token1: finalToken1,
        amount0Desired: finalAmount0Desired,
        amount1Desired: finalAmount1Desired,
        ownerAddress: signerAddress
      });

      // Prepare mint parameters according to the Uniswap spec
      const mintParams = {
        token0: finalToken0,
        token1: finalToken1,
        fee,
        tickLower: finalTickLower,
        tickUpper: finalTickUpper,
        amount0Desired: finalAmount0Desired,
        amount1Desired: finalAmount1Desired,
        amount0Min: finalAmount0Min,
        amount1Min: finalAmount1Min,
        recipient: recipient || signerAddress,
        deadline
      };

      // Call mint on the position manager contract
      const tx = await this.contract.mint(
        mintParams,
        {
          gasLimit: 1000000 // Provide enough gas for minting
        }
      );
      
      const receipt = await tx.wait();

      // Parse all events from the receipt
      const events = receipt.logs.map(log => {
        try {
          return this.contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      // Find the relevant events
      const transferEvent = events.find(event => event.name === 'Transfer');
      const mintEvent = events.find(event => 
        event.name === 'IncreaseLiquidity' || 
        event.fragment?.name === 'IncreaseLiquidity'
      );
      
      if (!transferEvent || !mintEvent) {
        throw new Error('Required events not found in transaction receipt');
      }

      // Return the minting results
      return {
        tokenId: transferEvent.args.tokenId || transferEvent.args.id,
        liquidity: mintEvent.args.liquidity,
        amount0: mintEvent.args.amount0,
        amount1: mintEvent.args.amount1,
        receipt
      };
    } catch (error) {
      console.error('Error minting position:', error);
      throw error;
    }
  }

  async increaseLiquidity(params) {
    try {
      // Ensure tokens are approved before increasing liquidity
      await this.ensureTokenApprovals(params);
      
      const tx = await this.contract.increaseLiquidity(params);
      return await tx.wait();
    } catch (error) {
      console.error('Error increasing liquidity:', error);
      throw error;
    }
  }

  async decreaseLiquidity(params) {
    try {
      const tx = await this.contract.decreaseLiquidity(params);
      return await tx.wait();
    } catch (error) {
      console.error('Error decreasing liquidity:', error);
      throw error;
    }
  }

  async collect(params) {
    try {
      const tx = await this.contract.collect(params);
      return await tx.wait();
    } catch (error) {
      console.error('Error collecting fees:', error);
      throw error;
    }
  }

  async burn(tokenId) {
    try {
      const tx = await this.contract.burn(tokenId);
      return await tx.wait();
    } catch (error) {
      console.error('Error burning position:', error);
      throw error;
    }
  }

  // Position Information
  async getPosition(tokenId) {
    try {
      const position = await this.contract.positions(tokenId);
      return {
        nonce: position.nonce,
        operator: position.operator,
        token0: position.token0,
        token1: position.token1,
        fee: position.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        liquidity: position.liquidity,
        feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
        tokensOwed0: position.tokensOwed0,
        tokensOwed1: position.tokensOwed1
      };
    } catch (error) {
      console.error('Error getting position:', error);
      throw error;
    }
  }

  async getPositionsForOwner(owner) {
    try {
      const balance = await this.contract.balanceOf(owner);
      const positions = [];
      
      for (let i = 0; i < balance; i++) {
        const tokenId = await this.contract.tokenOfOwnerByIndex(owner, i);
        const position = await this.getPosition(tokenId);
        positions.push({ tokenId, ...position });
      }
      
      return positions;
    } catch (error) {
      console.error('Error getting positions for owner:', error);
      throw error;
    }
  }

  // Helper function to format parameters for minting
  static formatMintParams({
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    recipient,
    deadline
  }) {
    return {
      token0,
      token1,
      fee,
      tickLower,
      tickUpper,
      amount0Desired,
      amount1Desired,
      amount0Min: amount0Min || 0,
      amount1Min: amount1Min || 0,
      recipient,
      deadline: deadline || Math.floor(Date.now() / 1000) + 1200 // 20 minutes from now
    };
  }

  // Helper function to format parameters for increasing liquidity
  static formatIncreaseLiquidityParams({
    tokenId,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    deadline
  }) {
    return {
      tokenId,
      amount0Desired,
      amount1Desired,
      amount0Min: amount0Min || 0,
      amount1Min: amount1Min || 0,
      deadline: deadline || Math.floor(Date.now() / 1000) + 1200 // 20 minutes from now
    };
  }

  // Helper function to format parameters for decreasing liquidity
  static formatDecreaseLiquidityParams({
    tokenId,
    liquidity,
    amount0Min,
    amount1Min,
    deadline
  }) {
    return {
      tokenId,
      liquidity,
      amount0Min: amount0Min || 0,
      amount1Min: amount1Min || 0,
      deadline: deadline || Math.floor(Date.now() / 1000) + 1200 // 20 minutes from now
    };
  }

  // Helper function to format parameters for collecting fees
  static formatCollectParams({
    tokenId,
    recipient,
    amount0Max,
    amount1Max
  }) {
    return {
      tokenId,
      recipient,
      amount0Max: amount0Max || ethers.MaxUint128,
      amount1Max: amount1Max || ethers.MaxUint128
    };
  }

  // UI Helper Functions
  
  // Calculate price from tick
  static getPriceFromTick(tick, decimals0, decimals1) {
    const price = 1.0001 ** tick;
    return price * (10 ** (decimals1 - decimals0));
  }

  // Calculate tick from price
  static getTickFromPrice(price, decimals0, decimals1) {
    const adjustedPrice = price / (10 ** (decimals1 - decimals0));
    return Math.floor(Math.log(adjustedPrice) / Math.log(1.0001));
  }

  // Get nearest valid tick for a given price and fee tier
  static getNearestValidTick(tick, feeAmount) {
    const tickSpacing = TICK_SPACINGS[feeAmount];
    return Math.round(tick / tickSpacing) * tickSpacing;
  }

  // Calculate liquidity amounts for full range
  static getFullRangeTicks(feeAmount) {
    return {
      tickLower: -887272,  // Min tick for v3
      tickUpper: 887272    // Max tick for v3
    };
  }

  // Calculate price range ticks
  static getPriceRangeTicks({
    basePrice,
    lowerPricePercent,
    upperPricePercent,
    decimals0,
    decimals1,
    feeAmount
  }) {
    const lowerPrice = basePrice * (1 - lowerPricePercent / 100);
    const upperPrice = basePrice * (1 + upperPricePercent / 100);

    let tickLower = this.getTickFromPrice(lowerPrice, decimals0, decimals1);
    let tickUpper = this.getTickFromPrice(upperPrice, decimals0, decimals1);

    // Ensure ticks are valid for the fee tier
    tickLower = this.getNearestValidTick(tickLower, feeAmount);
    tickUpper = this.getNearestValidTick(tickUpper, feeAmount);

    return { tickLower, tickUpper };
  }

  // Format amounts with slippage
  static getAmountsWithSlippage(amount0Desired, amount1Desired, slippagePercent) {
    const slippageFactor = 1 - slippagePercent / 100;
    return {
      amount0Min: BigInt(Math.floor(Number(amount0Desired) * slippageFactor)),
      amount1Min: BigInt(Math.floor(Number(amount1Desired) * slippageFactor))
    };
  }

  // Add Liquidity Helpers
  async addLiquidityPreview({
    token0,
    token1,
    fee,
    amount0Desired,
    amount1Desired,
    tickLower,
    tickUpper,
    slippagePercent = 0.5,
    recipient,
    deadline
  }) {
    try {
      const { amount0Min, amount1Min } = this.constructor.getAmountsWithSlippage(
        amount0Desired,
        amount1Desired,
        slippagePercent
      );

      const params = this.constructor.formatMintParams({
        token0,
        token1,
        fee,
        tickLower,
        tickUpper,
        amount0Desired,
        amount1Desired,
        amount0Min,
        amount1Min,
        recipient,
        deadline
      });

      return params;
    } catch (error) {
      console.error('Error previewing add liquidity:', error);
      throw error;
    }
  }

  // Remove Liquidity Helpers
  async removeLiquidityPreview({
    tokenId,
    liquidity,
    slippagePercent = 0.5,
    deadline
  }) {
    try {
      const position = await this.getPosition(tokenId);
      
      // Calculate expected amounts based on current position
      const amount0Expected = position.tokensOwed0;
      const amount1Expected = position.tokensOwed1;

      const { amount0Min, amount1Min } = this.constructor.getAmountsWithSlippage(
        amount0Expected,
        amount1Expected,
        slippagePercent
      );

      const params = this.constructor.formatDecreaseLiquidityParams({
        tokenId,
        liquidity,
        amount0Min,
        amount1Min,
        deadline
      });

      return {
        params,
        expectedAmounts: {
          amount0: amount0Expected,
          amount1: amount1Expected
        }
      };
    } catch (error) {
      console.error('Error previewing remove liquidity:', error);
      throw error;
    }
  }

  // Position Display Helpers
  static formatPositionDisplay(position) {
    return {
      tokenId: position.tokenId,
      token0Symbol: position.token0Symbol,
      token1Symbol: position.token1Symbol,
      fee: position.fee / 10000, // Convert to percentage
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
      priceLower: this.getPriceFromTick(position.tickLower, position.decimals0, position.decimals1),
      priceUpper: this.getPriceFromTick(position.tickUpper, position.decimals0, position.decimals1),
      liquidity: position.liquidity.toString(),
      tokensOwed0: position.tokensOwed0.toString(),
      tokensOwed1: position.tokensOwed1.toString()
    };
  }

  // Fee Tier Helpers
  static getFeeTierOptions() {
    return [
      { value: FeeAmount.LOWEST, label: '0.01%', description: 'Best for very stable pairs' },
      { value: FeeAmount.LOW, label: '0.05%', description: 'Best for stable pairs' },
      { value: FeeAmount.MEDIUM, label: '0.3%', description: 'Best for most pairs' },
      { value: FeeAmount.HIGH, label: '1%', description: 'Best for volatile pairs' }
    ];
  }

  // Price Range Presets
  static getPriceRangePresets() {
    return [
      { label: 'Full Range', value: 'full', description: 'Provides liquidity across all price ranges' },
      { label: 'Safe', value: 'safe', lowerPricePercent: 10, upperPricePercent: 10, description: '±10% from current price' },
      { label: 'Moderate', value: 'moderate', lowerPricePercent: 20, upperPricePercent: 20, description: '±20% from current price' },
      { label: 'Wide', value: 'wide', lowerPricePercent: 50, upperPricePercent: 50, description: '±50% from current price' }
    ];
  }

  // Add multicall method
  async multicall(calls, options = {}) {
    if (!this.signer) {
      throw new Error('Signer is required for multicall');
    }

    try {
      // Encode the multicall data
      const multicallData = this.contract.interface.encodeFunctionData('multicall', [calls]);

      // Get the transaction parameters
      const txParams = {
        to: this.contract.address,
        data: multicallData,
        ...options,
        // Ensure value is properly formatted for display
        value: options.value ? options.value : 0n
      };

      // Send the transaction
      const tx = await this.signer.sendTransaction(txParams);
      
      const receipt = await tx.wait();
      
      // Parse the results from the multicall
      const results = receipt.logs.map(log => {
        try {
          return this.contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return {
        receipt,
        results
      };
    } catch (error) {
      console.error('Error in multicall:', error);
      throw error;
    }
  }

  // Helper method to encode function data for multicall
  encodeFunctionData(functionName, params) {
    return this.contract.interface.encodeFunctionData(functionName, params);
  }

  // Add method to get quote for exact input
  async quoteExactInputSingle(params) {
    try {
      const formattedInputAmount = ethers.formatUnits(params.amountIn, 18);
      console.log('Quoting:', formattedInputAmount, 'of token:', params.tokenIn, 'to token:', params.tokenOut);

      // For new pools, we can't get a quote since the pool doesn't exist yet
      // Instead, we'll return a default quote based on the input amount
      // This is just for UI purposes until the pool is created
      const defaultQuote = {
        amountOut: BigInt(0), // Will be determined by initial pool creation
        sqrtPriceX96After: BigInt(0),
        initializedTicksCrossed: 0,
        gasEstimate: BigInt(0),
        formattedAmountOut: '0',
        isNewPool: true
      };

      // Return the default quote for new pools
      return defaultQuote;
    } catch (error) {
      console.error('Error getting quote:', error);
      // Return default quote on error since this likely means the pool doesn't exist
      return {
        amountOut: BigInt(0),
        sqrtPriceX96After: BigInt(0),
        initializedTicksCrossed: 0,
        gasEstimate: BigInt(0),
        formattedAmountOut: '0',
        isNewPool: true,
        error: error.message
      };
    }
  }

  // Add method to get quote for exact output
  async quoteExactOutputSingle(params) {
    try {
      const formattedOutputAmount = ethers.formatUnits(params.amount, 18);
      console.log('Quoting for desired output:', formattedOutputAmount, 'of token:', params.tokenOut);

      // For new pools, return a default quote
      const defaultQuote = {
        amountIn: BigInt(0), // Will be determined by initial pool creation
        sqrtPriceX96After: BigInt(0),
        initializedTicksCrossed: 0,
        gasEstimate: BigInt(0),
        formattedAmountIn: '0',
        isNewPool: true
      };

      // Return the default quote for new pools
      return defaultQuote;
    } catch (error) {
      console.error('Error getting quote:', error);
      // Return default quote on error since this likely means the pool doesn't exist
      return {
        amountIn: BigInt(0),
        sqrtPriceX96After: BigInt(0),
        initializedTicksCrossed: 0,
        gasEstimate: BigInt(0),
        formattedAmountIn: '0',
        isNewPool: true,
        error: error.message
      };
    }
  }

  // Update method to get existing pool data
  async getPoolData(token0Address, token1Address, fee) {
    try {
      // Get factory contract
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        [
          'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
        ],
        this.provider
      );

      // Get pool address - note that token order doesn't matter for this call
      const poolAddress = await factoryContract.getPool(token0Address, token1Address, fee);
      
      // If pool doesn't exist, return default values
      if (poolAddress === ethers.ZeroAddress) {
        return {
          exists: false,
          sqrtPriceX96: 0n,
          tick: 0,
          liquidity: 0n,
          token0: token0Address,
          token1: token1Address,
          poolAddress: null
        };
      }

      // Get pool contract
      const poolContract = new ethers.Contract(
        poolAddress,
        POOL_INTERFACE,
        this.provider
      );

      // Get all pool data in parallel
      const [slot0, liquidity, actualToken0, actualToken1] = await Promise.all([
        poolContract.slot0(),
        poolContract.liquidity(),
        poolContract.token0(),
        poolContract.token1()
      ]);

      console.log('Pool data:', {
        address: poolAddress,
        sqrtPriceX96: slot0.sqrtPriceX96.toString(),
        tick: slot0.tick,
        token0: actualToken0,
        token1: actualToken1
      });

      return {
        exists: true,
        sqrtPriceX96: slot0.sqrtPriceX96,
        tick: slot0.tick,
        liquidity,
        token0: actualToken0,
        token1: actualToken1,
        poolAddress
      };
    } catch (error) {
      console.error('Error getting pool data:', error);
      return {
        exists: false,
        sqrtPriceX96: 0n,
        tick: 0,
        liquidity: 0n,
        token0: token0Address,
        token1: token1Address,
        poolAddress: null
      };
    }
  }
} 