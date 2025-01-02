import React, { useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BiWallet } from 'react-icons/bi';
import { FaExchangeAlt, FaStar } from 'react-icons/fa';
import { useWeb3Modal } from '@web3modal/react';
import { useUnichain } from '../../../../hooks/useUnichain';
import TokenSelector from '../shared/TokenSelector';
import { getTokenLogo } from '../../../../utils/tokens';
import { Dialog, Transition } from '@headlessui/react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Uniswap V3 Contract Addresses for Unichain
const UNISWAP_V3_ADDRESSES = {
  swapRouter: '0xd1AAE39293221B77B0C71fBD6dCb7Ea29Bb5B166',
  quoter: '0x6Dd37329A1A225a6Fca658265D460423DCafBF89',
  WETH: '0x4200000000000000000000000000000000000006',
  USDT: '0x70262e266E50603AcFc5D58997eF73e5a8775844'
};

// Add ERC20 ABI after UNISWAP_V3_ADDRESSES
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
  'function name() external view returns (string)'
];

// Add Quoter ABI
const QUOTER_ABI = [
  'function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut, uint160[] sqrtPriceX96AfterList, uint32[] initializedTicksCrossedList, uint256 gasEstimate)',
  'function quoteExactInputSingle(tuple(address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)'
];

// Add Swap Router ABI
const SWAP_ROUTER_ABI = [
  'function exactInput(tuple(bytes path, address recipient, uint256 amountIn, uint256 amountOutMinimum) params) external payable returns (uint256 amountOut)',
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)',
  'function exactOutput(tuple(bytes path, address recipient, uint256 amountOut, uint256 amountInMaximum) params) external payable returns (uint256 amountIn)',
  'function exactOutputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountIn)',
  'function multicall(bytes[] data) external payable returns (bytes[] results)',
  'function wrapETH(uint256 value) external payable',
  'function unwrapWETH9(uint256 amountMinimum, address recipient) external payable',
  'function WETH9() external view returns (address)',
  'function refundETH() external payable',
  'function selfPermit(address token, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external payable',
  'function sweepToken(address token, uint256 amountMinimum, address recipient) external payable'
];

// Add Tooltip component
const Tooltip = ({ children, content }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};

// Add these modern DeFi-inspired icons for swap steps
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path className="animate-[spin_1s_linear_infinite]" 
          d="M12 6v1M12 17v1M7.05 7.05l.707.707M16.243 16.243l.707.707M6 12h1M17 12h1M7.757 16.243l-.707.707M16.95 7.05l-.707.707">
        </path>
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
          strokeOpacity="0.2" 
        />
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" 
          strokeLinecap="round" 
          className="origin-center animate-[spin_1.5s_linear_infinite]" 
        />
      </g>
    </svg>
  ),
  Approval: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path className="animate-[draw_1s_ease-in-out]" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} stroke="currentColor"
        d="M7 11l3 3L19 5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeDasharray="60"
        strokeDashoffset="60">
        <animate
          attributeName="stroke-dashoffset"
          from="60"
          to="0"
          dur="0.6s"
          fill="freeze"
        />
      </path>
    </svg>
  ),
  Swapping: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        {/* Background circle */}
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
          strokeOpacity="0.2" 
        />
        
        {/* Top arrow */}
        <path 
          className="origin-center animate-[slideRight_1.5s_ease-in-out_infinite]"
          strokeLinecap="round" 
          strokeLinejoin="round"
          d="M6 9h8l-2.5-2.5M6 9l2.5 2.5M6 9"
        >
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Bottom arrow */}
        <path 
          className="origin-center animate-[slideLeft_1.5s_ease-in-out_infinite]"
          strokeLinecap="round" 
          strokeLinejoin="round"
          d="M18 15h-8l2.5-2.5M18 15l-2.5 2.5M18 15"
        >
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>

        {/* Animated dots */}
        <circle cx="18" cy="9" r="0.5" className="animate-[fadeInOut_1.5s_ease-in-out_infinite]">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="6" cy="15" r="0.5" className="animate-[fadeInOut_1.5s_ease-in-out_infinite_0.75s]">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  ),
  Confirming: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path strokeLinecap="round" className="origin-center animate-[spin_2s_linear_infinite]"
          d="M12 6v6l4 4" />
      </g>
    </svg>
  ),
  Completed: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g>
        <path className="animate-[draw_0.6s_ease-in-out]" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} stroke="currentColor"
          d="M7 13l3 3L17 8" strokeDasharray="60" strokeDashoffset="60">
          <animate
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="0.6s"
            fill="freeze"
          />
        </path>
        <path fill="currentColor" fillOpacity="0.2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      </g>
    </svg>
  ),
  Error: () => (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// Add modern icons for wrapping/unwrapping
const WrapIcons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path className="animate-[spin_1s_linear_infinite]" 
          d="M12 6v1M12 17v1M7.05 7.05l.707.707M16.243 16.243l.707.707M6 12h1M17 12h1M7.757 16.243l-.707.707M16.95 7.05l-.707.707">
        </path>
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" 
          strokeOpacity="0.2" 
        />
        <path 
          d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2" 
          strokeLinecap="round" 
          className="origin-center animate-[spin_1.5s_linear_infinite]" 
        />
      </g>
    </svg>
  ),
  Wrapping: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        {/* Box */}
        <path className="animate-[draw_1s_ease-in-out]" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          d="M12 3l7 4v10l-7 4-7-4V7l7-4z"
          strokeDasharray="60"
          strokeDashoffset="60"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="60"
            to="0"
            dur="1s"
            fill="freeze"
          />
        </path>
        {/* Animated ribbon */}
        <path 
          className="origin-center animate-[spin_3s_linear_infinite]"
          strokeLinecap="round"
          d="M12 3v18M5 7l14 8M19 7l-14 8"
          strokeDasharray="4 4"
        />
        {/* Animated dots */}
        <circle cx="12" cy="12" r="1" className="animate-[pulse_2s_ease-in-out_infinite]">
          <animate
            attributeName="r"
            values="0;1;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  ),
  Unwrapping: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        {/* Box opening animation */}
        <path 
          className="origin-bottom animate-[openBox_1.5s_ease-in-out_infinite]"
          strokeLinecap="round" 
          strokeLinejoin="round"
          d="M12 3l7 4v10l-7 4-7-4V7l7-4z"
        >
          <animate
            attributeName="d"
            values="M12 3l7 4v10l-7 4-7-4V7l7-4z;M12 3l7 0v14l-7 4-7-4V3l7 0z"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
        {/* Animated particles */}
        <g className="animate-[float_2s_ease-in-out_infinite]">
          <circle cx="12" cy="12" r="0.5" />
          <circle cx="14" cy="10" r="0.5" />
          <circle cx="10" cy="10" r="0.5" />
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </g>
      </g>
    </svg>
  ),
  Confirming: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path strokeLinecap="round" className="origin-center animate-[spin_2s_linear_infinite]"
          d="M12 6v6l4 4" />
      </g>
    </svg>
  )
};

