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

// Router ABI from Uniswap V2 specification
const ROUTER_ABI = [
  // Factory and WETH
  'function factory() external pure returns (address)',
  'function WETH() external pure returns (address)',

  // Add liquidity
  'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',

  // Remove liquidity
  'function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityWithPermit(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB)',
  'function removeLiquidityETHWithPermit(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH)',
  'function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountETH)',
  'function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountETH)',

  // Swap
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',

  // Supporting fee-on-transfer tokens
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',

  // Price functions
  'function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut)',
  'function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn)',
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts)'
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

  // Helper function to round amounts
  roundAmount(amount, decimals = 18) {
    try {
      // Convert to human readable with full decimals
      const fullAmount = ethers.formatUnits(amount, decimals);
      // Round to 4 decimal places maximum
      const roundedAmount = Number(fullAmount).toFixed(4);
      // Convert back to token units
      return ethers.parseUnits(roundedAmount, decimals);
    } catch (error) {
      console.error('Error rounding amount:', error);
      return amount;
    }
  }

  // Modify swap method
  async swap(fromToken, toToken, amountIn, amountOutMin, path, deadline) {
    try {
      if (!this.router) await this.init();
      
      const account = await this.signer.getAddress();
      const isFromETH = fromToken.symbol === 'ETH';
      const isToETH = toToken.symbol === 'ETH';
      
      if (!isFromETH) {
        await this.approveToken(fromToken.address, amountIn);
      }

      // Calculate slippage directly (2% in this case)
      const minOutWithSlippage = (BigInt(amountOutMin) * 98n) / 100n;

      console.log('\n=== Swap Details ===');
      console.log('From:', isFromETH ? 'ETH (will be wrapped to WETH)' : fromToken.symbol);
      console.log('To:', isToETH ? 'ETH (will receive from WETH)' : toToken.symbol);
      console.log('Path:', path.map((addr, i) => {
        if (addr.toLowerCase() === UNISWAP_ADDRESSES.WETH.toLowerCase()) {
          return i === 0 && isFromETH ? 'ETH→WETH' : 'WETH';
        }
        return addr;
      }).join(' → '));
      console.log('Amount In:', ethers.formatUnits(amountIn, fromToken.decimals), fromToken.symbol);
      console.log('Minimum Out:', ethers.formatUnits(minOutWithSlippage, toToken.decimals), toToken.symbol);
      console.log('==================\n');

      let tx;
      
      if (isFromETH) {
        console.log('Calling swapExactETHForTokens:');
        console.log('- Router will automatically wrap your ETH to WETH');
        console.log('- Then swap WETH for desired tokens');
        console.log('Transaction params:', {
          minOutWithSlippage: minOutWithSlippage.toString(),
          path,
          to: account,
          deadline: deadline.toString(),
          value: amountIn.toString()
        });

        tx = await this.router.swapExactETHForTokens(
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            value: amountIn,
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else if (isToETH) {
        console.log('Calling swapExactTokensForETH:');
        console.log('- First swap your tokens for WETH');
        console.log('- Router will automatically unwrap WETH to ETH');
        
        tx = await this.router.swapExactTokensForETH(
          amountIn,
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      } else {
        tx = await this.router.swapExactTokensForTokens(
          amountIn,
          minOutWithSlippage,
          path,
          account,
          deadline,
          {
            gasLimit: ethers.getBigInt(1000000)
          }
        );
      }

      console.log('\nSwap transaction sent:', tx.hash);
      console.log('Waiting for confirmation...\n');
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

  // Modify updateRoute method
  async updateRoute(fromToken, toToken, amount) {
    try {
      if (!this.router) await this.init();
      
      if (!fromToken || !toToken || !amount) {
        return {
          route: null,
          toAmount: '0'
        };
      }

      // Always use WETH in the path, even when the user specifies ETH
      const fromAddress = fromToken.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : fromToken.address;
      const toAddress = toToken.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : toToken.address;

      // Parse input amount - use 18 decimals for ETH
      const amountIn = ethers.parseUnits(
        amount, 
        fromToken.symbol === 'ETH' ? 18 : fromToken.decimals
      );
      console.log('Original amount in:', amountIn.toString());

      // Try routing through USDT first
      try {
        const pathThroughUSDT = [fromAddress, UNISWAP_ADDRESSES.USDT, toAddress];
        const hasFirstPair = await this.checkPoolExists(fromAddress, UNISWAP_ADDRESSES.USDT);
        const hasSecondPair = await this.checkPoolExists(UNISWAP_ADDRESSES.USDT, toAddress);
        
        console.log('USDT route pairs:', {
          'First pair (Token-USDT)': hasFirstPair,
          'Second pair (USDT-Token)': hasSecondPair
        });
        
        if (hasFirstPair && hasSecondPair) {
          const amounts = await this.router.getAmountsOut(amountIn, pathThroughUSDT);
          const toAmount = ethers.formatUnits(
            amounts[amounts.length - 1],
            toToken.symbol === 'ETH' ? 18 : toToken.decimals
          );
          
          console.log('USDT Route Amounts:', {
            input: ethers.formatUnits(amounts[0], fromToken.symbol === 'ETH' ? 18 : fromToken.decimals),
            usdtAmount: ethers.formatUnits(amounts[1], 6), // USDT has 6 decimals
            output: ethers.formatUnits(amounts[2], toToken.symbol === 'ETH' ? 18 : toToken.decimals),
            formatted: toAmount
          });

          return {
            route: `${fromToken.symbol} → USDT → ${toToken.symbol}`,
            toAmount,
            path: pathThroughUSDT
          };
        }
      } catch (error) {
        console.log('USDT route failed:', error);
      }

      // Try direct path as fallback
      try {
        const directPath = [fromAddress, toAddress];
        const hasDirectPair = await this.checkPoolExists(fromAddress, toAddress);
        
        console.log('Direct pair exists:', hasDirectPair);
        
        if (hasDirectPair) {
          const amounts = await this.router.getAmountsOut(amountIn, directPath);
          const toAmount = ethers.formatUnits(
            amounts[amounts.length - 1],
            toToken.symbol === 'ETH' ? 18 : toToken.decimals
          );

          console.log('Direct Route Amounts:', {
            input: ethers.formatUnits(amounts[0], fromToken.symbol === 'ETH' ? 18 : fromToken.decimals),
            output: ethers.formatUnits(amounts[1], toToken.symbol === 'ETH' ? 18 : toToken.decimals),
            formatted: toAmount
          });

          return {
            route: `${fromToken.symbol} → ${toToken.symbol}`,
            toAmount,
            path: directPath
          };
        }
      } catch (error) {
        console.log('Direct route failed:', error);
      }

      return {
        route: null,
        toAmount: '0',
        error: 'No valid route found'
      };
    } catch (error) {
      console.error('Error in updateRoute:', error);
      return {
        route: null,
        toAmount: '0',
        error: error.message
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