import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { BiX, BiImageAdd, BiCopy, BiWallet } from 'react-icons/bi';
import clsx from 'clsx';
import { useAccount, useNetwork } from 'wagmi';
import TokenFactoryABI from '../contracts/TokenFactory.json';
import { uploadTokenLogo } from '../services/storage';
import { useDeployments } from '../context/DeploymentsContext';
import { ipfsToHttp } from '../utils/ipfs';
import { trackTokenTransfers } from '../services/tokenTransfers';
import Confetti from 'react-confetti';
import { useWallet } from '../context/WalletContext';

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

// Network Configuration
const CHAIN_IDS = {
  SEPOLIA: 11155111,
  POLYGON: 137,
  UNICHAIN_MAINNET: 130,
  UNICHAIN: 1301,
  MOONWALKER: 1828369849,
  MONAD_TESTNET: 10143
};

const FACTORY_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  [CHAIN_IDS.POLYGON]: import.meta.env.VITE_FACTORY_ADDRESS_137,
  [CHAIN_IDS.UNICHAIN_MAINNET]: import.meta.env.VITE_FACTORY_ADDRESS_130,
  [CHAIN_IDS.UNICHAIN]: import.meta.env.VITE_FACTORY_ADDRESS_1301,
  [CHAIN_IDS.MOONWALKER]: import.meta.env.VITE_FACTORY_ADDRESS_1828369849,
  [CHAIN_IDS.MONAD_TESTNET]: import.meta.env.VITE_FACTORY_ADDRESS_10143
};

const CHAIN_FEES = {
  [CHAIN_IDS.SEPOLIA]: "0.01",    // Sepolia fee in ETH
  [CHAIN_IDS.POLYGON]: "20",      // Polygon fee in POL
  [CHAIN_IDS.UNICHAIN_MAINNET]: "0.01",   // Unichain Mainnet fee in ETH
  [CHAIN_IDS.UNICHAIN]: "0.01",   // Unichain fee in ETH
  [CHAIN_IDS.MOONWALKER]: "369",   // Moonwalker fee in ZERO
  [CHAIN_IDS.MONAD_TESTNET]: "0.01"  // Monad Testnet fee in MON
};

const NETWORK_NAMES = {
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
  [CHAIN_IDS.POLYGON]: 'Polygon',
  [CHAIN_IDS.UNICHAIN_MAINNET]: 'Unichain Mainnet',
  [CHAIN_IDS.UNICHAIN]: 'Unichain Testnet',
  [CHAIN_IDS.MOONWALKER]: 'Moonwalker',
  [CHAIN_IDS.MONAD_TESTNET]: 'Monad Testnet'
};

