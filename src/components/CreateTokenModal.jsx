import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { BiX, BiImageAdd } from 'react-icons/bi';
import clsx from 'clsx';
import { useWallet } from '../context/WalletContext';
import TokenFactoryABI from '../contracts/TokenFactory.json';
import { uploadTokenLogo } from '../services/storage';
import { useDeployments } from '../context/DeploymentsContext';
import { ipfsToHttp } from '../utils/ipfs';
import { trackTokenTransfers } from '../services/tokenTransfers';
import Confetti from 'react-confetti';

// Add required keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-2px);
    }
    75% {
      transform: translateX(2px);
    }
  }
`;
document.head.appendChild(style);

// Icons for token creation progress modal
const Icons = {
  Preparing: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" style={{ animation: 'rotate 2s linear infinite' }}>
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 6v2m0 8v2M6 12h2m8 0h2" strokeLinecap="round" style={{ animation: 'bounce 1.5s ease-in-out infinite' }} />
        <path d="M7.75 7.75l1.5 1.5m5.5 5.5l1.5 1.5m0-8.5l-1.5 1.5m-5.5 5.5l-1.5 1.5" strokeLinecap="round" style={{ animation: 'bounce 1.5s ease-in-out infinite', animationDelay: '0.2s' }} />
      </g>
    </svg>
  ),
  UploadingLogo: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 18V8m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 1s ease-in-out infinite' }} />
        <path d="M8 18h8" strokeLinecap="round" style={{ animation: 'fadeIn 1s ease-in-out infinite', animationDelay: '0.5s' }} />
      </g>
    </svg>
  ),
  CreatingToken: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M7 8h10M7 12h10M7 16h10" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite' }} />
        <path d="M12 6v12" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite', animationDelay: '0.5s' }} />
        <circle cx="12" cy="12" r="3" style={{ animation: 'rotate 4s linear infinite' }} />
      </g>
    </svg>
  ),
  Completed: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" className="animate-[fadeIn_0.5s_ease-in-out]" />
        <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.5s_ease-in-out_forwards]" style={{ strokeDasharray: 20, strokeDashoffset: 20 }} />
      </g>
    </svg>
  ),
  Error: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor" style={{ animation: 'shake 0.5s ease-in-out' }}>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" className="text-red-500" />
        <path d="M12 8v5" strokeLinecap="round" className="text-red-500" />
        <path d="M12 16v.01" strokeLinecap="round" className="text-red-500" />
      </g>
    </svg>
  )
};

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, tokenName, error }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing Transaction', icon: Icons.Preparing },
    { key: 'uploading', label: 'Uploading Logo', icon: Icons.UploadingLogo },
    { key: 'creating', label: 'Creating Token', icon: Icons.CreatingToken },
    { key: 'completed', label: 'Token Created Successfully', icon: Icons.Completed }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isError = Boolean(error);

  // Format error message to be more user-friendly
  const formatErrorMessage = (error) => {
    if (error?.includes('user rejected action')) {
      return 'Transaction was rejected. Please try again.';
    }
    if (error?.includes('insufficient funds')) {
      return 'Insufficient funds to complete the transaction.';
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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {isError ? 'Error Creating Token' : 'Creating Token'}
                  {tokenName && !isError && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {tokenName}
                    </div>
                  )}
                </Dialog.Title>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = !isError && index < currentStepIndex;
                    const isErrorStep = isError && index === currentStepIndex;

                    return (
                      <div
                        key={step.key}
                        className={clsx(
                          'flex items-center gap-3 p-3 rounded-xl transition-colors',
                          {
                            'bg-[#00ffbd]/10 text-[#00ffbd]': isActive && !isErrorStep,
                            'text-[#00ffbd]': isCompleted,
                            'bg-red-500/10 text-red-500': isErrorStep,
                            'text-gray-400': !isActive && !isCompleted && !isErrorStep
                          }
                        )}
                      >
                        <Icon />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900 dark:text-white">{step.label}</span>
                          {isActive && step.key === 'creating' && !isError && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Creating token {tokenName}
                            </p>
                          )}
                        </div>
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
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <p className="text-[#00ffbd] font-medium text-lg">Token created successfully! 🎉</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Your token is now ready for trading</p>
                    </div>
                    
                    <div className="bg-[#0a0b0f] p-4 rounded-xl border border-[#00ffbd]/20">
                      <h3 className="text-white font-medium mb-3">Next Steps</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center text-[#00ffbd]">1</div>
                          <div>
                            <p className="text-white font-medium">Add Liquidity</p>
                            <p className="text-sm text-gray-400">Provide liquidity to enable trading of your token</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center text-[#00ffbd]">2</div>
                          <div>
                            <p className="text-white font-medium">Start Trading</p>
                            <p className="text-sm text-gray-400">Use TokenFactory Swap, our Uniswap V2 fork, to trade your token</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center">
                        <a 
                          href="https://tokenfactory.xyz/trading" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-2.5 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors gap-2"
                        >
                          Go to TokenFactory Swap
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
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

// Star Rating Modal Component
const StarRatingModal = ({ isOpen, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

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
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white text-center mb-4">
                  Rate Your Experience
                </Dialog.Title>
                <div className="flex justify-center gap-2 mb-6">
                  {[...Array(9)].map((_, index) => (
                    <button
                      key={index}
                      onMouseEnter={() => setHoveredRating(index + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => {
                        setRating(index + 1);
                        onRate(index + 1);
                        onClose();
                      }}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 transition-colors ${
                          index + 1 <= (hoveredRating || rating) ? 'text-[#00ffbd]' : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const SUPPORTED_CHAINS = import.meta.env.VITE_SUPPORTED_CHAINS.split(',').map(Number);
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137,
  1301: import.meta.env.VITE_FACTORY_ADDRESS_1301
};
const CHAIN_FEES = {
  11155111: "0.01",  // Sepolia fee in ETH
  137: "20",         // Polygon fee in MATIC
  1301: "0.01"       // Unichain fee in ETH
};

// Update DEX configurations
const DEX_CONFIGS = {
  11155111: [ // Sepolia
    {
      name: 'Uniswap',
      logo: '/uniswap.png',
      addLiquidityUrl: (tokenAddress) => 
        `https://app.uniswap.org/#/add/ETH/${tokenAddress}?chain=sepolia`
    }
  ],
  137: [ // Polygon
    {
      name: 'QuickSwap',
      logo: '/quickswap.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://quickswap.exchange/#/add/MATIC/${tokenAddress}`
    },
    {
      name: 'SushiSwap',
      logo: '/sushiswap.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://app.sushi.com/add/MATIC/${tokenAddress}`
    },
    {
      name: 'Uniswap',
      logo: '/uniswap.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://app.uniswap.org/#/add/MATIC/${tokenAddress}?chain=polygon`
    }
  ]
};

