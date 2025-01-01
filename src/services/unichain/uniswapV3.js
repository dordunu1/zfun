import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

// V3 Contract Addresses
export const UNISWAP_V3_ADDRESSES = {
  swapRouter: '0x6Dd37A29929B2e2A5B924F1aB9d8f5228b9dA03e',
  quoter: '0x6Dd37329A1A225a6Fca658265D460423DCafBF89',
  WETH: '0x4200000000000000000000000000000000000006'
};

// Fee tiers for V3
export const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
};

// ABIs
const SWAP_ROUTER_ABI = [{"inputs":[{"internalType":"address","name":"_factoryV2","type":"address"},{"internalType":"address","name":"factoryV3","type":"address"},{"internalType":"address","name":"_positionManager","type":"address"},{"internalType":"address","name":"_WETH9","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH9","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactInputParams","name":"params","type":"tuple"}],"name":"exactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IV3SwapRouter.ExactInputSingleParams","name":"params","type":"tuple"}],"name":"exactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IV3SwapRouter.ExactOutputSingleParams","name":"params","type":"tuple"}],"name":"exactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}];

const QUOTER_ABI = [
  'function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)',
  'function quoteExactOutputSingle(tuple(address tokenIn, address tokenOut, uint256 amount, uint24 fee, uint160 sqrtPriceLimitX96) params) external returns (uint256 amountIn, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)'
];

export async function getQuote(
  tokenIn,
  tokenOut,
  amountIn,
  feeTier,
  provider
) {
  try {
    const quoterContract = new ethers.Contract(
      UNISWAP_V3_ADDRESSES.quoter,
      QUOTER_ABI,
      provider
    );

    const params = {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      amountIn: ethers.parseUnits(amountIn.toString(), tokenIn.decimals),
      fee: feeTier,
      sqrtPriceLimitX96: 0n
    };

    const [amountOut] = await quoterContract.quoteExactInputSingle(params);
    return ethers.formatUnits(amountOut, tokenOut.decimals);
  } catch (error) {
    console.error('Quote error:', error);
    throw error;
  }
}

export async function executeSwap(
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin,
  feeTier,
  signer
) {
  try {
    const routerContract = new ethers.Contract(
      UNISWAP_V3_ADDRESSES.swapRouter,
      SWAP_ROUTER_ABI,
      signer
    );

    const params = {
      tokenIn: tokenIn.address,
      tokenOut: tokenOut.address,
      fee: feeTier,
      recipient: await signer.getAddress(),
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
      amountIn: ethers.utils.parseUnits(amountIn.toString(), tokenIn.decimals),
      amountOutMinimum: ethers.utils.parseUnits(amountOutMin.toString(), tokenOut.decimals),
      sqrtPriceLimitX96: 0
    };

    const tx = await routerContract.exactInputSingle(params);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Swap error:', error);
    throw error;
  }
} 