const NETWORK_CURRENCIES = {
  [CHAIN_IDS.SEPOLIA]: 'ETH',
  [CHAIN_IDS.POLYGON]: 'POL',
  [CHAIN_IDS.UNICHAIN_MAINNET]: 'ETH',
  [CHAIN_IDS.UNICHAIN]: 'ETH',
  [CHAIN_IDS.MOONWALKER]: 'ZERO',
  [CHAIN_IDS.MONAD_TESTNET]: 'MON'
};

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, tokenName, error, deployedAddress }) => {
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Address copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[99999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-[99999]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto z-[99999]">
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
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {error ? 'Error Creating Token' : 'Creating Token'}
                  {tokenName && !error && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {tokenName}
                    </div>
                  )}
                </Dialog.Title>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStepIndex;
                    const isCompleted = !error && index < currentStepIndex;
                    const isErrorStep = error && index === currentStepIndex;

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
                          {isActive && step.key === 'creating' && !error && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Creating token {tokenName}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {error && (
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
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Your token has been deployed and is ready for use</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-[#2d2f36] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-gray-900 dark:text-white font-medium mb-3">Token Contract Address</h3>
                      <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-[#1a1b1f] rounded-lg">
                        <code className="text-sm text-gray-800 dark:text-gray-200 flex-1 break-all">
                          {deployedAddress}
                        </code>
                        <button
                          onClick={() => copyToClipboard(deployedAddress)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                          title="Copy address"
                        >
                          <BiCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        ℹ️ Copy this address to import your token in your wallet
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-[#2d2f36] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-gray-900 dark:text-white font-medium mb-3">Next Steps</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center text-[#00ffbd] shrink-0">1</div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Import Token</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add the token to your wallet using the contract address above</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center text-[#00ffbd] shrink-0">2</div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Add Liquidity</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Provide liquidity to enable trading of your token</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#00ffbd]/10 flex items-center justify-center text-[#00ffbd] shrink-0">3</div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">Start Trading</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Use TokenFactory Swap to trade your token</p>
                          </div>
                        </div>
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
        `https://quickswap.exchange/#/add/POL/${tokenAddress}`
    },
    {
      name: 'SushiSwap',
      logo: '/sushiswap.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://app.sushi.com/add/POL/${tokenAddress}`
    },
    {
      name: 'Uniswap',
      logo: '/uniswap.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://app.uniswap.org/#/add/POL/${tokenAddress}?chain=polygon`
    }
  ],
  130: [ // Unichain Mainnet
    {
      name: 'UniDex',
      logo: '/unidex.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://unichain.blockscout.com/token/${tokenAddress}`
    }
  ],
  10143: [ // Monad Testnet
    {
      name: 'Monad Explorer',
      logo: '/monad.png',
      addLiquidityUrl: (tokenAddress) =>
        `https://monad-testnet.socialscan.io/token/${tokenAddress}`
    }
  ]
};

export default function CreateTokenModal({ isOpen, onClose }) {
  const { account } = useWallet();
  const [currentChainId, setCurrentChainId] = useState(null);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState(null);
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
    const fee = CHAIN_FEES[currentChainId];
    const currency = NETWORK_CURRENCIES[currentChainId] || 'ETH';
    return `${fee} ${currency}`;
  };

  const handleSuccess = async (deployedAddress, eventData, logoUrls) => {
    try {
      const getChainName = (chainId) => {
        switch (chainId) {
          case 137:
            return 'Polygon';
          case 11155111:
            return 'Sepolia';
          case 130:
            return 'Unichain Mainnet';
          case 1301:
            return 'Unichain Testnet';
          case 1828369849:
            return 'Moonwalker';
          case 10143:
            return 'Monad Testnet';
          default:
            return 'Unknown';
        }
      };

      // If we have the deployed address directly, use it even if saving deployment fails
      if (deployedAddress) {
        setDeployedTokenAddress(deployedAddress);
      }

      // Try to save deployment
      try {
        const chainId = await getNetwork().then(network => network.chainId);
        const deployment = {
          address: deployedAddress,
          name: formData.name,
          symbol: formData.symbol,
          decimals: 18,
          totalSupply: formData.totalSupply,
          logo: logoUrls?.logo,
          logoIpfs: logoUrls?.logoIpfs,
          timestamp: Date.now(),
          chainId: chainId,
          chainName: getChainName(chainId),
          type: 'token'
        };
        await addDeployment(deployment);
      } catch (error) {
        console.warn('Error saving deployment:', error);
        // Continue anyway since we have the address
      }

      // Show success state
      setProgressStep('completed');
      setProgressError(null);
    } catch (error) {
      console.error('Error in handleSuccess:', error);
      setProgressError(error.message);
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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryAddress = getFactoryAddress();
      
      if (!factoryAddress) {
        setProgressStep('error');
        setProgressError('Factory address not found for this network');
        return;
      }

      const factory = new ethers.Contract(factoryAddress, TokenFactoryABI.abi, signer);

      // Calculate fee based on network
      let fee;
      if (currentChainId === CHAIN_IDS.MONAD_TESTNET) {
        fee = ethers.parseEther(CHAIN_FEES[currentChainId]); // Use MON as fee
        toast.success('Creating token with MON as fee on Monad Testnet');
      } else if (currentChainId === CHAIN_IDS.MOONWALKER) {
        fee = ethers.parseEther("0.01"); // Keep original fee until contract update
        toast.success('Note: 369 ZERO fee will be implemented in the next contract update');
      } else {
        fee = ethers.parseEther(CHAIN_FEES[currentChainId]?.toString() || "0.01");
      }
      
      setProgressStep('creating');

      // Add specific gas settings for Monad
      const gasSettings = currentChainId === CHAIN_IDS.MONAD_TESTNET ? {
        gasLimit: 5000000, // Higher gas limit for Monad
      } : {
        gasLimit: 3000000
      };

      const tx = await factory.createToken(
        formData.name,
        formData.symbol,
        18,
        ethers.parseUnits(formData.totalSupply, 18),
        logoUrls.ipfsUrl,
        { 
          value: fee,
          ...gasSettings
        }
      );

      const receipt = await tx.wait();
      
      // Find the TokenCreated event
      const tokenCreatedEvent = receipt.logs.find(log => {
        // Check if this log is from our factory contract
        if (log.address.toLowerCase() !== factoryAddress.toLowerCase()) {
          return false;
        }
        
        try {
          // Get the event signature for TokenCreated event
          const eventSignature = ethers.id(
            'TokenCreated(address,address,string,string,uint8,uint256,string,bool)'
          );

          // Check if this log's first topic matches our event signature
          return log.topics[0].toLowerCase() === eventSignature.toLowerCase();
        } catch (e) {
          console.error('Error checking event signature:', e);
          return false;
        }
      });

      // If we can't find the event in logs, try to get it from the transaction receipt events
      let tokenAddress;
      if (!tokenCreatedEvent) {
        // Try to get the address from transaction receipt events
        const events = receipt.logs.map(log => {
          try {
            return factory.interface.parseLog(log);
          } catch (e) {
            return null;
          }
        }).filter(Boolean);
        
        const tokenEvent = events.find(event => event.name === 'TokenCreated');
        if (tokenEvent) {
          tokenAddress = tokenEvent.args[1]; // token address should be the second argument
        } else {
          console.error('Available logs:', receipt.logs);
          throw new Error('Could not find token address in transaction events');
        }
      } else {
        // Parse the event data using the factory interface
        const parsedLog = factory.interface.parseLog({
          topics: tokenCreatedEvent.topics,
          data: tokenCreatedEvent.data
        });
        tokenAddress = parsedLog.args[1];
      }

      // Set the token address immediately
      if (tokenAddress) {
        setDeployedTokenAddress(tokenAddress);
        setProgressStep('completed');
      } else {
        throw new Error('Failed to get token address from transaction');
      }

      // Now try to handle the rest of the success flow
      const tokenData = {
        name: formData.name,
        symbol: formData.symbol,
        decimals: 18,
        supply: ethers.parseUnits(formData.totalSupply, 18),
        logo: logoUrls.ipfsUrl
      };

      await handleSuccess(tokenAddress, tokenData, logoUrls);

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
      <Dialog open={isOpen} onClose={onClose} className="relative z-[9999]">
        <div className="fixed inset-0 bg-black/70 z-[9999]" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
          <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-[#0a0b0f] p-6">
            <div className="relative">
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

              {/* Glowing dots in corners */}
              <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

              {/* Three dots in top right */}
              <div className="absolute top-3 right-3 flex gap-1 z-20">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              {/* Main Content */}
              <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Token
              </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <BiX size={24} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Launch your own token. Fee: {getFee() || '...'}
            </p>

                {!account ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Connect Your Wallet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Please connect your wallet to create a token
                    </p>
                    <w3m-button />
                  </div>
                ) : (
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
                        disabled={!account}
                >
                  Create Token
                </button>
              </div>
            </form>
                )}
              </div>
            </div>
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
        deployedAddress={deployedTokenAddress}
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