// V3-specific constants
const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
};

// Add balance display component
const TokenBalance = ({ token }) => {
  const { address: userAddress } = useAccount();
  const uniswap = useUnichain();
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !token || !uniswap) return;
      
      try {
        setIsLoading(true);
        const balance = await uniswap.getTokenBalance(
          token.symbol === 'ETH' ? 'ETH' : token.address,
          userAddress
        );
        setBalance(balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [token, userAddress, uniswap]);

  if (!token) return null;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Balance: {isLoading ? 'Loading...' : balance} {token.symbol}
    </div>
  );
};

// Helper function to encode path for V3 swaps
function encodePath(path, fees) {
  if (path.length !== fees.length + 1) {
    throw new Error('path/fee lengths do not match');
  }

  let encoded = '0x';
  for (let i = 0; i < fees.length; i++) {
    // Remove '0x' prefix and pad address to 32 bytes
    encoded += path[i].slice(2).padStart(40, '0');
    // Encode fee as uint24
    encoded += fees[i].toString(16).padStart(6, '0');
  }
  // Add final token address
  encoded += path[path.length - 1].slice(2).padStart(40, '0');
  return encoded;
}

// Add SwapProgressModal component
const SwapProgressModal = ({ isOpen, onClose, currentStep, tokenIn, tokenOut, error }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    { id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> },
    { id: 'swapping', title: 'Swapping', icon: <Icons.Swapping /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);

  // Format error message to be more user-friendly
  const formatErrorMessage = (error) => {
    if (error?.includes('user rejected')) {
      return 'Transaction was rejected. Please try again.';
    }
    if (error?.includes('insufficient')) {
      return 'Insufficient balance for swap.';
    }
    if (error?.includes('INSUFFICIENT_OUTPUT_AMOUNT')) {
      return 'Price impact too high, try a smaller amount.';
    }
    if (error?.includes('EXCESSIVE_INPUT_AMOUNT')) {
      return 'Insufficient liquidity for this trade.';
    }
    return error?.replace(/\{"action":"sendTransaction".*$/, '') || 'An error occurred';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  {isError ? 'Error Swapping Tokens' : 'Swapping Tokens'}
                  {!isError && tokenIn && tokenOut && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {tokenIn.symbol} → {tokenOut.symbol}
                    </div>
                  )}
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = !isError && steps.findIndex(s => s.id === currentStep) > index;
                    const isErrorStep = isError && currentStep === step.id;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive && !isErrorStep ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                          isCompleted ? 'text-[#00ffbd]' : 
                          isErrorStep ? 'bg-red-500/10 text-red-500' : 
                          'text-gray-400'
                        }`}
                      >
                        {step.icon}
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">{step.title}</span>
                          {isActive && !isError && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {step.id === 'preparing' && 'Preparing transaction...'}
                              {step.id === 'approval' && `Approving ${tokenIn?.symbol}`}
                              {step.id === 'swapping' && `Swapping ${tokenIn?.symbol} for ${tokenOut?.symbol}`}
                              {step.id === 'confirming' && 'Waiting for confirmation...'}
                              {step.id === 'completed' && `Successfully swapped ${tokenIn?.symbol} for ${tokenOut?.symbol}!`}
                            </p>
                          )}
                        </div>
                        {isCompleted && (
                          <svg className="w-5 h-5 text-[#00ffbd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isError && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <Icons.Error />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                        <p className="mt-1 text-sm text-red-400">
                          {formatErrorMessage(error)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'completed' && (
                  <div className="mt-6">
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 rounded-xl font-medium bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors text-black"
                    >
                      Close
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Update WrapProgressModal component
const WrapProgressModal = ({ isOpen, onClose, currentStep, fromToken, toToken, error }) => {
  const isWrapping = fromToken?.symbol === 'ETH';
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <WrapIcons.Preparing /> },
    { id: 'wrapping', title: isWrapping ? 'Wrapping ETH' : 'Unwrapping WETH', icon: isWrapping ? <WrapIcons.Wrapping /> : <WrapIcons.Unwrapping /> },
    { id: 'confirming', title: 'Confirming', icon: <WrapIcons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

  const isError = Boolean(error);

  // Format error message to be more user-friendly
  const formatErrorMessage = (error) => {
    if (error?.includes('user rejected')) {
      return 'Transaction was rejected. Please try again.';
    }
    if (error?.includes('insufficient')) {
      return `Insufficient ${isWrapping ? 'ETH' : 'WETH'} balance.`;
    }
    return error?.replace(/\{"action":"sendTransaction".*$/, '') || 'An error occurred';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  {isError ? 'Error Processing Transaction' : (isWrapping ? 'Wrapping ETH' : 'Unwrapping WETH')}
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = !isError && steps.findIndex(s => s.id === currentStep) > index;
                    const isErrorStep = isError && currentStep === step.id;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive && !isErrorStep ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 
                          isCompleted ? 'text-[#00ffbd]' : 
                          isErrorStep ? 'bg-red-500/10 text-red-500' : 
                          'text-gray-400'
                        }`}
                      >
                        {step.icon}
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">{step.title}</span>
                          {isActive && !isError && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {step.id === 'preparing' && 'Preparing transaction...'}
                              {step.id === 'wrapping' && (isWrapping 
                                ? 'Converting ETH to WETH...' 
                                : 'Converting WETH to ETH...')}
                              {step.id === 'confirming' && 'Waiting for confirmation...'}
                              {step.id === 'completed' && (isWrapping 
                                ? 'Successfully wrapped ETH to WETH!' 
                                : 'Successfully unwrapped WETH to ETH!')}
                            </p>
                          )}
                        </div>
                        {isCompleted && (
                          <svg className="w-5 h-5 text-[#00ffbd]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>

                {isError && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <Icons.Error />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-500">Error Details</h3>
                        <p className="mt-1 text-sm text-red-400">
                          {formatErrorMessage(error)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'completed' && (
                  <div className="mt-6">
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 rounded-xl font-medium bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors text-black"
                    >
                      Close
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function TokenSwap() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { open: openConnectModal } = useWeb3Modal();
  
  // Add shared provider ref
  const providerRef = useRef(null);
  const quoterContractRef = useRef(null);

  // Initialize shared provider
  useEffect(() => {
    if (window.ethereum) {
      providerRef.current = new ethers.BrowserProvider(window.ethereum);
      quoterContractRef.current = new ethers.Contract(
        UNISWAP_V3_ADDRESSES.quoter,
        QUOTER_ABI,
        providerRef.current
      );
    }
  }, []);

  // Token states
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [activeSide, setActiveSide] = useState('from');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [swapStep, setSwapStep] = useState(null);
  const [swapError, setSwapError] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [priceImpact, setPriceImpact] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [findingRoute, setFindingRoute] = useState(false);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add a cleanup ref
  const abortController = useRef(null);

  // Move getSmartRoute inside component
  const getSmartRoute = useCallback(async (fromTokenObj, toTokenObj, amountIn) => {
    if (!quoterContractRef.current) return null;

    // If direct route exists, use it
    const directPath = encodePath(
      [fromTokenObj.address, toTokenObj.address],
      [FEE_TIERS.MEDIUM]
    );

    try {
      const [directQuote] = await quoterContractRef.current.quoteExactInput(directPath, amountIn);
      return {
        path: [fromTokenObj.address, toTokenObj.address],
        fees: [FEE_TIERS.MEDIUM],
        quote: directQuote,
        isDirectRoute: true
      };
    } catch (error) {
      // If direct route fails and toToken is USDT, try routing through WETH
      if (toTokenObj.address.toLowerCase() === UNISWAP_V3_ADDRESSES.USDT.toLowerCase()) {
        try {
          // Get quote for token -> WETH
          const pathToWeth = encodePath(
            [fromTokenObj.address, UNISWAP_V3_ADDRESSES.WETH],
            [FEE_TIERS.MEDIUM]
          );
          const [wethQuote] = await quoterContractRef.current.quoteExactInput(pathToWeth, amountIn);

          // Get quote for WETH -> USDT
          const pathToUsdt = encodePath(
            [UNISWAP_V3_ADDRESSES.WETH, UNISWAP_V3_ADDRESSES.USDT],
            [FEE_TIERS.MEDIUM]
          );
          const [finalQuote] = await quoterContractRef.current.quoteExactInput(pathToUsdt, wethQuote);

          return {
            path: [fromTokenObj.address, UNISWAP_V3_ADDRESSES.WETH, UNISWAP_V3_ADDRESSES.USDT],
            fees: [FEE_TIERS.MEDIUM, FEE_TIERS.MEDIUM],
            quote: finalQuote,
            isDirectRoute: false
          };
        } catch (error) {
          console.error('Failed to route through WETH:', error);
          return null;
        }
      }
      return null;
    }
  }, []);

  // Helper function to determine if it's a wrap/unwrap operation
  const isWrapUnwrapOperation = useCallback(() => {
    return (fromToken?.symbol === 'ETH' && toToken?.symbol === 'WETH') ||
           (fromToken?.symbol === 'WETH' && toToken?.symbol === 'ETH');
  }, [fromToken?.symbol, toToken?.symbol]);

  // Update getQuote function
  const getQuote = useCallback(async () => {
    if (!fromToken || !toToken || !fromAmount || !chain?.id || !quoterContractRef.current) return;

    try {
      setFindingRoute(true);
      setRouteError(null); // Clear any previous errors when starting a new quote
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);

      // Handle ETH/WETH cases
      const effectiveFromToken = fromToken.symbol === 'ETH' ? UNISWAP_V3_ADDRESSES.WETH : fromToken.address;
      const effectiveToToken = toToken.symbol === 'ETH' ? UNISWAP_V3_ADDRESSES.WETH : toToken.address;

      // Try common routing paths
      const routingPaths = [
        // Direct path with different fee tiers
        { path: [effectiveFromToken, effectiveToToken], fees: [3000] },
        { path: [effectiveFromToken, effectiveToToken], fees: [500] },
        { path: [effectiveFromToken, effectiveToToken], fees: [10000] }
      ];

      // If not a direct pair with WETH, add paths through WETH
      if (!routingPaths[0].path.includes(UNISWAP_V3_ADDRESSES.WETH)) {
        routingPaths.push(
          { 
            path: [effectiveFromToken, UNISWAP_V3_ADDRESSES.WETH, effectiveToToken], 
            fees: [3000, 3000] 
          },
          { 
            path: [effectiveFromToken, UNISWAP_V3_ADDRESSES.WETH, effectiveToToken], 
            fees: [500, 500] 
          },
          { 
            path: [effectiveFromToken, UNISWAP_V3_ADDRESSES.WETH, effectiveToToken], 
            fees: [3000, 500] 
          },
          { 
            path: [effectiveFromToken, UNISWAP_V3_ADDRESSES.WETH, effectiveToToken], 
            fees: [500, 3000] 
          }
        );
      }

      let bestAmountOut = 0n;
      let bestPath = null;

      for (const route of routingPaths) {
        try {
          const path = encodePath(route.path, route.fees);
          const [quotedAmountOut] = await quoterContractRef.current.quoteExactInput.staticCall(
            path,
            amountIn
          );

          if (quotedAmountOut > bestAmountOut) {
            bestAmountOut = quotedAmountOut;
            bestPath = route;
          }
        } catch (error) {
          continue;
        }
      }

      if (bestAmountOut === 0n || !bestPath) {
        setToAmount('');
        setRouteInfo(null);
        // Only set route error if we're not currently typing (use a small delay)
        if (fromAmount && fromAmount.length > 0) {
          setTimeout(() => {
            if (!findingRoute) {
              setRouteError('No liquidity found');
            }
          }, 500);
        }
        return;
      }

      const formattedAmount = ethers.formatUnits(bestAmountOut, toToken.decimals);
      setToAmount(formattedAmount);
      setRouteError(null);

      // Store route information
      const route = {
        path: bestPath.path.map((address, index) => {
          const isWETH = address.toLowerCase() === UNISWAP_V3_ADDRESSES.WETH.toLowerCase();
          return {
            symbol: isWETH ? 'WETH' :
                    address.toLowerCase() === fromToken.address?.toLowerCase() ? fromToken.symbol :
                    address.toLowerCase() === toToken.address?.toLowerCase() ? toToken.symbol : 'Unknown',
          };
        }),
        expectedOutput: formattedAmount,
        priceImpact: 0,
        fees: bestPath.fees
      };

      // If the path ends with WETH and toToken is ETH, add ETH to the path
      if (toToken.symbol === 'ETH') {
        route.path.push({ symbol: 'ETH' });
      }
      // If the path starts with WETH and fromToken is ETH, add ETH to the beginning
      if (fromToken.symbol === 'ETH') {
        route.path.unshift({ symbol: 'ETH' });
      }

      // Calculate price impact
      const calculatePriceImpact = async () => {
        try {
          const midPriceAmountIn = ethers.parseUnits('1', fromToken.decimals);
          const path = encodePath(bestPath.path, bestPath.fees);
          const [midPriceAmountOut] = await quoterContractRef.current.quoteExactInput.staticCall(
            path,
            midPriceAmountIn
          );
          
          const expectedOutput = (amountIn * midPriceAmountOut) / midPriceAmountIn;
          const impact = ((expectedOutput - bestAmountOut) * 10000n) / expectedOutput;
          return Number(impact) / 100;
        } catch (error) {
          console.error('Error calculating price impact:', error);
          return 0;
        }
      };

      const impact = await calculatePriceImpact();
      route.priceImpact = impact;
      setRouteInfo(route);
      setPriceImpact(impact);

    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error getting quote:', error);
      // Only set route error if we're not currently typing
      if (fromAmount && fromAmount.length > 0) {
        setTimeout(() => {
          if (!findingRoute) {
            setRouteError('Error finding route');
          }
        }, 500);
      }
    } finally {
      setFindingRoute(false);
    }
  }, [fromToken, toToken, fromAmount, chain?.id]);

  // Update quote when inputs change
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      if (isWrapUnwrapOperation()) {
        // For wrap/unwrap operations, set toAmount equal to fromAmount (1:1 conversion)
        setToAmount(fromAmount);
        setRouteInfo(null);
        setRouteError(null);
        setPriceImpact(null);
      } else {
        getQuote();
      }
    } else {
      setToAmount('');
      setPriceImpact(null);
    }
  }, [fromToken, toToken, fromAmount, getQuote, isWrapUnwrapOperation]);

  // Update checkAndSetAllowance function
  const checkAndSetAllowance = async (token, amount) => {
    if (!token || token.symbol === 'ETH' || !providerRef.current) return true;

    try {
      const signer = await providerRef.current.getSigner();
      const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
      
      const [routerAllowance] = await Promise.all([
        tokenContract.allowance(address, UNISWAP_V3_ADDRESSES.swapRouter)
      ]);

      if (routerAllowance < amount) {
        const maxApproval = ethers.MaxUint256;
        const approveTx = await tokenContract.approve(
          UNISWAP_V3_ADDRESSES.swapRouter,
          maxApproval
        );
        await approveTx.wait();
      }
      return true;
    } catch (error) {
      console.error('Error in checkAndSetAllowance:', error);
      return false;
    }
  };

  // Update the swap function to use Unichain's contract addresses
  const handleSwap = async () => {
    if (!address || !fromToken || !toToken || !fromAmount || !chain?.id || !providerRef.current) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setShowProgressModal(true);
    setSwapStep('preparing');
    setSwapError(null);

    try {
      const signer = await providerRef.current.getSigner();
      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);

      // Handle ETH <-> WETH wrapping/unwrapping
      if (isWrapUnwrapOperation()) {
        const wethContract = new ethers.Contract(
          UNISWAP_V3_ADDRESSES.WETH,
          [
            'function deposit() external payable',
            'function withdraw(uint256) external',
            'function approve(address spender, uint256 amount) external returns (bool)'
          ],
          signer
        );

        setSwapStep('wrapping');
        let tx;

        if (fromToken.symbol === 'ETH' && toToken.symbol === 'WETH') {
          // Wrap ETH to WETH using deposit()
          tx = await wethContract.deposit({
            value: amountIn
          });
        } else {
          // Unwrap WETH to ETH using withdraw()
          tx = await wethContract.withdraw(amountIn);
        }

        setSwapStep('confirming');
        await tx.wait();
        setSwapStep('completed');

        // Show completed state briefly, then close modal and show confetti
        setTimeout(() => {
          setShowProgressModal(false);
          setSwapStep(null);
          
          setTimeout(() => {
            setShowConfetti(true);
            
            setTimeout(() => {
              setShowRatingModal(true);
            }, 1000);
            
            setTimeout(() => {
              setFromAmount('');
              setToAmount('');
              setShowConfetti(false);
            }, 30000);
          }, 100);
        }, 1000);

        return;
      }

      // Handle normal token swaps
      if (!isWrapUnwrapOperation()) {
        // Check and set allowance if needed
        if (fromToken.symbol !== 'ETH') {
          setSwapStep('approval');
          const approved = await checkAndSetAllowance(fromToken, amountIn);
          if (!approved) {
            setSwapError('Failed to approve token');
            setSwapStep('error');
            return;
          }
        }

        // Parse amounts
        const parsedToAmount = ethers.parseUnits(toAmount, toToken.decimals);
        const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100));
        const amountOutMin = (parsedToAmount * slippageMultiplier) / 10000n;

        setSwapStep('swapping');
        const router = new ethers.Contract(
          UNISWAP_V3_ADDRESSES.swapRouter,
          SWAP_ROUTER_ABI,
          signer
        );

        const deadline = Math.floor(Date.now() / 1000) + 1200; // 20 minutes

        let tx;
        if (fromToken.symbol === 'ETH' || toToken.symbol === 'ETH') {
          // Handle ETH <-> ERC20 swaps
          const effectiveFromToken = fromToken.symbol === 'ETH' ? UNISWAP_V3_ADDRESSES.WETH : fromToken.address;
          const effectiveToToken = toToken.symbol === 'ETH' ? UNISWAP_V3_ADDRESSES.WETH : toToken.address;
          
          const path = encodePath(
            [effectiveFromToken, effectiveToToken],
            [FEE_TIERS.MEDIUM]
          );

          const params = {
            path,
            recipient: toToken.symbol === 'ETH' ? UNISWAP_V3_ADDRESSES.swapRouter : address,
            deadline,
            amountIn,
            amountOutMinimum: amountOutMin
          };

          if (toToken.symbol === 'ETH') {
            // If output token is ETH, we need to unwrap WETH
            const swapData = router.interface.encodeFunctionData('exactInput', [params]);
            const unwrapData = router.interface.encodeFunctionData('unwrapWETH9', [amountOutMin, address]);
            const refundData = router.interface.encodeFunctionData('refundETH');
            
            tx = await router.multicall(
              [swapData, unwrapData, refundData],
              {
                value: fromToken.symbol === 'ETH' ? amountIn : 0,
                gasLimit: 1000000n
              }
            );
          } else {
            tx = await router.exactInput(
              params,
              {
                value: fromToken.symbol === 'ETH' ? amountIn : 0,
                gasLimit: 1000000n
              }
            );
          }
        } else {
          // Handle ERC20 <-> ERC20 swaps
          const path = encodePath(
            routeInfo.path.map(token => 
              token.symbol === 'WETH' ? UNISWAP_V3_ADDRESSES.WETH : 
              token.symbol === fromToken.symbol ? fromToken.address : 
              toToken.address
            ),
            routeInfo.fees
          );

          const params = {
            path,
            recipient: address,
            deadline,
            amountIn,
            amountOutMinimum: amountOutMin
          };

          tx = await router.exactInput(
            params,
            { gasLimit: 1000000n }
          );
        }

        setSwapStep('confirming');
        await tx.wait();
        setSwapStep('completed');

        // Show completed state briefly, then close modal and show confetti
        setTimeout(() => {
          setShowProgressModal(false);
          setSwapStep(null);
          
          setTimeout(() => {
            setShowConfetti(true);
            
            setTimeout(() => {
              setShowRatingModal(true);
            }, 1000);
            
            setTimeout(() => {
              setFromAmount('');
              setToAmount('');
              setShowConfetti(false);
            }, 30000);
          }, 100);
        }, 1000);
      }

    } catch (error) {
      console.error('Swap error:', error);
      setSwapError(error.reason || 'Failed to swap tokens');
      setSwapStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSlippageChange = (value) => {
    if (value === 'custom') {
      setShowCustomSlippage(true);
    } else {
      setShowCustomSlippage(false);
      setSlippage(parseFloat(value));
    }
  };

  // Helper function to get button text
  const getActionButtonText = () => {
    if (!address) return 'Connect Wallet';
    if (loading) return 'Processing...';
    if (!fromToken || !toToken) return 'Select Tokens';
    if (!fromAmount) return 'Enter Amount';
    if (findingRoute && !isWrapUnwrapOperation()) return 'Finding best route...';
    if (routeError && !isWrapUnwrapOperation() && !findingRoute) return 'No Route Available';
    if (fromToken.symbol === 'ETH' && toToken?.symbol === 'WETH') return 'Wrap ETH';
    if (fromToken.symbol === 'WETH' && toToken?.symbol === 'ETH') return 'Unwrap WETH';
    return 'Swap';
  };

  // Add this helper function after getActionButtonText
  const getButtonStyles = () => {
    if (!address) return 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black';
    if (loading) return 'bg-gray-400 cursor-not-allowed text-gray-700';
    if (findingRoute && !isWrapUnwrapOperation()) return 'bg-[#2d2f36] hover:bg-[#2d2f36]/80 text-white cursor-wait';
    if (!fromToken || !toToken || !fromAmount) return 'bg-[#2d2f36] hover:bg-[#2d2f36]/80 text-white';
    if (routeError && !isWrapUnwrapOperation() && !findingRoute) return 'bg-red-500/20 text-red-500 cursor-not-allowed';
    return 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black shadow-lg shadow-[#00ffbd]/20';
  };

  // Add these keyframes to your CSS/Tailwind config
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideRight {
      0% { transform: translateX(-4px); opacity: 0; }
      20% { transform: translateX(0); opacity: 1; }
      80% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(4px); opacity: 0; }
    }
    @keyframes slideLeft {
      0% { transform: translateX(4px); opacity: 0; }
      20% { transform: translateX(0); opacity: 1; }
      80% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(-4px); opacity: 0; }
    }
    @keyframes fadeInOut {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const handleRating = (rating) => {
    // Here you can implement the logic to save the rating
    setShowRatingModal(false);
  };

  const handleTokenSelect = (token) => {
    if (activeSide === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenSelector(false);
  };

  const handleMaxAmount = (amount) => {
    setFromAmount(amount);
  };

  const handleWrapUnwrap = async () => {
    if (!address || !fromToken || !fromAmount) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setShowProgressModal(true);
    setSwapStep('preparing');
    setSwapError(null);
    
    try {
      console.log('Starting wrap/unwrap operation:', {
        fromToken: fromToken.symbol,
        toToken: toToken?.symbol,
        amount: fromAmount,
        address: address
      });

      // Use the existing provider if available, otherwise create a new one
      const provider = providerRef.current || new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log('Got signer:', await signer.getAddress());

      const amount = ethers.parseUnits(fromAmount, 18); // Both ETH and WETH use 18 decimals
      console.log('Parsed amount:', amount.toString());
      
      const wethContract = new ethers.Contract(
        UNISWAP_V3_ADDRESSES.WETH,
        [
          'function deposit() external payable',
          'function withdraw(uint256) external',
          'function approve(address spender, uint256 amount) external returns (bool)',
          'function balanceOf(address) external view returns (uint256)'
        ],
        signer
      );

      // Check WETH balance before operation
      if (fromToken.symbol === 'WETH') {
        const balance = await wethContract.balanceOf(address);
        console.log('Current WETH balance:', balance.toString());
        if (balance < amount) {
          throw new Error(`Insufficient WETH balance. Required: ${ethers.formatUnits(amount, 18)}, Available: ${ethers.formatUnits(balance, 18)}`);
        }
      }

      setSwapStep('wrapping');
      let tx;
      if (fromToken.symbol === 'ETH' && toToken?.symbol === 'WETH') {
        console.log('Wrapping ETH to WETH...');
        tx = await wethContract.deposit({ value: amount });
      } else if (fromToken.symbol === 'WETH' && toToken?.symbol === 'ETH') {
        console.log('Unwrapping WETH to ETH...');
        tx = await wethContract.withdraw(amount);
      }

      console.log('Transaction sent:', tx.hash);
      setSwapStep('confirming');
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      setSwapStep('completed');

      // Show completed state briefly, then close modal and show confetti
      setTimeout(() => {
        setShowProgressModal(false);
        setSwapStep(null);
        
        setTimeout(() => {
          setShowConfetti(true);
          
          setTimeout(() => {
            setShowRatingModal(true);
          }, 1000);
          
          setTimeout(() => {
            setFromAmount('');
            setToAmount('');
            setShowConfetti(false);
          }, 30000);
        }, 100);
      }, 1000);

    } catch (error) {
      console.error('Wrap/Unwrap error:', error);
      const errorMessage = error.reason || error.message || 'Failed to wrap/unwrap';
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        reason: error.reason,
        data: error.data
      });
      setSwapError(errorMessage);
      setSwapStep('error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const swapButtonVariants = {
    hover: { 
      scale: 1.1,
      rotate: 180,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="space-y-6 w-[464px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Add Confetti component with higher z-index */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.2}
          initialVelocityX={10}
          initialVelocityY={10}
          colors={['#00ffbd', '#00e6a9', '#00cc95', '#00b381', '#00996d']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99999,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Card Container */}
      <motion.div 
        className="bg-white dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
        variants={itemVariants}
      >
        <AnimatePresence mode="wait">
          {!address ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4">
                <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Please connect your wallet to start swapping tokens
              </p>
              <button
                onClick={openConnectModal}
                className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* From Token */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setFromAmount(value);
                        setRouteError(null);
                        setFindingRoute(true);
                      }
                    }}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => {
                      setActiveSide('from');
                      setShowTokenSelector(true);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
                  >
                    {fromToken ? (
                      <div className="flex items-center gap-2">
                        <img src={getTokenLogo(fromToken)} alt={fromToken.symbol} className="w-5 h-5" />
                        <span>{fromToken.symbol}</span>
                      </div>
                    ) : (
                      'Select Token'
                    )}
                  </button>
                </div>
                {fromToken && <TokenBalance token={fromToken} />}
              </motion.div>

              {/* Swap Icon */}
              <div className="flex justify-center my-4">
                <motion.button
                  onClick={() => {
                    const tempToken = fromToken;
                    const tempAmount = fromAmount;
                    setFromToken(toToken);
                    setFromAmount(toAmount);
                    setToToken(tempToken);
                    setToAmount(tempAmount);
                  }}
                  className="p-2.5 rounded-xl bg-[#00ffbd]/10 text-[#00ffbd] hover:bg-[#00ffbd]/20 transition-colors border border-[#00ffbd]/20"
                  variants={swapButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaExchangeAlt size={16} />
                </motion.button>
              </div>

              {/* To Token */}
              <motion.div className="space-y-2" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={() => {
                      setActiveSide('to');
                      setShowTokenSelector(true);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors border border-gray-200 dark:border-gray-800"
                  >
                    {toToken ? (
                      <div className="flex items-center gap-2">
                        <img src={getTokenLogo(toToken)} alt={toToken.symbol} className="w-5 h-5" />
                        <span>{toToken.symbol}</span>
                      </div>
                    ) : (
                      'Select Token'
                    )}
                  </button>
                </div>
                {toToken && <TokenBalance token={toToken} />}
              </motion.div>

              {/* Swap Details */}
              <motion.div 
                className="mt-4 p-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800"
                variants={itemVariants}
              >
                {/* Compact View (Always Visible) */}
                <div className="space-y-2 text-sm mb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Fee ({routeInfo ? routeInfo.fees.map(fee => (fee / 10000).toFixed(2)).join('% + ') : '--'}%)</span>
                      <span className="text-gray-500 cursor-help" title="A portion of each trade goes to liquidity providers as a protocol incentive.">ⓘ</span>
                    </div>
                    <span className="text-gray-200">
                      {routeInfo && fromAmount ? (
                        `${(fromAmount * (routeInfo.fees.reduce((a, b) => a + b, 0) / 1000000)).toFixed(6)} ${fromToken?.symbol}`
                      ) : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Network cost</span>
                      <span className="text-gray-500 cursor-help" title="Estimated cost of the transaction on Ethereum">ⓘ</span>
                    </div>
                    <span className="text-gray-200">Check wallet for gas cost</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

                {/* Show More Button */}
                <button
                  onClick={() => setShowMoreDetails(!showMoreDetails)}
                  className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-400"
                >
                  {showMoreDetails ? 'Hide Details' : 'Show Details'} 
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: showMoreDetails ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {showMoreDetails && (
                    <motion.div 
                      className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Output</span>
                        <span className="text-gray-200">
                          {isWrapUnwrapOperation() ? fromAmount : toAmount} {toToken?.symbol}
                        </span>
                      </div>

                      {!isWrapUnwrapOperation() && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Minimum received after slippage ({slippage}%)</span>
                            <span className="text-gray-200">
                              {toAmount && Number(toAmount * (1 - slippage/100)).toFixed(6)} {toToken?.symbol}
                            </span>
                          </div>

                          {routeInfo && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Route</span>
                              <span className="text-gray-200">
                                {routeInfo.path.map((token, index) => (
                                  <React.Fragment key={index}>
                                    {index > 0 && ' → '}
                                    {token.symbol}
                                  </React.Fragment>
                                ))}
                              </span>
                            </div>
                          )}

                          {priceImpact !== null && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Price Impact</span>
                              <span className={`${
                                priceImpact > 15 ? 'text-red-500' :
                                priceImpact > 5 ? 'text-yellow-500' :
                                'text-gray-200'
                              }`}>
                                {priceImpact.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Slippage Settings */}
      <motion.div 
        className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
        variants={itemVariants}
      >
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Slippage Tolerance
            </span>
            <div className="flex space-x-2">
              {[0.5, 1.0, 2.0].map((value) => (
                <button
                  key={value}
                  onClick={() => handleSlippageChange(value.toString())}
                  className={`px-3 py-1.5 text-sm rounded-xl transition-all
                    ${slippage === value && !showCustomSlippage
                      ? 'bg-[#00ffbd] text-black font-medium shadow-lg shadow-[#00ffbd]/20'
                      : 'bg-white/5 dark:bg-[#2d2f36] text-gray-900 dark:text-gray-100 hover:bg-[#00ffbd]/10'
                    } border border-gray-200 dark:border-gray-800`}
                >
                  {value}%
                </button>
              ))}
              <button
                onClick={() => handleSlippageChange('custom')}
                className={`px-3 py-1.5 text-sm rounded-xl transition-all
                  ${showCustomSlippage
                    ? 'bg-[#00ffbd] text-black font-medium shadow-lg shadow-[#00ffbd]/20'
                    : 'bg-white/5 dark:bg-[#2d2f36] text-gray-900 dark:text-gray-100 hover:bg-[#00ffbd]/10'
                  } border border-gray-200 dark:border-gray-800`}
              >
                Custom
              </button>
            </div>
          </div>

          {showCustomSlippage && (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={slippage}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    setSlippage(value);
                  }
                }}
                className="w-24 px-3 py-1.5 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Custom %"
              />
              <span className="text-sm text-gray-900 dark:text-gray-400">%</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Swap Button */}
      <motion.button
        onClick={handleSwap}
        disabled={loading || !fromToken || !toToken || !fromAmount || !toAmount}
        className={`
          w-full px-4 py-4 rounded-xl font-medium text-black text-lg
          ${loading || !fromToken || !toToken || !fromAmount || !toAmount
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
          }
        `}
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? 'Swapping...' : 'Swap'}
      </motion.button>

      {/* Add error message if there's a route error */}
      {routeError && !isWrapUnwrapOperation() && (
        <div className="text-sm text-red-500 mt-2 text-center">
          {routeError}
        </div>
      )}

      {/* Token Selector Modal */}
      <TokenSelector
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
        selectedToken={activeSide === 'from' ? fromToken : toToken}
        excludeToken={activeSide === 'from' ? toToken : fromToken}
      />

      {/* Progress Modal */}
      {isWrapUnwrapOperation() ? (
        <WrapProgressModal
          isOpen={showProgressModal}
          onClose={() => {
            setShowProgressModal(false);
            setSwapStep(null);
          }}
          currentStep={swapStep}
          fromToken={fromToken}
          toToken={toToken}
          error={swapError}
        />
      ) : (
        <SwapProgressModal
          isOpen={showProgressModal}
          onClose={() => {
            setShowProgressModal(false);
            setSwapStep(null);
          }}
          currentStep={swapStep}
          tokenIn={fromToken}
          tokenOut={toToken}
          error={swapError}
        />
      )}

      {/* Rating Modal */}
      <Transition appear show={showRatingModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowRatingModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center"
                  >
                    How was your experience?
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(rating)}
                          className="p-2 hover:bg-[#00ffbd]/10 rounded-full transition-colors"
                        >
                          <FaStar
                            size={24}
                            className={rating <= 3 ? 'text-yellow-500' : 'text-[#00ffbd]'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setShowRatingModal(false)}
                      className="w-full py-2 bg-[#00ffbd] text-black rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </motion.div>
  );
} 