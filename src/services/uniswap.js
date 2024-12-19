import { ethers } from 'ethers';
import { createPublicClient, http, createWalletClient } from 'viem';
import { toast } from 'react-hot-toast';

// Uniswap V2 Contract Addresses (Sepolia)
export const UNISWAP_ADDRESSES = {
  factory: '0xAE3511d8ad1bD1bDAdF8dF44d3158ED5aeF72703',
  router: '0xc9393aFAAAe60e5f4532cfa7171749171158b1e9',
  // Common tokens on Sepolia
  WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  USDT: '0x148b1aB3e2321d79027C4b71B6118e70434B4784', // TestUSDT address
  USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'  // USDC address
};

// Uniswap V2 ABIs
const FACTORY_ABI = [
  'function createPair(address tokenA, address tokenB) external returns (address pair)',
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function allPairs(uint) external view returns (address pair)',
  'function allPairsLength() external view returns (uint)',
  'function feeTo() external view returns (address)',
  'function feeToSetter() external view returns (address)',
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)'
];

const ROUTER_ABI = [
  // Swapping
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  // Add ETH specific swap methods
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  // Liquidity
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
  // Quote
  'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)',
  'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)',
];

const PAIR_ABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function price0CumulativeLast() external view returns (uint)',
  'function price1CumulativeLast() external view returns (uint)',
];

const ERC20_ABI = [
  'function approve(address spender, uint value) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)',
  'function totalSupply() external view returns (uint256)',
  'function transfer(address to, uint value) external returns (bool)',
  'function transferFrom(address from, address to, uint value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint)'
];

export class UniswapService {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    
    // Create contract instances
    this.factory = {
      address: UNISWAP_ADDRESSES.factory,
      abi: FACTORY_ABI
    };
    
    this.router = {
      address: UNISWAP_ADDRESSES.router,
      abi: ROUTER_ABI
    };

