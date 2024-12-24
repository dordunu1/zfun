import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

// Uniswap V2 Contract Addresses (Unichain)
export const UNISWAP_ADDRESSES = {
  router: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
  WETH: '0x4200000000000000000000000000000000000006',
  USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844',
};

// ERC20 ABI for token interactions
const ERC20_ABI = [
  'function approve(address spender, uint value) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint)',
  'function balanceOf(address owner) external view returns (uint)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
];

// Router ABI from verified contract
const ROUTER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_WETH",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "WETH",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountADesired",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBDesired",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "addLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenDesired",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "addLiquidityETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveOut",
        "type": "uint256"
      }
    ],
    "name": "getAmountIn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveOut",
        "type": "uint256"
      }
    ],
    "name": "getAmountOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      }
    ],
    "name": "getAmountsIn",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      }
    ],
    "name": "getAmountsOut",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reserveB",
        "type": "uint256"
      }
    ],
    "name": "quote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidityETH",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "removeLiquidityETHWithPermit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountTokenMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountETHMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountETH",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "approveMax",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "removeLiquidityWithPermit",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapETHForExactTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForETH",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForExactETH",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountInMax",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapTokensForExactTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Add factory ABI after ROUTER_ABI
const FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address)',
  'function createPair(address tokenA, address tokenB) external returns (address)',
  'function allPairs(uint) external view returns (address)',
  'function allPairsLength() external view returns (uint)',
  'function feeTo() external view returns (address)',
  'function feeToSetter() external view returns (address)'
];

// Add PAIR_ABI constant after FACTORY_ABI
const PAIR_ABI = [
  'function token0() external view returns (address)',
  'function token1() external view returns (address)',
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
];

