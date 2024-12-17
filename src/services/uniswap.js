import { ethers } from 'ethers';
import { createPublicClient, http, createWalletClient } from 'viem';

// Uniswap V2 Contract Addresses (Sepolia)
export const UNISWAP_ADDRESSES = {
  factory: '0xF62c03E08ada871A0bEb309762E260a7a6a880E6',
  router: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
  // Common tokens on Sepolia
  WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  USDT: '0x148b1aB3e2321d79027C4b71B6118e70434B4784' // TestUSDT address
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

  // Optimized pool creation and liquidity addition
  async createPoolAndAddLiquidity(
    token0Address,
    token1Address,
    amount0Desired,
    amount1Desired,
    account,
    slippageTolerance = 0.05 // 5% default slippage tolerance
  ) {
    try {
      // Sort token addresses (required by Uniswap)
      const [token0, token1] = token0Address.toLowerCase() < token1Address.toLowerCase()
        ? [token0Address, token1Address]
        : [token1Address, token0Address];

      const [amount0, amount1] = token0Address.toLowerCase() < token1Address.toLowerCase()
        ? [amount0Desired, amount1Desired]
        : [amount1Desired, amount0Desired];

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instances
      const factory = new ethers.Contract(UNISWAP_ADDRESSES.factory, FACTORY_ABI, signer);
      const router = new ethers.Contract(UNISWAP_ADDRESSES.router, ROUTER_ABI, signer);
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, signer);
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, signer);

      // Check if pair exists
      const existingPair = await factory.getPair(token0, token1);
      if (existingPair !== '0x0000000000000000000000000000000000000000') {
        throw new Error('Pool already exists');
      }

      console.log('Creating pool and adding liquidity...');

      // Approve both tokens in parallel
      const [approve0Tx, approve1Tx] = await Promise.all([
        token0Contract.approve(UNISWAP_ADDRESSES.router, amount0),
        token1Contract.approve(UNISWAP_ADDRESSES.router, amount1)
      ]);

      // Wait for approvals in parallel
      await Promise.all([
        approve0Tx.wait(),
        approve1Tx.wait()
      ]);

      // Create pair
      const createPairTx = await factory.createPair(token0, token1, { gasLimit: 3000000 });
      const createPairReceipt = await createPairTx.wait();

      // Get pair address from event
      const pairCreatedEvent = createPairReceipt.logs.find(log => {
        const topics = log.topics || [];
        return topics[0] === ethers.id('PairCreated(address,address,address,uint256)');
      });

      if (!pairCreatedEvent) {
        throw new Error('Failed to get pair address from transaction receipt');
      }

      const decodedData = factory.interface.parseLog({
        topics: pairCreatedEvent.topics,
        data: pairCreatedEvent.data
      });

      const pairAddress = decodedData.args[2];
      console.log('Created pair address:', pairAddress);

      // Calculate minimum amounts with slippage tolerance
      const amount0Min = amount0 * BigInt(Math.floor((1 - slippageTolerance) * 10000)) / BigInt(10000);
      const amount1Min = amount1 * BigInt(Math.floor((1 - slippageTolerance) * 10000)) / BigInt(10000);

      // Add initial liquidity
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20); // 20 minutes
      const addLiquidityTx = await router.addLiquidity(
        token0,
        token1,
        amount0,
        amount1,
        amount0Min,
        amount1Min,
        account,
        deadline,
        { gasLimit: 3000000 }
      );

      const addLiquidityReceipt = await addLiquidityTx.wait();

      return {
        pairAddress,
        createPairReceipt,
        addLiquidityReceipt
      };
    } catch (error) {
      console.error('Error in pool creation and liquidity addition:', error);
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
    deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now
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

      const tokenAContract = new ethers.Contract(
        tokenA,
        ERC20_ABI,
        signer
      );

      const tokenBContract = new ethers.Contract(
        tokenB,
        ERC20_ABI,
        signer
      );

      console.log('Approving tokens for liquidity addition...');
      
      // Approve router to spend both tokens
      const approveATx = await tokenAContract.approve(UNISWAP_ADDRESSES.router, amountADesired);
      await approveATx.wait();
      console.log('Token A approved');

      const approveBTx = await tokenBContract.approve(UNISWAP_ADDRESSES.router, amountBDesired);
      await approveBTx.wait();
      console.log('Token B approved');

      console.log('Adding liquidity with params:', {
        tokenA,
        tokenB,
        amountADesired: amountADesired.toString(),
        amountBDesired: amountBDesired.toString(),
        amountAMin: amountAMin.toString(),
        amountBMin: amountBMin.toString(),
        to,
        deadline: deadline.toString()
      });

      // Add liquidity
      const tx = await router.addLiquidity(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
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
    // Special handling for known tokens
    if (tokenAddress === UNISWAP_ADDRESSES.USDT) {
      return {
        symbol: 'tUSDT',
        name: 'Test USDT',
        decimals: 6
      };
    }

    try {
      const tokenContract = {
        address: tokenAddress,
        abi: [
          'function symbol() external view returns (string)',
          'function name() external view returns (string)',
          'function decimals() external view returns (uint8)'
        ]
      };

      const [symbol, name, decimals] = await Promise.all([
        this.publicClient.readContract({
          ...tokenContract,
          functionName: 'symbol'
        }).catch(() => 'UNKNOWN'),
        this.publicClient.readContract({
          ...tokenContract,
          functionName: 'name'
        }).catch(() => 'Unknown Token'),
        this.publicClient.readContract({
          ...tokenContract,
          functionName: 'decimals'
        }).catch(() => 18)
      ]);

      return { symbol, name, decimals };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  // Get Pool Information by Pair Address
  async getPoolInfoByAddress(pairAddress) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const pair = new ethers.Contract(pairAddress, PAIR_ABI, provider);

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
      console.error('Error getting pool info by address:', error);
      throw error;
    }
  }

  // Add new method for ETH to Token swaps
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
} 