    // Initialize cache
    this.poolCache = new Map();
    this.poolInfoCache = new Map();
    this.lastCacheUpdate = 0;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    // Load cache from localStorage on initialization
    this.loadCacheFromStorage();
  }

  // Cache management methods
  loadCacheFromStorage() {
    try {
      const storedCache = localStorage.getItem('uniswapPoolCache');
      if (storedCache) {
        const { pools, poolInfo, timestamp } = JSON.parse(storedCache);
        // Only load cache if it's not too old (less than 1 hour)
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          this.poolCache = new Map(pools);
          this.poolInfoCache = new Map(poolInfo);
          this.lastCacheUpdate = timestamp;
        }
      }
    } catch (error) {
      console.warn('Error loading cache from storage:', error);
    }
  }

  saveCacheToStorage() {
    try {
      const cacheData = {
        pools: Array.from(this.poolCache.entries()),
        poolInfo: Array.from(this.poolInfoCache.entries()),
        timestamp: Date.now()
      };
      localStorage.setItem('uniswapPoolCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error saving cache to storage:', error);
    }
  }

  clearCache() {
    this.poolCache.clear();
    this.poolInfoCache.clear();
    this.lastCacheUpdate = 0;
    localStorage.removeItem('uniswapPoolCache');
  }

  isCacheValid() {
    return Date.now() - this.lastCacheUpdate < this.CACHE_DURATION;
  }

  // Get all pools for a token
  async getPools(tokenAddress) {
    if (!tokenAddress) {
      console.error('tokenAddress is required for getPools');
      throw new Error('tokenAddress is required');
    }

    try {
      console.log('Getting pools for token:', tokenAddress);
      const factory = new ethers.Contract(
        UNISWAP_ADDRESSES.factory,
        FACTORY_ABI,
        new ethers.BrowserProvider(window.ethereum)
      );

      const pairCount = await factory.allPairsLength();
      console.log('Total pairs:', pairCount.toString());
      const pairs = [];

      for (let i = 0; i < pairCount; i++) {
        try {
          const pairAddress = await factory.allPairs(i);
          console.log(`Checking pair ${i}:`, pairAddress);
          
          const pair = new ethers.Contract(
            pairAddress,
            PAIR_ABI,
            new ethers.BrowserProvider(window.ethereum)
          );

          const [token0, token1, reserves] = await Promise.all([
            pair.token0(),
            pair.token1(),
            pair.getReserves()
          ]);

          console.log(`Pair ${i} tokens:`, token0, token1);
          
          if (token0.toLowerCase() === tokenAddress.toLowerCase() || 
              token1.toLowerCase() === tokenAddress.toLowerCase()) {
            pairs.push({
              address: pairAddress,
              token0,
              token1,
              reserves
            });
            console.log('Found matching pair:', pairAddress);
          }
        } catch (pairError) {
          console.error(`Error processing pair ${i}:`, pairError);
          // Continue to next pair
          continue;
        }
      }

      console.log('Found pairs:', pairs.length);
      return pairs;
    } catch (error) {
      console.error('Error getting pools:', error);
      throw error;
    }
  }

  // Add new method to check if pool exists
  async checkPoolExists(tokenA, tokenB) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(
        UNISWAP_ADDRESSES.factory,
        FACTORY_ABI,
        provider
      );

      const pairAddress = await factory.getPair(tokenA, tokenB);
      return pairAddress !== '0x0000000000000000000000000000000000000000';
    } catch (error) {
      console.error('Error checking pool existence:', error);
      throw error;
    }
  }

  // Pool creation only
  async createPool(
    token0Address,
    token1Address,
    amount0Desired,
    amount1Desired
  ) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();

      // Check if one of the tokens is ETH
      const isToken0ETH = token0Address.toLowerCase() === 'eth';
      const isToken1ETH = token1Address.toLowerCase() === 'eth';
      
      // Convert ETH address to WETH for pair creation
      const actualToken0 = isToken0ETH ? UNISWAP_ADDRESSES.WETH : token0Address;
      const actualToken1 = isToken1ETH ? UNISWAP_ADDRESSES.WETH : token1Address;

      // Sort token addresses (required by Uniswap)
      const [token0, token1] = actualToken0.toLowerCase() < actualToken1.toLowerCase()
        ? [actualToken0, actualToken1]
        : [actualToken1, actualToken0];

      // Sort amounts according to token order
      const [amount0, amount1] = actualToken0.toLowerCase() < actualToken1.toLowerCase()
        ? [amount0Desired, amount1Desired]
        : [amount1Desired, amount0Desired];

      // Create contract instances
      const factory = new ethers.Contract(UNISWAP_ADDRESSES.factory, FACTORY_ABI, signer);
      const router = new ethers.Contract(UNISWAP_ADDRESSES.router, ROUTER_ABI, signer);

      // Create token contract instances (only for non-ETH tokens)
      const token0Contract = !isToken0ETH ? new ethers.Contract(token0, ERC20_ABI, signer) : null;
      const token1Contract = !isToken1ETH ? new ethers.Contract(token1, ERC20_ABI, signer) : null;

      // Check if pair exists
      console.log('Checking if pair exists...');
      const existingPair = await factory.getPair(token0, token1);
      console.log('Existing pair address:', existingPair);

      if (existingPair !== '0x0000000000000000000000000000000000000000') {
        throw new Error('Pool already exists');
      }

      // Get optimized gas price (5% above base fee)
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice * 105n / 100n;

      // Handle approvals for non-ETH tokens
      const maxApproval = ethers.MaxUint256;
      const approvalPromises = [];

      // Check and handle approvals for both tokens simultaneously
      if (!isToken0ETH && !isToken1ETH) {
        const [allowance0, allowance1] = await Promise.all([
          token0Contract.allowance(account, UNISWAP_ADDRESSES.router),
          token1Contract.allowance(account, UNISWAP_ADDRESSES.router)
        ]);

        // Estimate gas for approvals
        const [gas0, gas1] = await Promise.all([
          token0Contract.approve.estimateGas(UNISWAP_ADDRESSES.router, maxApproval),
          token1Contract.approve.estimateGas(UNISWAP_ADDRESSES.router, maxApproval)
        ]).catch(e => [100000n, 100000n]); // Fallback gas limits if estimation fails

        if (allowance0 < amount0) {
          console.log('Approving token0...');
          toast.loading('Approving first token...', { id: 'approve0' });
          approvalPromises.push(
            token0Contract.approve(UNISWAP_ADDRESSES.router, maxApproval, {
              gasLimit: gas0 * 120n / 100n, // Add 20% buffer to estimated gas
              gasPrice
            }).then(tx => tx.wait()).then(() => {
              toast.success('First token approved', { id: 'approve0' });
            }).catch(error => {
              toast.error('Failed to approve first token: ' + error.message, { id: 'approve0' });
              throw error;
            })
          );
        }

        if (allowance1 < amount1) {
          console.log('Approving token1...');
          toast.loading('Approving second token...', { id: 'approve1' });
          approvalPromises.push(
            token1Contract.approve(UNISWAP_ADDRESSES.router, maxApproval, {
              gasLimit: gas1 * 120n / 100n, // Add 20% buffer to estimated gas
              gasPrice
            }).then(tx => tx.wait()).then(() => {
              toast.success('Second token approved', { id: 'approve1' });
            }).catch(error => {
              toast.error('Failed to approve second token: ' + error.message, { id: 'approve1' });
              throw error;
            })
          );
        }
      } else if (!isToken0ETH) {
        // Only token0 needs approval
        const allowance0 = await token0Contract.allowance(account, UNISWAP_ADDRESSES.router);
        const gas0 = await token0Contract.approve.estimateGas(UNISWAP_ADDRESSES.router, maxApproval)
          .catch(() => 100000n);

        if (allowance0 < amount0) {
          console.log('Approving token0...');
          toast.loading('Approving token...', { id: 'approve0' });
          approvalPromises.push(
            token0Contract.approve(UNISWAP_ADDRESSES.router, maxApproval, {
              gasLimit: gas0 * 120n / 100n,
              gasPrice
            }).then(tx => tx.wait()).then(() => {
              toast.success('Token approved', { id: 'approve0' });
            }).catch(error => {
              toast.error('Failed to approve token: ' + error.message, { id: 'approve0' });
              throw error;
            })
          );
        }
      } else if (!isToken1ETH) {
        // Only token1 needs approval
        const allowance1 = await token1Contract.allowance(account, UNISWAP_ADDRESSES.router);
        const gas1 = await token1Contract.approve.estimateGas(UNISWAP_ADDRESSES.router, maxApproval)
          .catch(() => 100000n);

        if (allowance1 < amount1) {
          console.log('Approving token1...');
          toast.loading('Approving token...', { id: 'approve1' });
          approvalPromises.push(
            token1Contract.approve(UNISWAP_ADDRESSES.router, maxApproval, {
              gasLimit: gas1 * 120n / 100n,
              gasPrice
            }).then(tx => tx.wait()).then(() => {
              toast.success('Token approved', { id: 'approve1' });
            }).catch(error => {
              toast.error('Failed to approve token: ' + error.message, { id: 'approve1' });
              throw error;
            })
          );
        }
      }

      // Wait for all approvals to complete
      if (approvalPromises.length > 0) {
        await Promise.all(approvalPromises);
        console.log('All tokens approved');
        
        // Double check allowances after approvals
        const finalAllowances = await Promise.all([
          !isToken0ETH ? token0Contract.allowance(account, UNISWAP_ADDRESSES.router) : maxApproval,
          !isToken1ETH ? token1Contract.allowance(account, UNISWAP_ADDRESSES.router) : maxApproval
        ]);

        if (finalAllowances[0] < amount0 || finalAllowances[1] < amount1) {
          throw new Error('Approval process failed. Please try again.');
        }
      }

      // Create pair
      console.log('Creating pair...');
      toast.loading('Creating liquidity pool...', { id: 'create-pool' });
      
      // Estimate gas for pair creation
      const createPairGas = await factory.createPair.estimateGas(token0, token1)
        .catch(() => 3000000n);

      const createPairTx = await factory.createPair(token0, token1, {
        gasLimit: createPairGas * 120n / 100n,
        gasPrice
      });
      
      console.log('Create pair transaction sent:', createPairTx.hash);
      const createPairReceipt = await createPairTx.wait();
      console.log('Create pair transaction confirmed');
      toast.success('Pool created successfully!', { id: 'create-pool' });

      // Get pair address from event
      const pairCreatedEvent = createPairReceipt.logs.find(log => {
        try {
          const parsedLog = factory.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          return parsedLog.name === 'PairCreated';
        } catch (e) {
          return false;
        }
      });

      if (!pairCreatedEvent) {
        throw new Error('Failed to get pair address from transaction receipt');
      }

      const parsedLog = factory.interface.parseLog({
        topics: pairCreatedEvent.topics,
        data: pairCreatedEvent.data
      });
      const pairAddress = parsedLog.args[2];
      console.log('Created pair address:', pairAddress);

      // Wait for pair to be fully deployed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate minimum amounts with 1% slippage tolerance
      const amount0Min = (amount0 * 99n) / 100n;
      const amount1Min = (amount1 * 99n) / 100n;

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes

      // Add liquidity based on whether ETH is involved
      let addLiquidityTx;
      toast.loading('Adding initial liquidity...', { id: 'add-liquidity' });
      if (isToken0ETH || isToken1ETH) {
        // One of the tokens is ETH
        const tokenAddress = isToken0ETH ? token1 : token0;
        const ethAmount = isToken0ETH ? amount0 : amount1;
        const tokenAmount = isToken0ETH ? amount1 : amount0;
        const ethAmountMin = isToken0ETH ? amount0Min : amount1Min;
        const tokenAmountMin = isToken0ETH ? amount1Min : amount0Min;

        console.log('Adding ETH liquidity with params:', {
          token: tokenAddress,
          ethAmount: ethAmount.toString(),
          tokenAmount: tokenAmount.toString(),
          ethAmountMin: ethAmountMin.toString(),
          tokenAmountMin: tokenAmountMin.toString()
        });

        addLiquidityTx = await router.addLiquidityETH(
          tokenAddress,
          tokenAmount,
          tokenAmountMin,
          ethAmountMin,
          account,
          deadline,
          {
            value: ethAmount,
            gasLimit: 500000,
            gasPrice
          }
        );
      } else {
        // Both are ERC20 tokens
        addLiquidityTx = await router.addLiquidity(
          token0,
          token1,
          amount0,
          amount1,
          amount0Min,
          amount1Min,
          account,
          deadline,
          {
            gasLimit: 500000,
            gasPrice
          }
        );
      }

      console.log('Add liquidity transaction sent:', addLiquidityTx.hash);
      const addLiquidityReceipt = await addLiquidityTx.wait();
      console.log('Add liquidity transaction confirmed');
      toast.success('Initial liquidity added successfully!', { id: 'add-liquidity' });

      return {
        pairAddress,
        createPairReceipt,
        addLiquidityReceipt
      };
    } catch (error) {
      console.error('Error in pool creation:', error);
      if (error.message.includes('INSUFFICIENT_A_AMOUNT')) {
        toast.error('Insufficient amount for token A. Try increasing the amount.');
        throw new Error('Insufficient amount for token A. Try increasing the amount.');
      } else if (error.message.includes('INSUFFICIENT_B_AMOUNT')) {
        toast.error('Insufficient amount for token B. Try increasing the amount.');
        throw new Error('Insufficient amount for token B. Try increasing the amount.');
      } else if (error.message.includes('TRANSFER_FROM_FAILED')) {
        toast.error('Transfer failed. Please check your token balances and approvals.');
        throw new Error('Transfer failed. Please check your token balances and approvals.');
      }
      toast.error(error.message);
      throw error;
    }
  }

  // Token Swapping
  async swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now
  ) {
    try {
      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner().catch(error => {
        console.error('Error getting signer:', error);
        if (error.message.includes('Ledger')) {
          throw new Error('Please make sure your Ledger is connected and the Ethereum app is open');
        }
        throw error;
      });

      // Create contract instances
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      const tokenContract = new ethers.Contract(
        path[0],
        ERC20_ABI,
        signer
      );

      // Check user's token balance
      const balance = await tokenContract.balanceOf(to);
      if (balance < amountIn) {
        throw new Error(`Insufficient token balance. Required: ${ethers.formatUnits(amountIn, await tokenContract.decimals())}, Available: ${ethers.formatUnits(balance, await tokenContract.decimals())}`);
      }

      // Check current allowance
      const currentAllowance = await tokenContract.allowance(to, UNISWAP_ADDRESSES.router);
      console.log('Current allowance:', currentAllowance.toString());
      console.log('Required amount:', amountIn.toString());

      // Only approve if current allowance is insufficient
      if (currentAllowance < amountIn) {
        console.log('Approving token for swap...');
        try {
          // First set allowance to 0 to handle non-standard tokens
          if (currentAllowance > 0) {
            const resetTx = await tokenContract.approve(UNISWAP_ADDRESSES.router, 0);
            await resetTx.wait();
          }
          
          const approveTx = await tokenContract.approve(UNISWAP_ADDRESSES.router, amountIn);
          await approveTx.wait();
          console.log('Token approved');
        } catch (approveError) {
          console.error('Error approving token:', approveError);
          if (approveError.message.includes('Ledger')) {
            throw new Error('Please make sure your Ledger is connected and the Ethereum app is open');
          }
          throw approveError;
        }
      } else {
        console.log('Sufficient allowance exists, skipping approval');
      }

      // Verify allowance after approval
      const finalAllowance = await tokenContract.allowance(to, UNISWAP_ADDRESSES.router);
      if (finalAllowance < amountIn) {
        throw new Error('Failed to approve token transfer');
      }

      console.log('Executing swap with params:', {
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
        path,
        to,
        deadline: deadline.toString()
      });

      // Execute swap
      try {
        const tx = await router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline,
          { gasLimit: 3000000 }
        );

        console.log('Swap transaction:', tx.hash);
        const receipt = await tx.wait();
        console.log('Swap receipt:', receipt);
        
        return receipt;
      } catch (swapError) {
        console.error('Error executing swap:', swapError);
        if (swapError.message.includes('Ledger')) {
          throw new Error('Please make sure your Ledger is connected and the Ethereum app is open');
        }
        throw swapError;
      }
    } catch (error) {
      console.error('Error swapping tokens:', error);
      throw error;
    }
  }

  // Add Liquidity
  async addLiquidity(
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
  ) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instances
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);

      console.log('Checking pool info...');
      // Get pool info to check the optimal ratio
      const poolInfo = await this.getPoolInfo(tokenA, tokenB);
      
      let finalAmountA = amountADesired;
      let finalAmountB = amountBDesired;

      if (poolInfo) {
        // Pool exists, calculate optimal amounts based on current ratio
        const reserve0 = poolInfo.reserve0;
        const reserve1 = poolInfo.reserve1;
        
        if (reserve0 > 0 && reserve1 > 0) {
          if (tokenA.toLowerCase() === poolInfo.token0.address.toLowerCase()) {
            finalAmountB = (amountADesired * reserve1) / reserve0;
            if (finalAmountB > amountBDesired) {
              finalAmountB = amountBDesired;
              finalAmountA = (amountBDesired * reserve0) / reserve1;
            }
          } else {
            finalAmountB = (amountADesired * reserve0) / reserve1;
            if (finalAmountB > amountBDesired) {
              finalAmountB = amountBDesired;
              finalAmountA = (amountBDesired * reserve1) / reserve0;
            }
          }
        }
      }

      // Calculate minimum amounts with 1% slippage tolerance
      const slippageTolerance = 99n; // 99% of the desired amount (1% slippage)
      const finalAmountAMin = (finalAmountA * slippageTolerance) / 100n;
      const finalAmountBMin = (finalAmountB * slippageTolerance) / 100n;

      console.log('Approving tokens for liquidity addition...', {
        tokenA,
        tokenB,
        finalAmountA: finalAmountA.toString(),
        finalAmountB: finalAmountB.toString(),
        finalAmountAMin: finalAmountAMin.toString(),
        finalAmountBMin: finalAmountBMin.toString()
      });

      // Approve router to spend both tokens
      const approveATx = await tokenAContract.approve(UNISWAP_ADDRESSES.router, finalAmountA);
      await approveATx.wait();
      console.log('Token A approved');

      const approveBTx = await tokenBContract.approve(UNISWAP_ADDRESSES.router, finalAmountB);
      await approveBTx.wait();
      console.log('Token B approved');

      // Add liquidity with optimized parameters
      const tx = await router.addLiquidity(
        tokenA,
        tokenB,
        finalAmountA,
        finalAmountB,
        finalAmountAMin,
        finalAmountBMin,
        to,
        deadline,
        { gasLimit: 3000000 }
      );

      console.log('Add liquidity transaction:', tx.hash);
      const receipt = await tx.wait();
      console.log('Add liquidity receipt:', receipt);
      
      return receipt;
    } catch (error) {
      console.error('Error adding liquidity:', error);
      if (error.message.includes('INSUFFICIENT_A_AMOUNT')) {
        throw new Error('Insufficient amount for token A based on current pool ratio');
      } else if (error.message.includes('INSUFFICIENT_B_AMOUNT')) {
        throw new Error('Insufficient amount for token B based on current pool ratio');
      }
      throw error;
    }
  }

  // Get Pool Information
  async getPoolInfo(tokenA, tokenB) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(
        UNISWAP_ADDRESSES.factory,
        FACTORY_ABI,
        provider
      );

      const pairAddress = await factory.getPair(tokenA, tokenB);
      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      const pair = new ethers.Contract(
        pairAddress,
        PAIR_ABI,
        provider
      );

      // Get pool information
      const [token0, token1, reserves] = await Promise.all([
        pair.token0(),
        pair.token1(),
        pair.getReserves()
      ]);

      // Get token information
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider);
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider);

      const [
        token0Symbol,
        token0Decimals,
        token1Symbol,
        token1Decimals
      ] = await Promise.all([
        token0Contract.symbol(),
        token0Contract.decimals(),
        token1Contract.symbol(),
        token1Contract.decimals()
      ]);

      return {
        pairAddress,
        token0: {
          address: token0,
          symbol: token0Symbol,
          decimals: token0Decimals
        },
        token1: {
          address: token1,
          symbol: token1Symbol,
          decimals: token1Decimals
        },
        reserve0: reserves[0],
        reserve1: reserves[1]
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  // Quote
  async getAmountOut(amountIn, path) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        provider
      );
      
      // If first token is ETH, replace with WETH in path for quote
      const quotePath = [...path];
      if (quotePath[0].toLowerCase() === 'ETH') {
        quotePath[0] = UNISWAP_ADDRESSES.WETH;
      }
      
      const amounts = await router.getAmountsOut(amountIn, quotePath);
      return amounts[amounts.length - 1];
    } catch (error) {
      console.error('Error getting amount out:', error);
      throw error;
    }
  }

  // Get Token Info
  async getTokenInfo(tokenAddress) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      // Try to get all token information with fallbacks
      const [symbol, name, decimals] = await Promise.all([
        tokenContract.symbol().catch(() => 'Unknown'),
        tokenContract.name().catch(() => 'Unknown Token'),
        tokenContract.decimals().catch(() => 18)
      ]);

      // Special handling for known tokens
      if (tokenAddress.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
        return {
          symbol: 'WETH',
          name: 'Wrapped Ether',
          decimals: 18,
          logo: '/eth.png'
        };
      }

      if (tokenAddress.toLowerCase() === UNISWAP_ADDRESSES.USDT.toLowerCase()) {
        return {
          symbol: 'tUSDT',
          name: 'Test USDT',
          decimals: 6,
          logo: '/usdt.png'
        };
      }

      if (tokenAddress.toLowerCase() === UNISWAP_ADDRESSES.USDC.toLowerCase()) {
        return {
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          logo: '/usdc.png'
        };
      }

      return { 
        symbol: symbol || 'Unknown', 
        name: name || 'Unknown Token', 
        decimals: decimals || 18 
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      // Return fallback values if there's an error
      return {
        symbol: 'Unknown',
        name: 'Unknown Token',
        decimals: 18
      };
    }
  }

  // Get Pool Information by Pair Address
  async getPoolInfoByAddress(pairAddress) {
    try {
      console.log('Getting pool info for:', pairAddress);
      
      // Normalize address for cache lookup
      const normalizedAddress = pairAddress.toLowerCase();
      
      // Check cache first
      if (this.isCacheValid() && this.poolInfoCache.has(normalizedAddress)) {
        console.log('Returning pool info from cache');
        return this.poolInfoCache.get(normalizedAddress);
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, provider);

      // Get token addresses
      const [token0Address, token1Address] = await Promise.all([
        pair.token0(),
        pair.token1()
      ]);

      // Get token contracts
      const token0Contract = new ethers.Contract(token0Address, ERC20_ABI, provider);
      const token1Contract = new ethers.Contract(token1Address, ERC20_ABI, provider);

      // Get token info
      const [
        token0Symbol,
        token0Name,
        token0Decimals,
        token1Symbol,
        token1Name,
        token1Decimals,
        reserves
      ] = await Promise.all([
        token0Contract.symbol().catch(() => 'Unknown'),
        token0Contract.name().catch(() => 'Unknown Token'),
        token0Contract.decimals().catch(() => 18),
        token1Contract.symbol().catch(() => 'Unknown'),
        token1Contract.name().catch(() => 'Unknown Token'),
        token1Contract.decimals().catch(() => 18),
        pair.getReserves()
      ]);

      const poolInfo = {
        token0: {
          address: token0Address,
          symbol: token0Symbol,
          name: token0Name,
          decimals: token0Decimals
        },
        token1: {
          address: token1Address,
          symbol: token1Symbol,
          name: token1Name,
          decimals: token1Decimals
        },
        reserves: {
          reserve0: reserves[0],
          reserve1: reserves[1],
          blockTimestampLast: reserves[2]
        }
      };

      // Update cache and save to storage
      this.poolInfoCache.set(normalizedAddress, poolInfo);
      this.saveCacheToStorage();

      return poolInfo;
    } catch (error) {
      console.error('Error getting pool info:', error);
      // If there's an error but we have cached data, return it
      if (this.poolInfoCache.has(pairAddress.toLowerCase())) {
        console.log('Returning cached pool info due to error');
        return this.poolInfoCache.get(pairAddress.toLowerCase());
      }
      return null;
    }
  }

  // Update swapExactETHForTokens function
  async swapExactETHForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now
  ) {
    try {
      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner().catch(error => {
        console.error('Error getting signer:', error);
        if (error.message.includes('Ledger')) {
          throw new Error('Please make sure your Ledger is connected and the Ethereum app is open');
        }
        throw error;
      });

      // Verify path starts with WETH
      if (path[0].toLowerCase() !== UNISWAP_ADDRESSES.WETH.toLowerCase()) {
        throw new Error('Path must start with WETH for ETH swaps');
      }

      // Create router contract instance
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      console.log('Executing ETH swap with params:', {
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
        path,
        to,
        deadline: deadline.toString()
      });

      // Execute swap with ETH
      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        path,
        to,
        deadline,
        {
          value: amountIn,
          gasLimit: 3000000
        }
      );

      console.log('Swap transaction:', tx.hash);
      const receipt = await tx.wait();
      console.log('Swap receipt:', receipt);
      
      return receipt;
    } catch (error) {
      console.error('Error swapping ETH for tokens:', error);
      throw error;
    }
  }

  // Update swapExactTokensForTokens with optimized gas
  async swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
  ) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      const tokenContract = new ethers.Contract(
        path[0],
        ERC20_ABI,
        signer
      );

      // Get gas price with 10% boost
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice * 110n / 100n;

      // Check and handle approvals
      const currentAllowance = await tokenContract.allowance(to, UNISWAP_ADDRESSES.router);
      if (currentAllowance < amountIn) {
        const approveTx = await tokenContract.approve(
          UNISWAP_ADDRESSES.router,
          amountIn,
          {
            gasLimit: 60000,
            gasPrice
          }
        );
        await approveTx.wait();
      }

      // Execute swap with optimized gas
      const tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline,
        {
          gasLimit: 150000,
          gasPrice
        }
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error swapping tokens:', error);
      throw error;
    }
  }

  // Update addLiquidity with optimized gas
  async addLiquidity(
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)
  ) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get optimized gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice * 110n / 100n;

      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      const tokenAContract = new ethers.Contract(tokenA, ERC20_ABI, signer);
      const tokenBContract = new ethers.Contract(tokenB, ERC20_ABI, signer);

      // Optimize approvals
      const approveAParams = {
        gasLimit: 60000,
        gasPrice
      };
      const approveBParams = {
        gasLimit: 60000,
        gasPrice
      };

      // Only approve if needed
      const allowanceA = await tokenAContract.allowance(to, UNISWAP_ADDRESSES.router);
      const allowanceB = await tokenBContract.allowance(to, UNISWAP_ADDRESSES.router);

      if (allowanceA < amountADesired) {
        const approveATx = await tokenAContract.approve(
          UNISWAP_ADDRESSES.router,
          amountADesired,
          approveAParams
        );
        await approveATx.wait();
      }

      if (allowanceB < amountBDesired) {
        const approveBTx = await tokenBContract.approve(
          UNISWAP_ADDRESSES.router,
          amountBDesired,
          approveBParams
        );
        await approveBTx.wait();
      }

      // Add liquidity with optimized gas
      const tx = await router.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline,
        {
          gasLimit: 250000,
          gasPrice
        }
      );

      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error adding liquidity:', error);
      throw error;
    }
  }

  // Add swapExactTokensForETH function
  async swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now
  ) {
    try {
      // Request account access first
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Verify path ends with WETH
      if (path[path.length - 1].toLowerCase() !== UNISWAP_ADDRESSES.WETH.toLowerCase()) {
        throw new Error('Path must end with WETH for ETH swaps');
      }

      // Create contract instances
      const router = new ethers.Contract(
        UNISWAP_ADDRESSES.router,
        ROUTER_ABI,
        signer
      );

      const tokenContract = new ethers.Contract(
        path[0],
        ERC20_ABI,
        signer
      );

      // Check and handle approvals
      const currentAllowance = await tokenContract.allowance(to, UNISWAP_ADDRESSES.router);
      if (currentAllowance < amountIn) {
        console.log('Approving token for swap...');
        const approveTx = await tokenContract.approve(UNISWAP_ADDRESSES.router, amountIn);
        await approveTx.wait();
        console.log('Token approved');
      }

      console.log('Executing token to ETH swap with params:', {
        amountIn: amountIn.toString(),
        amountOutMin: amountOutMin.toString(),
        path,
        to,
        deadline: deadline.toString()
      });

      // Get gas price with 10% boost for better chances of execution
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice * 110n / 100n;

      // Execute swap
      const tx = await router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline,
        {
          gasLimit: 250000,
          gasPrice
        }
      );

      console.log('Swap transaction:', tx.hash);
      const receipt = await tx.wait();
      console.log('Swap receipt:', receipt);
      
      return receipt;
    } catch (error) {
      console.error('Error swapping tokens for ETH:', error);
      throw error;
    }
  }

  // Update getAllPools with caching
  async getAllPools() {
    try {
      console.log('Getting all pools from factory');
      
      // Check cache first
      if (this.isCacheValid() && this.poolCache.size > 0) {
        console.log('Returning pools from cache');
        return Array.from(this.poolCache.values());
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(
        UNISWAP_ADDRESSES.factory,
        FACTORY_ABI,
        provider
      );

      const pairCount = await factory.allPairsLength();
      console.log('Total pairs:', pairCount.toString());
      const pairs = [];

      // Batch the requests in groups of 10 for better performance
      const batchSize = 10;
      for (let i = 0; i < pairCount; i += batchSize) {
        const promises = [];
        for (let j = 0; j < batchSize && i + j < pairCount; j++) {
          promises.push(factory.allPairs(i + j));
        }
        const batchResults = await Promise.all(promises);
        pairs.push(...batchResults);
        
        // Update cache as we go
        batchResults.forEach(address => {
          this.poolCache.set(address.toLowerCase(), address);
        });
      }

      console.log('Found pairs:', pairs.length);
      
      // Update cache timestamp and save to storage
      this.lastCacheUpdate = Date.now();
      this.saveCacheToStorage();
      
      return pairs;
    } catch (error) {
      console.error('Error getting all pools:', error);
      // If there's an error but we have cached data, return it
      if (this.poolCache.size > 0) {
        console.log('Returning cached pools due to error');
        return Array.from(this.poolCache.values());
      }
      throw error;
    }
  }

  // Add method to batch load pool info
  async batchLoadPoolInfo(poolAddresses) {
    const uncachedPools = poolAddresses.filter(
      address => !this.isCacheValid() || !this.poolInfoCache.has(address.toLowerCase())
    );

    if (uncachedPools.length === 0) {
      console.log('All pool info available in cache');
      return poolAddresses.map(address => 
        this.poolInfoCache.get(address.toLowerCase())
      );
    }

    console.log(`Loading info for ${uncachedPools.length} uncached pools`);
    const batchSize = 5;
    const results = [];

    for (let i = 0; i < uncachedPools.length; i += batchSize) {
      const batch = uncachedPools.slice(i, i + batchSize);
      const promises = batch.map(address => this.getPoolInfoByAddress(address));
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }

    return poolAddresses.map(address => 
      this.poolInfoCache.get(address.toLowerCase()) || null
    );
  }
} 