export class UnichainUniswapService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.router = null;
  }

  async init() {
    if (!window.ethereum) {
      throw new Error('No Web3 provider found');
    }
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    
    // Create router contract with full ABI
    this.router = new ethers.Contract(
      UNISWAP_ADDRESSES.router,
      ROUTER_ABI,
      this.signer
    );
  }

  // Helper function to approve tokens
  async approveToken(tokenAddress, amount) {
    try {
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      const account = await this.signer.getAddress();
      const allowance = await token.allowance(account, UNISWAP_ADDRESSES.router);
      
      if (allowance < amount) {
        console.log('Approving token:', tokenAddress);
        const tx = await token.approve(UNISWAP_ADDRESSES.router, ethers.MaxUint256);
        const receipt = await tx.wait();
        console.log('Token approved, receipt:', receipt);
      } else {
        console.log('Token already approved:', tokenAddress);
      }
    } catch (error) {
      console.error('Error in approveToken:', error);
      throw error;
    }
  }

  // Get token information
  async getTokenInfo(tokenAddress) {
    try {
      // Use Unichain RPC provider
      const provider = new ethers.JsonRpcProvider('https://sepolia.unichain.org');
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      
      const [symbol, name, decimals] = await Promise.all([
        token.symbol().catch(() => 'Unknown'),
        token.name().catch(() => 'Unknown Token'),
        token.decimals().catch(() => 18)
      ]);
      
      return { symbol, name, decimals };
    } catch (error) {
      console.error('Error in getTokenInfo:', error);
      return {
        symbol: 'Unknown',
        name: 'Unknown Token',
        decimals: 18
      };
    }
  }

  // Calculate initial pool price
  calculateInitialPoolPrice(amount0, amount1, decimals0, decimals1) {
    try {
      // Convert BigInt amounts to decimal representation using ethers.formatUnits
      const amount0Decimal = Number(ethers.formatUnits(amount0, decimals0));
      const amount1Decimal = Number(ethers.formatUnits(amount1, decimals1));

      // Calculate price ratios
      const token0Price = amount1Decimal / amount0Decimal;
      const token1Price = amount0Decimal / amount1Decimal;

      return { 
        token0Price: token0Price.toFixed(6),
        token1Price: token1Price.toFixed(6)
      };
    } catch (error) {
      console.error('Error calculating initial pool price:', error);
      return {
        token0Price: '0',
        token1Price: '0'
      };
    }
  }

  // Modify createPool function
  async createPool(token0Address, token1Address, amount0, amount1) {
    try {
      if (!this.router) await this.init();

      console.log('Router address:', UNISWAP_ADDRESSES.router);
      
      const account = await this.signer.getAddress();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      // Check if one of the tokens is ETH/WETH
      const isToken0WETH = token0Address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();
      const isToken1WETH = token1Address.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase();
      const isETHPair = isToken0WETH || isToken1WETH;

      // Get factory address from router
      const factoryAddress = await this.router.factory();
      console.log('\nContract Addresses:');
      console.log('==================');
      console.log('Router:', UNISWAP_ADDRESSES.router);
      console.log('Factory:', factoryAddress);
      console.log('Token0:', token0Address);
      console.log('Token1:', token1Address);
      console.log('==================\n');

      // Create factory contract instance
      const factory = new ethers.Contract(
        factoryAddress,
        FACTORY_ABI,
        this.signer
      );

      // Check if pair exists
      const existingPair = await factory.getPair(token0Address, token1Address);
      console.log('Checking pair status:');
      console.log('==================');
      console.log('Existing pair address:', existingPair);
      const isNewPair = existingPair === '0x0000000000000000000000000000000000000000';
      console.log('Is new pair needed:', isNewPair);
      console.log('==================\n');

      if (isETHPair) {
        // For ETH pairs, we need to handle the token order correctly
        const tokenAddress = isToken0WETH ? token1Address : token0Address;
        const ethAmount = isToken0WETH ? amount0 : amount1;
        const tokenAmount = isToken0WETH ? amount1 : amount0;

        // Create pair first if it doesn't exist
        if (isNewPair) {
          console.log('Creating new ETH pair...');
          const createPairTx = await factory.createPair(UNISWAP_ADDRESSES.WETH, tokenAddress);
          await createPairTx.wait();
          console.log('ETH pair created');
        }

        // Approve the token first (no need to approve ETH)
        await this.approveToken(tokenAddress, tokenAmount);

        // Calculate minimum amounts (e.g., 99% of desired amounts to allow for some slippage)
        const tokenAmountMin = (tokenAmount * 990n) / 1000n;
        const ethAmountMin = (ethAmount * 990n) / 1000n;

        console.log('Adding ETH liquidity with params:', {
          tokenAddress,
          tokenAmount: tokenAmount.toString(),
          ethAmount: ethAmount.toString(),
          tokenAmountMin: tokenAmountMin.toString(),
          ethAmountMin: ethAmountMin.toString(),
          account,
          deadline
        });

        // Call addLiquidityETH
        const tx = await this.router.addLiquidityETH(
          tokenAddress,
          tokenAmount,
          tokenAmountMin,
          ethAmountMin,
          account,
          deadline,
          {
            value: ethAmount,
            gasLimit: ethers.getBigInt(1000000)
          }
        );

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        return {
          receipt,
          priceInfo: {
            token0Price: (Number(ethAmount) / Number(tokenAmount)).toFixed(6),
            token1Price: (Number(tokenAmount) / Number(ethAmount)).toFixed(6)
          }
        };
      } else {
        // Handle regular token-token pair (existing code)
        let finalAmount0Big = BigInt(amount0);
        let finalAmount1Big = BigInt(amount1);

        // If pair exists, we need to check the current ratio
        if (!isNewPair) {
          console.log('Pair exists, checking current pool ratio...');
          const pairContract = new ethers.Contract(existingPair, PAIR_ABI, this.provider);
          const [reserve0, reserve1] = await pairContract.getReserves();
          console.log('Current reserves:', { reserve0: reserve0.toString(), reserve1: reserve1.toString() });

          // Get actual token order in the pair
          const token0InPair = await pairContract.token0();
          
          // Adjust amounts if token order is different
          if (token0Address.toLowerCase() !== token0InPair.toLowerCase()) {
            console.log('Token order swapped to match pair');
            [finalAmount0Big, finalAmount1Big] = [finalAmount1Big, finalAmount0Big];
            [token0Address, token1Address] = [token1Address, token0Address];
          }

          // Calculate the optimal ratio based on reserves
          if (reserve0 > 0n && reserve1 > 0n) {
            try {
              // Use the router's quote function to get the exact amount needed
              const quote = await this.router.quote(
                finalAmount0Big,
                reserve0,
                reserve1
              );
              
              // Update amount1 based on the quote
              finalAmount1Big = quote;
              
              console.log('Amounts after quote calculation:', {
                amount0: finalAmount0Big.toString(),
                amount1: finalAmount1Big.toString()
              });
            } catch (error) {
              console.error('Error getting quote:', error);
              throw new Error('Failed to calculate optimal amounts for the pool ratio');
            }
          }
        } else {
          console.log('Creating new pair...');
          const createPairTx = await factory.createPair(token0Address, token1Address);
          await createPairTx.wait();
          console.log('Pair created');
        }

        // Get token decimals for price calculation
        const [token0Contract, token1Contract] = await Promise.all([
          new ethers.Contract(token0Address, ERC20_ABI, this.provider),
          new ethers.Contract(token1Address, ERC20_ABI, this.provider)
        ]);

        const [decimals0, decimals1] = await Promise.all([
          token0Contract.decimals(),
          token1Contract.decimals()
        ]);

        console.log('Token decimals:', { decimals0, decimals1 });

        console.log('Final amounts:', {
          amount0: finalAmount0Big.toString(),
          amount1: finalAmount1Big.toString()
        });

        // Calculate and log initial price
        const priceInfo = this.calculateInitialPoolPrice(finalAmount0Big, finalAmount1Big, decimals0, decimals1);
        console.log('Pool prices:', priceInfo);

        // Approve both tokens first
        await Promise.all([
          this.approveToken(token0Address, finalAmount0Big),
          this.approveToken(token1Address, finalAmount1Big)
        ]);

        // Calculate minimum amounts (e.g., 99% of desired amounts to allow for some slippage)
        const amountAMin = (finalAmount0Big * 990n) / 1000n;
        const amountBMin = (finalAmount1Big * 990n) / 1000n;

        console.log('Adding liquidity with params:', {
          token0Address,
          token1Address,
          amount0: finalAmount0Big.toString(),
          amount1: finalAmount1Big.toString(),
          amountAMin: amountAMin.toString(),
          amountBMin: amountBMin.toString(),
          account,
          deadline
        });

        // Call addLiquidity with higher gas limit for safety
        const tx = await this.router.addLiquidity(
          token0Address,
          token1Address,
          finalAmount0Big,
          finalAmount1Big,
          amountAMin,
          amountBMin,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        return {
          receipt,
          priceInfo
        };
      }
    } catch (error) {
      console.error('Error in createPool:', error);
      throw error;
    }
  }

  // Add ETH liquidity
  async addLiquidityETH(tokenAddress, amountToken, amountETH) {
    try {
      if (!this.router) await this.init();

      const account = await this.signer.getAddress();
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

      // Approve token
      await this.approveToken(tokenAddress, amountToken);

      const tx = await this.router.addLiquidityETH(
        tokenAddress,
        amountToken,
        0, // amountTokenMin (allow for some slippage)
        0, // amountETHMin (allow for some slippage)
        account,
        deadline,
        {
          value: amountETH,
          gasLimit: 500000,
          type: 0 // Use legacy transaction type
        }
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      return receipt;
    } catch (error) {
      console.error('Error in addLiquidityETH:', error);
      throw error;
    }
  }

  // Add checkPoolExists method
  async checkPoolExists(tokenA, tokenB) {
    try {
      if (!this.router) await this.init();
      
      // Get factory address from router
      const factoryAddress = await this.router.factory();
      
      // Create factory contract instance
      const factory = new ethers.Contract(
        factoryAddress,
        FACTORY_ABI,
        this.provider
      );

      const pairAddress = await factory.getPair(tokenA, tokenB);
      return pairAddress !== '0x0000000000000000000000000000000000000000';
    } catch (error) {
      console.error('Error checking pool existence:', error);
      throw error;
    }
  }

  // Modify swap method
  async swap(fromToken, toToken, amountIn, amountOutMin, path, deadline) {
    try {
      if (!this.router) await this.init();
      
      const account = await this.signer.getAddress();
      
      // Check if either token is ETH
      const isFromETH = fromToken.symbol === 'ETH';
      const isToETH = toToken.symbol === 'ETH';
      
      // If from token is not ETH, approve it first
      if (!isFromETH) {
        await this.approveToken(fromToken.address, amountIn);
      }

      let tx;
      
      if (isFromETH) {
        // ETH to Token(s)
        console.log('Swapping ETH for Tokens with params:', {
          amountIn: amountIn.toString(),
          amountOutMin: amountOutMin.toString(),
          path,
          to: account,
          deadline: deadline.toString()
        });

        // For ETH -> Token swaps
        const overrides = {
          value: amountIn,  // amount of ETH to send
          gasLimit: ethers.getBigInt(1000000),  // Increased gas limit
          type: 0  // Legacy transaction type
        };

        console.log('Transaction overrides:', overrides);

        tx = await this.router.swapExactETHForTokens(
          amountOutMin,  // minimum amount of tokens to receive
          path,          // path of the swap
          account,       // recipient address
          deadline,      // deadline timestamp
          overrides
        );

        console.log('Swap transaction sent:', tx.hash);
        return tx;
      } else if (isToETH) {
        // Token(s) to ETH
        tx = await this.router.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000),
            type: 0  // Legacy transaction type
          }
        );
      } else {
        // Token to Token(s)
        tx = await this.router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000),
            type: 0  // Legacy transaction type
          }
        );
      }

      console.log('Swap transaction sent:', tx.hash);
      return tx;
    } catch (error) {
      console.error('Error in swap:', error);
      if (error.data) {
        console.error('Transaction error data:', error.data);
      }
      throw error;
    }
  }

  // Add getAmountOut method
  async getAmountOut(amountIn, path) {
    try {
      if (!this.router) await this.init();
      
      if (!amountIn || !path || path.length < 2) {
        return '0';
      }

      const amounts = await this.router.getAmountsOut(amountIn, path);
      return amounts[amounts.length - 1];
    } catch (error) {
      console.error('Error in getAmountOut:', error);
      return '0';
    }
  }

  // Add updateRoute method
  async updateRoute(fromToken, toToken, amount) {
    try {
      if (!this.router) await this.init();
      
      if (!fromToken || !toToken || !amount) {
        return {
          route: null,
          toAmount: '0'
        };
      }

      const fromAddress = fromToken.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : fromToken.address;
      const toAddress = toToken.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : toToken.address;

      console.log('Route check:', {
        fromSymbol: fromToken.symbol,
        toSymbol: toToken.symbol,
        fromAddress,
        toAddress,
        amount
      });

      // Parse input amount
      const amountIn = ethers.parseUnits(amount, fromToken.decimals);
      console.log('Amount in:', amountIn.toString());

      // Try direct path first
      let bestPath = [fromAddress, toAddress];
      let bestAmountOut = 0n;

      const hasDirectPair = await this.checkPoolExists(fromAddress, toAddress);
      console.log('Direct pair exists:', hasDirectPair);

      if (hasDirectPair) {
        try {
          // Get the pair contract to check reserves
          const factoryAddress = await this.router.factory();
          const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, this.provider);
          const pairAddress = await factory.getPair(fromAddress, toAddress);
          const pair = new ethers.Contract(pairAddress, PAIR_ABI, this.provider);
          const [reserve0, reserve1] = await pair.getReserves();
          const token0 = await pair.token0();
          
          // Check if reserves are sufficient
          const fromTokenIsToken0 = fromAddress.toLowerCase() === token0.toLowerCase();
          const fromReserve = fromTokenIsToken0 ? reserve0 : reserve1;
          
          if (fromReserve >= amountIn) {
            bestAmountOut = await this.router.getAmountsOut(amountIn, bestPath);
            bestAmountOut = bestAmountOut[bestAmountOut.length - 1];
            console.log('Direct route amount:', bestAmountOut.toString());
          } else {
            console.log('Insufficient liquidity in direct pair');
          }
        } catch (error) {
          console.log('Direct route failed:', error);
        }
      }

      // Try routing through USDT
      try {
        const pathThroughUSDT = [
          fromAddress,
          UNISWAP_ADDRESSES.USDT,
          toAddress
        ];

        console.log('Checking USDT route:', pathThroughUSDT);

        // Check if both pairs exist and have sufficient liquidity
        const hasFirstPair = await this.checkPoolExists(fromAddress, UNISWAP_ADDRESSES.USDT);
        const hasSecondPair = await this.checkPoolExists(UNISWAP_ADDRESSES.USDT, toAddress);
        
        console.log('USDT route pairs:', {
          firstPair: hasFirstPair,
          secondPair: hasSecondPair
        });

        if (hasFirstPair && hasSecondPair) {
          // Get factory and check liquidity in both pairs
          const factoryAddress = await this.router.factory();
          const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, this.provider);
          
          // Check first pair liquidity
          const firstPairAddress = await factory.getPair(fromAddress, UNISWAP_ADDRESSES.USDT);
          const firstPair = new ethers.Contract(firstPairAddress, PAIR_ABI, this.provider);
          const [reserve0First, reserve1First] = await firstPair.getReserves();
          const token0First = await firstPair.token0();
          const fromTokenIsToken0First = fromAddress.toLowerCase() === token0First.toLowerCase();
          const fromReserveFirst = fromTokenIsToken0First ? reserve0First : reserve1First;
          
          console.log('First pair reserves:', {
            reserve0: reserve0First.toString(),
            reserve1: reserve1First.toString(),
            fromReserve: fromReserveFirst.toString(),
            amountIn: amountIn.toString()
          });
          
          if (fromReserveFirst >= amountIn) {
            const amountThroughUSDT = await this.router.getAmountsOut(amountIn, pathThroughUSDT);
            const finalAmount = amountThroughUSDT[amountThroughUSDT.length - 1];
            console.log('USDT route amount:', finalAmount.toString());

            if (finalAmount > bestAmountOut) {
              bestPath = pathThroughUSDT;
              bestAmountOut = finalAmount;
            }
          } else {
            console.log('Insufficient liquidity in first pair of USDT route');
          }
        }
      } catch (error) {
        console.log('USDT route failed:', error);
      }

      // If no valid route found
      if (bestAmountOut === 0n) {
        console.log('No valid route found');
        return {
          route: null,
          toAmount: '0'
        };
      }

      // Format the route display
      const routeSymbols = bestPath.map(address => {
        if (address === UNISWAP_ADDRESSES.WETH) return 'ETH';
        if (address === UNISWAP_ADDRESSES.USDT) return 'USDT';
        if (address === toAddress) return toToken.symbol;
        return fromToken.symbol;
      });

      const route = routeSymbols.join(' → ');
      const toAmount = ethers.formatUnits(bestAmountOut, toToken.decimals);

      console.log('Final route:', {
        route,
        toAmount,
        path: bestPath
      });

      return {
        route,
        toAmount,
        path: bestPath
      };
    } catch (error) {
      console.error('Error in updateRoute:', error);
      return {
        route: null,
        toAmount: '0',
        path: []
      };
    }
  }

  // Add getTokenBalance method
  async getTokenBalance(tokenAddress, userAddress) {
    try {
      if (!this.provider) await this.init();
      
      // For ETH balance
      if (tokenAddress === 'ETH') {
        const balance = await this.provider.getBalance(userAddress);
        return ethers.formatEther(balance);
      }

      // For ERC20 tokens
      const token = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await token.balanceOf(userAddress);
      const decimals = await token.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }
} 