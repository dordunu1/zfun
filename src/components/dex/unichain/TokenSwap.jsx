import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { BiWallet } from 'react-icons/bi';
import { FaExchangeAlt, FaStar } from 'react-icons/fa';
import { useWeb3Modal } from '@web3modal/react';
import { useUnichain } from '../../../hooks/useUnichain';
import TokenSelector from './TokenSelector';
import { getTokenLogo } from '../../../utils/tokens';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Confetti from 'react-confetti';

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
  )
};

// Add SwapProgressModal component
const SwapProgressModal = ({ isOpen, onClose, currentStep, tokenIn, tokenOut, needsApproval }) => {
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <Icons.Preparing /> },
    ...(needsApproval ? [{ id: 'approval', title: 'Token Approval', icon: <Icons.Approval /> }] : []),
    { id: 'swapping', title: 'Swapping', icon: <Icons.Swapping /> },
    { id: 'confirming', title: 'Confirming', icon: <Icons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <Icons.Completed /> }
  ];

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
                  Swapping Tokens
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : 
                          isCompleted ? 'bg-gray-100 dark:bg-gray-800/50' : 
                          'bg-gray-50 dark:bg-gray-800/20'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                            isActive ? 'text-[#00ffbd] animate-pulse' : 
                            isCompleted ? 'text-[#00ffbd]' : 
                            'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h4>
                          {isActive && (
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
const WrapProgressModal = ({ isOpen, onClose, currentStep, fromToken, toToken }) => {
  const isWrapping = fromToken?.symbol === 'ETH';
  const steps = [
    { id: 'preparing', title: 'Preparing', icon: <WrapIcons.Preparing /> },
    { id: 'wrapping', title: isWrapping ? 'Wrapping' : 'Unwrapping', icon: isWrapping ? <WrapIcons.Wrapping /> : <WrapIcons.Unwrapping /> },
    { id: 'confirming', title: 'Confirming', icon: <WrapIcons.Confirming /> },
    { id: 'completed', title: 'Completed', icon: <WrapIcons.Completed /> }
  ];

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
                  {isWrapping ? 'Wrapping ETH' : 'Unwrapping WETH'}
                </Dialog.Title>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : 
                          isCompleted ? 'bg-gray-100 dark:bg-gray-800/50' : 
                          'bg-gray-50 dark:bg-gray-800/20'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                            isActive ? 'text-[#00ffbd] animate-pulse' : 
                            isCompleted ? 'text-[#00ffbd]' : 
                            'text-gray-400 dark:text-gray-600'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </h4>
                          {isActive && (
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

// Add StarRatingModal component
const StarRatingModal = ({ isOpen, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[99998]" onClose={onClose}>
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
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                >
                  Rate Your Swap Experience
                </Dialog.Title>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    {[...Array(9)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={starValue}
                          className="transition-transform hover:scale-110 focus:outline-none"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHover(starValue)}
                          onMouseLeave={() => setHover(0)}
                        >
                          <FaStar
                            size={28}
                            className={`transition-colors ${
                              (hover || rating) >= starValue
                                ? 'text-[#00ffbd]'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {rating === 0 ? 'Select a rating' : `You rated: ${rating} star${rating !== 1 ? 's' : ''}`}
                  </p>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => {
                        if (rating > 0) {
                          onRate(rating);
                          onClose();
                        }
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                        rating > 0
                          ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
                          : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Submit Rating
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function TokenSwap() {
  const { address, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const uniswap = useUnichain();
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [activeSide, setActiveSide] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState(null);
  const [networkCost, setNetworkCost] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [slippage, setSlippage] = useState(2.0);
  const [customSlippage, setCustomSlippage] = useState('');
  const [showCustomSlippage, setShowCustomSlippage] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [swapStep, setSwapStep] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showRatingModal, setShowRatingModal] = useState(false);

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

  // Add confetti timeout handler
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Run confetti for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Add balance display component
  const TokenBalance = ({ token }) => {
    const { address: userAddress } = useAccount();
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

  // Update useEffect for route calculation
  useEffect(() => {
    const updateRoute = async () => {
      if (!fromToken || !toToken || !fromAmount || !uniswap) {
        setToAmount('');
        setRoute(null);
        setRouteError(null);
        return;
      }

      try {
        const { route: newRoute, toAmount: newToAmount, path } = await uniswap.updateRoute(
          fromToken,
          toToken,
          fromAmount
        );

        if (!newRoute || !newToAmount || newToAmount === '0') {
          setToAmount('');
          setRoute(null);
          setRouteError('No valid route found');
          return;
        }

        setRoute(newRoute);
        setToAmount(newToAmount);
        setRouteError(null);
      } catch (error) {
        setToAmount('');
        setRoute(null);
        setRouteError('Error finding route');
      }
    };

    updateRoute();
  }, [fromToken, toToken, fromAmount, uniswap]);

  const handleTokenSelect = (token) => {
    if (activeSide === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenSelector(false);
  };

  const handleSwap = async () => {
    if (!address || !fromToken || !toToken || !fromAmount) return;

    setLoading(true);
    setShowProgressModal(true);
    setSwapStep('preparing');
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Parse amounts
      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
      const amountOutMinRaw = ethers.parseUnits(toAmount, toToken.decimals);
      
      // Calculate slippage
      const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100));
      const amountOutMin = (amountOutMinRaw * slippageMultiplier) / 10000n;

      // Get the route path from updateRoute
      const { path } = await uniswap.updateRoute(fromToken, toToken, fromAmount);
      if (!path) {
        throw new Error('No valid route found');
      }

      let actualFromToken = fromToken;
      let actualPath = path;

      // Check if we need to wrap ETH first
      if (fromToken.symbol === 'ETH' && path[0] === UNISWAP_ADDRESSES.WETH) {
        const wethBalance = await uniswap.getWETHBalance(address);
        if (wethBalance < amountIn) {
          setSwapStep('wrapping');
          await uniswap.wrapETH(amountIn);
          
          actualFromToken = {
            ...fromToken,
            symbol: 'WETH',
            address: UNISWAP_ADDRESSES.WETH,
            decimals: 18
          };
        }
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20);

      setSwapStep('swapping');
      const tx = await uniswap.swap(
        actualFromToken,
        toToken,
        amountIn,
        amountOutMin,
        actualPath,
        deadline
      );

      // Start watching for confirmation
      setSwapStep('confirming');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) { // 1 means success
        // Set completed state
        setSwapStep('completed');
        
        // Show completed state briefly, then close modal and show confetti
        setTimeout(() => {
          setShowProgressModal(false);
          setSwapStep(null);
          
          // Show confetti after modal is closed
          setTimeout(() => {
            setShowConfetti(true);
            
            // Show rating modal after a short delay
            setTimeout(() => {
              setShowRatingModal(true);
            }, 1000);
            
            // Reset form and cleanup after confetti (30 seconds)
            setTimeout(() => {
              setFromAmount('');
              setToAmount('');
              setShowConfetti(false);
            }, 30000); // 30 seconds
          }, 100);
        }, 1000);
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (error) {
      console.error('Swap error:', error);
      setShowProgressModal(false);
      setSwapStep(null);
      setShowConfetti(false);
      toast.error(error.message || 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlippageChange = (value) => {
    if (value === 'custom') {
      setShowCustomSlippage(true);
    } else {
      setSlippage(parseFloat(value));
      setShowCustomSlippage(false);
      setCustomSlippage('');
    }
  };

  const handleCustomSlippageChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100)) {
      setCustomSlippage(value);
      if (value !== '') {
        setSlippage(parseFloat(value));
      }
    }
  };

  // Add new function for wrapping/unwrapping
  const handleWrapUnwrap = async () => {
    if (!address || !fromToken || !fromAmount) return;
    
    setLoading(true);
    setShowProgressModal(true);
    setSwapStep('preparing');
    
    try {
      const amount = ethers.parseUnits(fromAmount, 18); // Both ETH and WETH use 18 decimals

      setSwapStep('wrapping');
      if (fromToken.symbol === 'ETH' && toToken?.symbol === 'WETH') {
        await uniswap.wrapETH(amount);
      } else if (fromToken.symbol === 'WETH' && toToken?.symbol === 'ETH') {
        await uniswap.unwrapWETH(amount);
      }

      setSwapStep('confirming');
      // Small delay to show the confirming state
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSwapStep('completed');

      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      setShowProgressModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if it's a wrap/unwrap operation
  const isWrapUnwrapOperation = () => {
    return (fromToken?.symbol === 'ETH' && toToken?.symbol === 'WETH') ||
           (fromToken?.symbol === 'WETH' && toToken?.symbol === 'ETH');
  };

  // Helper function to get button text
  const getActionButtonText = () => {
    if (loading) return 'Processing...';
    if (!fromToken || !toToken) return 'Select Tokens';
    if (!fromAmount) return 'Enter Amount';
    if (routeError && !isWrapUnwrapOperation()) return 'No Route Available';
    if (fromToken.symbol === 'ETH' && toToken?.symbol === 'WETH') return 'Wrap ETH to WETH';
    if (fromToken.symbol === 'WETH' && toToken?.symbol === 'ETH') return 'Unwrap WETH to ETH';
    return 'Swap';
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
    console.log('User rated:', rating);
    // Here you can implement the logic to save the rating
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
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
      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {!isConnected ? (
          <div className="text-center py-8">
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
          </div>
        ) : (
          <>
            {/* From Token */}
            <div className="space-y-2">
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
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center my-4">
              <button
                onClick={() => {
                  const tempToken = fromToken;
                  const tempAmount = fromAmount;
                  setFromToken(toToken);
                  setFromAmount(toAmount);
                  setToToken(tempToken);
                  setToAmount(tempAmount);
                }}
                className="p-2.5 rounded-xl bg-[#00ffbd]/10 text-[#00ffbd] hover:bg-[#00ffbd]/20 transition-colors border border-[#00ffbd]/20"
              >
                <FaExchangeAlt size={16} />
              </button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
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
            </div>

            {/* Trade Details Section */}
            <div className="mt-4 p-3 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
              {/* Compact View (Always Visible) */}
              <div className="space-y-2 text-sm mb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Fee (0.3%)</span>
                    <span className="text-gray-500 cursor-help" title="A portion of each trade (0.3%) goes to liquidity providers as a protocol incentive.">ⓘ</span>
                  </div>
                  <span className="text-gray-200">
                    {fromAmount ? `${(Number(fromAmount) * 0.003).toFixed(6)} ${fromToken?.symbol}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Network cost</span>
                    <span className="text-gray-500 cursor-help" title="Estimated cost of the transaction on Ethereum">ⓘ</span>
                  </div>
                  <span className="text-gray-200">{networkCost || '~0.003 ETH'}</span>
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
                <svg
                  className={`w-4 h-4 transition-transform ${showMoreDetails ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Details */}
              {showMoreDetails && (
                <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected Output</span>
                    <span className="text-gray-200">{toAmount} {toToken?.symbol}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Minimum received after slippage ({slippage}%)</span>
                    <span className="text-gray-200">
                      {toAmount && Number(toAmount * (1 - slippage/100)).toFixed(6)} {toToken?.symbol}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Route</span>
                    <span className="text-gray-200">{route || '--'}</span>
                  </div>

                  {exchangeRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rate</span>
                      <span className="text-gray-200">
                        1 {fromToken?.symbol} = {exchangeRate.toFixed(6)} {toToken?.symbol}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Slippage Settings */}
      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
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
            <div className="flex items-center space-x-2 bg-white/5 dark:bg-[#2d2f36] rounded-xl p-2 border border-gray-200 dark:border-gray-800">
              <input
                type="text"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
                placeholder="Enter slippage %"
                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <span className="text-gray-900 dark:text-gray-100 pr-2">%</span>
            </div>
          )}
        </div>
      </div>

      {/* Single Action Button */}
      <button
        onClick={isWrapUnwrapOperation() ? handleWrapUnwrap : handleSwap}
        disabled={loading || !fromToken || !toToken || !fromAmount || (!toAmount && !isWrapUnwrapOperation())}
        className={`
          w-full px-4 py-4 rounded-xl font-medium text-lg
          ${loading || !fromToken || !toToken || !fromAmount || (!toAmount && !isWrapUnwrapOperation())
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400'
            : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors text-black'
          }
        `}
      >
        {getActionButtonText()}
      </button>

      {/* Token Selector Modal */}
      <TokenSelector
        isOpen={showTokenSelector}
        onClose={() => setShowTokenSelector(false)}
        onSelect={handleTokenSelect}
        excludeToken={activeSide === 'from' ? toToken : fromToken}
      />

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
          needsApproval={isWrapUnwrapOperation()}
        />
      )}

      {/* Add Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={handleRating}
      />
    </div>
  );
} 