export default function CreateTokenModal({ isOpen, onClose }) {
  const { account } = useWallet();
  const [currentChainId, setCurrentChainId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    description: '',
    logo: null
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const { addDeployment } = useDeployments();
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState(null);
  const [progressError, setProgressError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const checkChain = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentChainId(parseInt(chainId, 16));
      }
    };
    checkChain();

    window.ethereum?.on('chainChanged', (chainId) => {
      setCurrentChainId(parseInt(chainId, 16));
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const getFactoryAddress = () => {
    return FACTORY_ADDRESSES[currentChainId];
  };

  const getFee = () => {
    return CHAIN_FEES[currentChainId];
  };

  // Update the handleSuccess function
  const handleSuccess = async (deployedAddress, eventData, logoUrls) => {
    try {
      // Get chain name based on chain ID
      const getChainName = (chainId) => {
        switch (chainId) {
          case 137:
            return 'polygon';
          case 11155111:
            return 'sepolia';
          case 1301:
            return 'unichain';
          default:
            return 'unknown';
        }
      };

      const chainName = getChainName(currentChainId);
      console.log('Saving token deployment with data:', {
        name: eventData.name,
        symbol: eventData.symbol,
        address: deployedAddress,
        chainId: currentChainId,
        chainName,
        logo: logoUrls.httpUrl,
        logoIpfs: logoUrls.ipfsUrl,
        description: formData.description,
        totalSupply: ethers.formatUnits(eventData.supply, eventData.decimals),
        timestamp: Date.now(),
        creatorAddress: account.toLowerCase(),
        network: chainName // Add network field to match the expected format
      });

      await addDeployment({
        name: eventData.name,
        symbol: eventData.symbol,
        address: deployedAddress,
        chainId: currentChainId,
        chainName,
        logo: logoUrls.httpUrl,
        logoIpfs: logoUrls.ipfsUrl,
        description: formData.description,
        totalSupply: ethers.formatUnits(eventData.supply, eventData.decimals),
        timestamp: Date.now(),
        creatorAddress: account.toLowerCase(),
        network: chainName // Add network field to match the expected format
      });

      console.log('Token deployment saved successfully');

      // Initialize token transfer tracking
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Initializing transfer tracking for token:', deployedAddress);
      await trackTokenTransfers(deployedAddress, provider);
      console.log('Transfer tracking initialized');

      // Clear any existing toasts
      toast.dismiss();
      
      // Show completed state and trigger confetti
      setProgressStep('completed');
      setShowConfetti(true);

      // Close progress modal and show rating after a delay
      setTimeout(() => {
        setShowProgressModal(false);
        setProgressStep(null);
        setProgressError(null);
        
        // Show rating modal after a short delay
        setTimeout(() => {
          setShowRatingModal(true);
        }, 1000);
        
        // Cleanup confetti after some time
        setTimeout(() => {
          setShowConfetti(false);
        }, 30000);
      }, 8000);

      onClose();
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '',
        description: '',
        logo: null
      });
      setPreviewLogo(null);
    } catch (error) {
      console.error('Error saving deployment:', error);
      toast.error('Error saving deployment data');
    }
  };

  const createToken = async (e) => {
    e.preventDefault();
    
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setShowProgressModal(true);
    setProgressStep('preparing');
    setProgressError(null);

    try {
      let logoUrls = { ipfsUrl: '', httpUrl: '' };
      if (formData.logo) {
        setProgressStep('uploading');
        try {
          logoUrls = await uploadTokenLogo(formData.logo);
        } catch (uploadError) {
          setProgressStep('error');
          setProgressError(`Logo upload failed: ${uploadError.message}`);
          return;
        }
      } else {
        setProgressStep('error');
        setProgressError('Please upload a logo');
        return;
      }

      if (!SUPPORTED_CHAINS.includes(currentChainId)) {
        setProgressStep('error');
        setProgressError('Please switch to a supported network');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(getFactoryAddress(), TokenFactoryABI.abi, signer);

      const fee = ethers.parseEther(CHAIN_FEES[currentChainId].toString());
      
      setProgressStep('creating');

      const tx = await factory.createToken(
        formData.name,
        formData.symbol,
        18,
        ethers.parseUnits(formData.totalSupply, 18),
        logoUrls.ipfsUrl,
        { 
          value: fee,
          gasLimit: 3000000
        }
      );

      const receipt = await tx.wait();
      
      const tokenCreatedEvent = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog({
            topics: log.topics,
            data: log.data
          });
          return parsed?.name === 'TokenCreated';
        } catch (e) {
          return false;
        }
      });

      if (!tokenCreatedEvent) {
        throw new Error('Token creation event not found');
      }

      const parsedEvent = factory.interface.parseLog({
        topics: tokenCreatedEvent.topics,
        data: tokenCreatedEvent.data
      });
      
      const deployedAddress = parsedEvent.args[1];
      const eventData = {
        name: parsedEvent.args[2],
        symbol: parsedEvent.args[3],
        decimals: parsedEvent.args[4],
        supply: parsedEvent.args[5],
        logo: parsedEvent.args[6]
      };

      await handleSuccess(deployedAddress, eventData, logoUrls);

      // Show completed state and trigger confetti
      setProgressStep('completed');
      setShowConfetti(true);

      // Close progress modal and show rating after a delay
      setTimeout(() => {
        setShowProgressModal(false);
        setProgressStep(null);
        setProgressError(null);
        
        // Show rating modal after a short delay
        setTimeout(() => {
          setShowRatingModal(true);
        }, 1000);
        
        // Cleanup confetti after some time
        setTimeout(() => {
          setShowConfetti(false);
        }, 30000);
      }, 8000);

      onClose();
      setFormData({
        name: '',
        symbol: '',
        totalSupply: '',
        description: '',
        logo: null
      });
      setPreviewLogo(null);

    } catch (error) {
      console.error('Token Creation error:', error);
      setProgressStep('error');
      setProgressError(
        error.message.includes('chain') 
          ? 'Please switch to a supported network'
          : `Failed to create token: ${error.message}`
      );
    }
  };

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

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-white dark:bg-[#0a0b0f] p-6 relative">
            {/* L-shaped corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Token
              </Dialog.Title>
              <button 
                onClick={onClose} 
                className="w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0a0b0f] border border-[#00ffbd] rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <BiX size={20} className="text-[#00ffbd]" />
              </button>
            </div>
            
            {/* Glowing dot indicator */}
            <div className="absolute top-6 right-20 w-2 h-2 rounded-full bg-[#00ffbd] animate-pulse" />
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Launch your own token. Fee: {getFee() || '...'} {currentChainId === 137 ? 'POL' : 'ETH'}
            </p>

            <form onSubmit={createToken} className="space-y-4">
              {/* Logo Upload */}
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24">
                  <div className={`w-full h-full rounded-full border-2 border-dashed ${previewLogo ? 'border-[#00ffbd]' : 'border-gray-300'} flex items-center justify-center overflow-hidden`}>
                    {previewLogo ? (
                      <img src={previewLogo} alt="Token Logo" className="w-full h-full object-cover" />
                    ) : (
                      <BiImageAdd size={32} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Rest of the form remains the same */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Token Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none transition-all duration-200
                  autofill:bg-gray-50 dark:autofill:bg-[#1a1b1f] 
                  [-webkit-autofill]:!bg-gray-50 dark:[-webkit-autofill]:!bg-[#1a1b1f]
                  [-webkit-autofill]:!text-gray-900 dark:[-webkit-autofill]:!text-white
                  [-webkit-autofill_selected]:!bg-gray-50 dark:[-webkit-autofill_selected]:!bg-[#1a1b1f]"
                  placeholder="My Token"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Token Symbol</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none transition-all duration-200
                  autofill:bg-gray-50 dark:autofill:bg-[#1a1b1f] 
                  [-webkit-autofill]:!bg-gray-50 dark:[-webkit-autofill]:!bg-[#1a1b1f]
                  [-webkit-autofill]:!text-gray-900 dark:[-webkit-autofill]:!text-white
                  [-webkit-autofill_selected]:!bg-gray-50 dark:[-webkit-autofill_selected]:!bg-[#1a1b1f]"
                  placeholder="MTK"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Decimals</label>
                <input
                  type="number"
                  name="decimals"
                  value="18"
                  disabled
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-75"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Standard ERC20 decimal places (non-modifiable)
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Total Supply</label>
                <input
                  type="text"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none transition-all duration-200"
                  placeholder="1000000"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none resize-none transition-all duration-200"
                  placeholder="Describe your token..."
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
                  disabled={!account || !SUPPORTED_CHAINS.includes(currentChainId)}
                >
                  Create Token
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setProgressStep(null);
        }}
        currentStep={progressStep}
        tokenName={formData.name}
        error={progressError}
      />

      {/* Add Star Rating Modal */}
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={(rating) => {
          console.log('User rated token creation:', rating);
          // Here you can implement the logic to save the rating
        }}
      />

      {/* Add Confetti */}
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
    </>
  );
}