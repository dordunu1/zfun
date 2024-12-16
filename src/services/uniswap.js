import { ethers } from 'ethers';
import { createPublicClient, http, createWalletClient } from 'viem';

// Uniswap V2 Contract Addresses (Sepolia)
export const UNISWAP_ADDRESSES = {
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  // Common tokens on Sepolia
  WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  USDT: '0x6175a8471C2122f4b447D0f567dE3A73d7c7502c'
};

// Uniswap V2 ABIs
const FACTORY_ABI = [
  'function createPair(address tokenA, address tokenB) external returns (address pair)',
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
  'function allPairs(uint) external view returns (address pair)',
  'function allPairsLength() external view returns (uint)',
  'function feeTo() external view returns (address)',
  'function feeToSetter() external view returns (address)',
];

const ROUTER_ABI = [
  // Swapping
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
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

  // Pool Creation
  async createPool(token0Address, token1Address) {
    try {
      const { request } = await this.publicClient.simulateContract({
        ...this.factory,
        functionName: 'createPair',
        args: [token0Address, token1Address]
      });

      const hash = await this.walletClient.writeContract(request);
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error creating pool:', error);
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
      // Approve router to spend token
      const tokenContract = {
        address: path[0],
        abi: ERC20_ABI
      };

      const { request: approveRequest } = await this.publicClient.simulateContract({
        ...tokenContract,
        functionName: 'approve',
        args: [UNISWAP_ADDRESSES.router, amountIn]
      });

      await this.walletClient.writeContract(approveRequest);

      // Execute swap
      const { request } = await this.publicClient.simulateContract({
        ...this.router,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, path, to, deadline]
      });

      const hash = await this.walletClient.writeContract(request);
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
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
      // Approve router to spend both tokens
      const tokenAContract = {
        address: tokenA,
        abi: ERC20_ABI
      };
      
      const tokenBContract = {
        address: tokenB,
        abi: ERC20_ABI
      };

      const { request: approveARequest } = await this.publicClient.simulateContract({
        ...tokenAContract,
        functionName: 'approve',
        args: [UNISWAP_ADDRESSES.router, amountADesired]
      });

      const { request: approveBRequest } = await this.publicClient.simulateContract({
        ...tokenBContract,
        functionName: 'approve',
        args: [UNISWAP_ADDRESSES.router, amountBDesired]
      });

      await this.walletClient.writeContract(approveARequest);
      await this.walletClient.writeContract(approveBRequest);

      // Add liquidity
      const { request } = await this.publicClient.simulateContract({
        ...this.router,
        functionName: 'addLiquidity',
        args: [tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline]
      });

      const hash = await this.walletClient.writeContract(request);
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error adding liquidity:', error);
      throw error;
    }
  }

  // Get Pool Information
  async getPoolInfo(tokenA, tokenB) {
    try {
      const pairAddress = await this.publicClient.readContract({
        ...this.factory,
        functionName: 'getPair',
        args: [tokenA, tokenB]
      });

      if (pairAddress === '0x0000000000000000000000000000000000000000') {
        return null;
      }

      const pair = {
        address: pairAddress,
        abi: PAIR_ABI
      };

      const [token0, token1, reserves] = await Promise.all([
        this.publicClient.readContract({
          ...pair,
          functionName: 'token0'
        }),
        this.publicClient.readContract({
          ...pair,
          functionName: 'token1'
        }),
        this.publicClient.readContract({
          ...pair,
          functionName: 'getReserves'
        })
      ]);

      return {
        pairAddress,
        token0,
        token1,
        reserve0: reserves[0],
        reserve1: reserves[1],
      };
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  // Quote
  async getAmountOut(amountIn, path) {
    try {
      const amounts = await this.publicClient.readContract({
        ...this.router,
        functionName: 'getAmountsOut',
        args: [amountIn, path]
      });
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
        symbol: 'USDT',
        name: 'Tether USD',
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
} 