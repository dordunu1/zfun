import React, { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaMagic, FaFire, FaLock, FaInfoCircle, FaStar } from 'react-icons/fa';
import { BiWallet, BiCoin, BiCopy, BiCheck, BiError } from 'react-icons/bi';
import { useAccount, useNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import TokenFactoryABI from '../contracts/TokenFactory.json';
import MemeTokenABI from '../abi/MemeToken.json';
import { useDeployments } from '../context/DeploymentsContext';
import { trackTokenTransfers } from '../services/tokenTransfers';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import TokenInfo from '../components/TokenInfo';
import { Switch } from '@headlessui/react';
import { HiOutlineCamera } from 'react-icons/hi';
import SnapshotViewer from '../components/SnapshotViewer';
import { ShieldCheckIcon, FireIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Modal } from '../components/ui/Modal';

// Import Meme Font
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .meme-title {
    font-family: 'Press Start 2P', cursive;
    text-shadow: 2px 2px 0px #FF512F;
  }

  .pixel-border {
    box-shadow: 
      -3px 0 0 0 #000,
      3px 0 0 0 #000,
      0 -3px 0 0 #000,
      0 3px 0 0 #000;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  /* Consistent input focus styles */
  input:not([type="checkbox"]):focus {
    outline: none !important;
    border-color: #00ffbd !important;
    box-shadow: 0 0 0 2px rgba(0, 255, 189, 0.2) !important;
  }

  input:not([type="checkbox"]):hover {
    border-color: #00ffbd;
  }

  input:not([type="checkbox"]):active {
    border-color: #00ffbd;
  }

  /* Light mode styles */
  :root {
    --tooltip-bg: #ffffff;
    --tooltip-text: #1f2937;
    --tooltip-border: #e5e7eb;
    --info-text: #6b7280;
    --info-hover: #4b5563;
    --form-helper-text: #6b7280;
    --form-helper-text-hover: #4b5563;
  }

  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    :root {
      --tooltip-bg: #1a1b1f;
      --tooltip-text: #e5e7eb;
      --tooltip-border: #374151;
      --info-text: #9ca3af;
      --info-hover: #d1d5db;
      --form-helper-text: #9ca3af;
      --form-helper-text-hover: #d1d5db;
    }
  }

  /* Form helper text styles */
  .form-helper-text {
    color: var(--form-helper-text);
    transition: color 0.2s ease;
  }

  .form-helper-text:hover {
    color: var(--form-helper-text-hover);
  }

  /* Info icon styles */
  .info-icon {
    color: var(--info-text);
    transition: color 0.2s ease;
  }

  .info-icon:hover {
    color: var(--info-hover);
  }

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

  /* Tooltip styles */
  .react-tooltip {
    background-color: var(--tooltip-bg) !important;
    color: var(--tooltip-text) !important;
    border: 1px solid var(--tooltip-border) !important;
    font-size: 0.875rem !important;
    padding: 0.75rem 1rem !important;
    z-index: 50 !important;
    max-width: 20rem !important;
    line-height: 1.5 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    opacity: 1 !important;
    border-radius: 0.5rem !important;
  }
`;
document.head.appendChild(style);

// Add DEX images mapping
const DEX_IMAGES = {
  'QuickSwap': '/quickswap.png',
  'Uniswap V2': '/uniswap.png'
};

// Add DEX configurations
const dexConfigs = {
  11155111: {
    router: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
    factory: '0x7E0987E5b3a30e3f2828572Bb659A548460a3003',
    name: 'Uniswap V2',
    isActive: true
  },
  137: {
    router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    name: 'QuickSwap',
    isActive: true
  },
  130: {
    router: '0x284F11109359a7e1306C3e447ef14D38400063FF',
    factory: '0x1F98400000000000000000000000000000000002',
    name: 'Uniswap V2',
    isActive: true
  },
  1301: {
    router: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    name: 'Uniswap V2',
    isActive: true
  },
  1828369849: {
    router: '0x920b806E40A00E02E7D2b94fFc89860fDaEd3640',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    name: 'Uniswap V2',
    isActive: true
  }
};

// Add DEX trading URLs mapping
const DEX_TRADING_URLS = {
  11155111: {
    name: 'Uniswap V2',
    network: 'Sepolia',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=sepolia`
  },
  137: {
    name: 'QuickSwap',
    network: 'Polygon',
    getTradeUrl: (tokenAddress) => `https://quickswap.exchange/#/swap?outputCurrency=${tokenAddress}`
  },
  130: {
    name: 'Uniswap V2',
    network: 'Unichain',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=unichain`
  },
  1301: {
    name: 'Uniswap V2',
    network: 'Unichain',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=unichain`
  },
  1828369849: {
    name: 'Uniswap V2',
    network: 'Moonwalker',
    getTradeUrl: (tokenAddress) => `https://app.uniswap.org/#/swap?outputCurrency=${tokenAddress}&chain=moonwalker`
  }
};

// Progress Modal Icons Component
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
  UNICHAIN_TESTNET: 1301,
  MOONWALKER: 1828369849
};

const FACTORY_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  [CHAIN_IDS.POLYGON]: import.meta.env.VITE_FACTORY_ADDRESS_137,
  [CHAIN_IDS.UNICHAIN_MAINNET]: import.meta.env.VITE_FACTORY_ADDRESS_130,
  [CHAIN_IDS.UNICHAIN_TESTNET]: import.meta.env.VITE_FACTORY_ADDRESS_1301,
  [CHAIN_IDS.MOONWALKER]: import.meta.env.VITE_FACTORY_ADDRESS_1828369849
};

const CHAIN_FEES = {
  [CHAIN_IDS.SEPOLIA]: "0.01",    // Sepolia fee in ETH
  [CHAIN_IDS.POLYGON]: "1",       // Polygon fee in POL
  [CHAIN_IDS.UNICHAIN_MAINNET]: "0.01",   // Unichain Mainnet fee in ETH
  [CHAIN_IDS.UNICHAIN_TESTNET]: "0.01",   // Unichain Testnet fee in ETH
  [CHAIN_IDS.MOONWALKER]: "369"   // Moonwalker fee in ZERO
};

// Add meme messages
const leftMemeMessages = [
    "Remember when DOGE was just a joke? 🐕",
    "Early PEPE holders are millionaires! 🐸",
    "From Reddit memes to crypto dreams... 🚀"
];

const rightMemeMessages = [
    "Create your meme token, become legendary! 👑",
    "Your memes + Web3 = The next big thing! 💫",
    "Join the meme revolution! 🌟"
];

// Add MemeTypewriter component
const MemeTypewriter = ({ messages, delay = 2000 }) => {
  const [displayedTexts, setDisplayedTexts] = useState(messages.map(() => ''));
  const [isTyping, setIsTyping] = useState(messages.map(() => true));

  useEffect(() => {
    let timeouts = [];

    messages.forEach((message, index) => {
      if (isTyping[index] && displayedTexts[index].length < message.length) {
        const timeout = setTimeout(() => {
          setDisplayedTexts(prev => {
            const newTexts = [...prev];
            newTexts[index] = message.substring(0, displayedTexts[index].length + 1);
            return newTexts;
          });
        }, 15 + (index * 100)); // Reduced typing speed and delay between messages
        timeouts.push(timeout);
      } else if (isTyping[index]) {
        setIsTyping(prev => {
          const newTyping = [...prev];
          newTyping[index] = false;
          return newTyping;
        });
      }
    });

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [displayedTexts, isTyping, messages]);

  return (
    <div className="bg-white dark:bg-[#1a1b1f] p-4 rounded-xl shadow-lg border-2 border-[#00ffbd] relative min-h-[200px]">
      <div className="absolute w-3 h-3 bg-white dark:bg-[#1a1b1f] transform rotate-45 -bottom-1.5 left-6 border-r-2 border-b-2 border-[#00ffbd]"></div>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`text-base font-medium text-gray-900 dark:text-white transition-opacity duration-300 ${
              displayedTexts[index].length > 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {displayedTexts[index]}
            {isTyping[index] && <span className="animate-pulse">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function MemeFactory() {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { addDeployment } = useDeployments();
  const [activeSection, setActiveSection] = useState('create');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState(null);
  const [progressError, setProgressError] = useState(null);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showLiquidityModal, setShowLiquidityModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [toggles, setToggles] = useState({
    marketingFee: false,
    liquidityFee: false,
    burnFee: false,
    treasuryFee: false,
    devFee: false,
    buyFees: false,
    sellFees: false,
    enableBlacklist: false,
    enableSnapshot: false
  });

  // Initialize with default values
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    description: '',
    // Fee addresses
    marketingAddress: '',
    treasuryAddress: '',
    devAddress: '',
    liquidityAddress: '',
    // Fee values
    burnFee: 20,
    treasuryFee: 20,
    devFee: 20,
    marketingFee: 20,
    liquidityFee: 20,
    // Buy/Sell fees
    buyFees: 5,
    sellFees: 5,
    // Router
    router: '',
    // Logo URL - adding default value
    logoURI: 'https://placehold.co/400x400',
    // Other settings
    enableBlacklist: false,
    enableSnapshot: false
  });

  // Add new state for pre-launch modal and liquidity tracking
  const [showPreLaunchModal, setShowPreLaunchModal] = useState(false);
  const [liquidityAdded, setLiquidityAdded] = useState(false);

  // Add new state for form steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Add new state for snapshot modal
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // Load saved state in useEffect
  useEffect(() => {
    const loadState = () => {
      try {
        const savedState = localStorage.getItem('memeFactoryState');
        if (savedState) {
          const { deployedTokenAddress: savedAddress, formData: savedFormData, liquidityAdded: savedLiquidityAdded, timestamp } = JSON.parse(savedState);
          // Only restore state if it's less than 24 hours old
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            setDeployedTokenAddress(savedAddress);
            if (savedAddress && !savedLiquidityAdded) {
              setShowLiquidityModal(true);
            }
            setFormData(savedFormData);
            setLiquidityAdded(savedLiquidityAdded || false);
          }
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    };

    loadState();
  }, []);

  // Save state when important values change
  useEffect(() => {
    if (deployedTokenAddress || formData.name || formData.symbol || formData.totalSupply) {
      // Create a copy of formData without the logo file
      const formDataToSave = { ...formData };
      delete formDataToSave.logo;
      
      localStorage.setItem('memeFactoryState', JSON.stringify({
        deployedTokenAddress,
        formData: formDataToSave,
        liquidityAdded,
        timestamp: Date.now()
      }));
    }
  }, [deployedTokenAddress, formData, liquidityAdded]);

  // Clear saved state after successful liquidity addition
  const clearSavedState = () => {
    localStorage.removeItem('memeFactoryState');
    setFormData({
      name: '',
      symbol: '',
      totalSupply: '',
      description: '',
      // Buy/Sell fee toggles and values
      buyFeesEnabled: false,
      sellFeesEnabled: false,
      buyFees: 0,
      sellFees: 0,
      // Fee toggles
      devFeeEnabled: false,
      marketingFeeEnabled: false,
      liquidityFeeEnabled: false,
      burnFeeEnabled: false,
      treasuryFeeEnabled: false,
      // Fee values
      devFee: 0,
      marketingFee: 0,
      liquidityFee: 0,
      burnFee: 0,
      treasuryFee: 0,
      // Fee addresses
      devAddress: '',
      marketingAddress: '',
      liquidityAddress: '',
      treasuryAddress: '',
      // Other settings
      router: '',
      customHeader: '',
      enableBlacklist: false,
      enableSnapshot: false,
      enableAutoSwap: false,
      swapTokensAtAmount: '',
      enableTradingControls: false,
      maxTxPercent: 2,
      maxWalletPercent: 4
    });
    setDeployedTokenAddress(null);
  };

  // Modify handleLiquiditySuccess
  const handleLiquiditySuccess = () => {
    setLiquidityAdded(true);
    clearSavedState();
    setShowLiquidityModal(false);
    toast.success('Process completed successfully!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'initialLiquidity.tokenAmount') {
      setFormData(prev => ({
        ...prev,
        initialLiquidity: {
          ...prev.initialLiquidity,
          tokenAmount: value
        }
      }));
    } else if (name === 'initialLiquidity.nativeAmount') {
      setFormData(prev => ({
        ...prev,
        initialLiquidity: {
          ...prev.initialLiquidity,
          nativeAmount: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleToggle = (toggleName) => {
    setFormData(prev => {
        const newState = { ...prev };

        switch (toggleName) {
            case 'marketingFeeEnabled':
                newState.marketingFee = newState.marketingFee > 0 ? 0 : 20;
                break;
            case 'liquidityFeeEnabled':
                newState.liquidityFee = newState.liquidityFee > 0 ? 0 : 20;
                break;
            case 'burnFeeEnabled':
                newState.burnFee = newState.burnFee > 0 ? 0 : 20;
                break;
            case 'treasuryFeeEnabled':
                newState.treasuryFee = newState.treasuryFee > 0 ? 0 : 20;
                break;
            case 'devFeeEnabled':
                newState.devFee = newState.devFee > 0 ? 0 : 20;
                break;
            case 'buyFeesEnabled':
                newState.buyFeesEnabled = !newState.buyFeesEnabled;
                newState.buyFees = newState.buyFeesEnabled ? 6 : 0;
                break;
            case 'sellFeesEnabled':
                newState.sellFeesEnabled = !newState.sellFeesEnabled;
                newState.sellFees = newState.sellFeesEnabled ? 6 : 0;
                break;
            case 'enableBlacklist':
                newState.enableBlacklist = !newState.enableBlacklist;
                break;
            case 'enableSnapshot':
                newState.enableSnapshot = !newState.enableSnapshot;
                break;
            case 'enableCustomHeader':
                newState.enableCustomHeader = !newState.enableCustomHeader;
                if (!newState.enableCustomHeader) {
                    newState.customHeader = '';
                }
                break;
        }
        
        return newState;
    });

    // Update toggles state to keep UI in sync
    setToggles(prev => ({
        ...prev,
        [toggleName]: !prev[toggleName]
    }));
};

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Debug log
      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        isFile: file instanceof File,
        isBlob: file instanceof Blob
      });

      // Create a new File object to ensure proper type
      const logoFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });

      setFormData(prev => ({ ...prev, logo: logoFile }));
      setPreviewLogo(URL.createObjectURL(logoFile));
    }
  };

  const handleSuccess = async (tokenAddress, tokenData) => {
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

      const chainName = getChainName(chain.id);
      const deploymentData = {
        name: tokenData.name,
        symbol: tokenData.symbol,
        address: tokenAddress,
        chainId: chain.id,
        chainName,
        description: formData.description,
        totalSupply: ethers.formatUnits(tokenData.supply, tokenData.decimals),
        timestamp: Date.now(),
        creatorAddress: account.toLowerCase(),
        network: chainName
      };

      console.log('Saving token deployment with data:', deploymentData);

      try {
        await addDeployment(deploymentData);
      console.log('Token deployment saved successfully');
      } catch (saveError) {
        // Log the error but continue with the flow
        console.error('Error saving deployment to Firebase:', saveError);
        toast.warning('Token created successfully, but there was an error saving deployment data');
      }

      // Initialize token transfer tracking
      try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Initializing transfer tracking for token:', tokenAddress);
      await trackTokenTransfers(tokenAddress, provider);
      console.log('Transfer tracking initialized');
      } catch (trackingError) {
        // Log the error but continue with the flow
        console.error('Error initializing transfer tracking:', trackingError);
      }

      // Clear any existing toasts
      toast.dismiss();
      
      setDeployedTokenAddress(tokenAddress);
      setProgressStep('completed');
      setShowConfetti(true);

      // Show liquidity modal after a delay
      setTimeout(() => {
        setShowProgressModal(false);
        setShowLiquidityModal(true);
      }, 3000);

    } catch (error) {
      console.error('Error in handleSuccess:', error);
      // Still show success since token was created
      setDeployedTokenAddress(tokenAddress);
      setProgressStep('completed');
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowProgressModal(false);
        setShowLiquidityModal(true);
      }, 3000);
    }
  };

  // Modify handleSubmit to show pre-launch modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPreLaunchModal(true);
  };

  // Add actual token creation function
  const createToken = async () => {
    setShowPreLaunchModal(false);
    try {
      setProgressStep('deploying');
      setShowProgressModal(true);

      // Check if wallet is connected
      if (!window.ethereum) {
        throw new Error('Please connect your wallet first');
      }

      // Check if chain is supported
      if (!chain?.id) {
        throw new Error('Please connect to a supported network');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factoryAddress = getFactoryAddress();
      const fee = getFee();

      if (!factoryAddress) {
        throw new Error('Factory address not configured for this network');
      }

      if (!fee) {
        throw new Error('Network fee not configured for this network');
      }

      // Get DEX configuration for current chain
      const dexConfig = dexConfigs[chain.id];
      if (!dexConfig || !dexConfig.isActive) {
        throw new Error('No active DEX configured for this network');
      }

      const factory = new ethers.Contract(
        factoryAddress,
        TokenFactoryABI.abi,
        signer
      );

      // Safely convert total supply to BigInt
      let totalSupplyBN;
      try {
        totalSupplyBN = BigInt(formData.totalSupply);
      } catch (error) {
        throw new Error('Invalid total supply value');
      }

      // Safely convert fee values to BigInt
      const safeConvertToBigInt = (value) => {
        try {
          // Input is in percentage (e.g., 20 for 20%)
          const basisPoints = parseFloat(value || 0);
          return BigInt(Math.floor(basisPoints));
        } catch {
          return BigInt(0);
        }
      };

      // Convert percentage to basis points (1% = 100 basis points)
      const swapTokensAtPercent = parseFloat(formData.swapTokensAtAmount) || 0.1; // Default to 0.1% if not set
      const swapTokensAtBasisPoints = BigInt(Math.floor(swapTokensAtPercent * 100)); // Convert percentage to basis points

      // Prepare parameters for token creation exactly matching the MemeTokenParams struct in TokenFactory.sol
      const params = {
        name: formData.name,
        symbol: formData.symbol,
        totalSupply: totalSupplyBN,
        marketingWallet: formData.marketingAddress || account,
        treasuryAddress: formData.treasuryAddress || account,
        devAddress: formData.devAddress || account,
        liquidityAddress: formData.liquidityAddress || account,
        burnFee: safeConvertToBigInt(formData.burnFee),
        treasuryFee: safeConvertToBigInt(formData.treasuryFee),
        devFee: safeConvertToBigInt(formData.devFee),
        marketingFee: safeConvertToBigInt(formData.marketingFee),
        liquidityFee: safeConvertToBigInt(formData.liquidityFee),
        buyFees: safeConvertToBigInt(formData.buyFees),
        sellFees: safeConvertToBigInt(formData.sellFees),
        router: dexConfig.router,
        logoURI: formData.logoURI || 'https://placehold.co/400x400',
        addInitialLiquidity: false,
        initialLiquidityPercent: 0,
        maxTxPercent: formData.maxTxPercent || 2,  // Default to 2% if not set
        maxWalletPercent: formData.maxWalletPercent || 4,  // Default to 4% if not set
        swapTokensAtPercent: swapTokensAtBasisPoints  // Now using basis points
      };

      // Validate that secondary fees total 100%
      const totalSecondaryFees = 
        Number(params.burnFee) + 
        Number(params.treasuryFee) + 
        Number(params.devFee) + 
        Number(params.marketingFee) + 
        Number(params.liquidityFee);

      if (totalSecondaryFees !== 100) {
        throw new Error(`Secondary fees must total 100%. Current total: ${totalSecondaryFees}%`);
      }

      // Create token with parameters
      const tx = await factory.createMemeToken(params, { value: fee });
      const receipt = await tx.wait();

      // Find the TokenCreated event
      const tokenCreatedEvent = receipt.logs.find(log => {
        try {
          const eventSignature = ethers.id(
            'TokenCreated(address,address,string,string,uint8,uint256,string,bool)'
          );
          return log.topics[0] === eventSignature;
        } catch (e) {
          return false;
        }
      });

      if (!tokenCreatedEvent) {
        throw new Error('Token creation event not found in transaction receipt');
      }

      // Parse the event data
      const parsedLog = factory.interface.parseLog({
        topics: tokenCreatedEvent.topics,
        data: tokenCreatedEvent.data
      });

      // Get token data from the event
      const tokenData = {
        name: formData.name,
        symbol: formData.symbol,
        decimals: 18,
        supply: totalSupplyBN * BigInt(10 ** 18), // Add decimals to the supply
      };

      // Get deployed token address from event
      const deployedTokenAddress = parsedLog.args[1];  // token address is the second indexed parameter

      await handleSuccess(deployedTokenAddress, tokenData);

    } catch (error) {
      console.error('Error creating token:', error);
      setProgressStep('error');
      setProgressError(error.message || 'Failed to create token');
      setShowProgressModal(true); // Ensure error is visible
    }
  };

  const features = [
    {
      icon: FaRocket,
      title: 'Direct Fee Distribution',
      description: 'Fees are distributed directly to recipients 📈',
      gradient: 'from-[#FF512F] to-[#DD2476]',
      hoverGradient: 'hover:from-[#FF6B45] hover:to-[#E93A8C]'
    },
    {
      icon: FaMagic,
      title: 'Anti-Bot',
      description: 'Protects against trading bots and snipers 🛡️',
      gradient: 'from-[#4776E6] to-[#8E54E9]',
      hoverGradient: 'hover:from-[#5A8AFF] hover:to-[#A169FF]'
    },
    {
      icon: FaFire,
      title: 'Auto-Burn',
      description: 'Burns tokens automatically with each trade 🔥',
      gradient: 'from-[#FF416C] to-[#FF4B2B]',
      hoverGradient: 'hover:from-[#FF5A82] hover:to-[#FF6341]'
    }
  ];

  const tooltips = {
    name: "Choose a memorable name for your token. This will be displayed on DEXs and wallets.",
    symbol: "A short ticker symbol for your token (2-6 characters). This will be your token's trading symbol.",
    totalSupply: "The total number of tokens to create. Consider a supply that matches your tokenomics strategy.",
    marketingWallet: "The wallet address that will receive marketing fees for project development. This wallet will be responsible for growing the project.",
    marketingFee: "Percentage of each trade sent to marketing wallet for project development (0-10%).",
    liquidityFee: "Percentage of each trade auto-converted to liquidity (0-10%). Helps maintain price stability.",
    burnFee: "Percentage of each trade that's permanently burned (0-10%). Creates deflationary pressure.",
    maxWallet: "Maximum percentage of total supply any wallet can hold. Prevents large holders from dominating.",
    maxTx: "Maximum percentage of total supply that can be traded in one transaction. Prevents large dumps.",
    antiBot: {
      title: "Anti-Bot Protection",
      description: "Protects your launch against trading bots and snipers",
      effects: [
        "Enables transaction limits during launch",
        "Adds cooldown between trades",
        "Allows blacklisting of bot addresses",
        "Restricts contract interactions"
      ]
    },
    autoLiquidity: {
      title: "Auto-Liquidity",
      description: "Automatically manages liquidity pool",
      effects: [
        "Collects fee from trades",
        "Auto-converts to liquidity",
        "Locks LP tokens",
        "Maintains price stability"
      ]
    },
    autoBurn: {
      title: "Auto-Burn",
      description: "Automatically burns tokens with each transaction",
      effects: [
        "Creates deflationary pressure",
        "Reduces total supply over time",
        "Rewards holders",
        "Increases token value"
      ]
    },
    maxLimits: {
      title: "Max Limits",
      description: "Implements whale protection mechanisms",
      effects: [
        "Restricts max wallet size",
        "Limits transaction amounts",
        "Prevents price manipulation",
        "Protects smaller holders"
      ]
    },
    initialLiquidity: {
      title: "Initial Liquidity",
      description: "Set up your token's initial trading pool",
      details: [
        "Amount of tokens for initial liquidity",
        "Amount of ETH/MATIC to add",
        "Initial price setting",
        "Liquidity lock period"
      ]
    }
  };

  const featureDetails = {
    autoLiquidity: {
      title: "Auto-Liquidity",
      description: "Automatically adds liquidity to keep trading smooth 📈",
      details: [
        "Collects a fee from each trade",
        "Converts half to POL",
        "Adds both halves as liquidity",
        "LP tokens locked forever"
      ]
    },
    antiBot: {
      title: "Anti-Bot Protection",
      description: "Protects against trading bots and snipers 🛡️",
      details: [
        "Blacklist system for bot addresses",
        "Transaction limits during launch",
        "Cooldown between trades",
        "Smart contract interaction limits"
      ]
    },
    burn: {
      title: "Auto-Burn",
      description: "Burns tokens automatically with each trade 🔥",
      details: [
        "Permanent token removal",
        "Increases scarcity over time",
        "Rewards long-term holders",
        "Deflationary mechanism"
      ]
    },
    maxLimits: {
      title: "Max Limits",
      description: "Prevents whales from dominating 🐋",
      details: [
        "Maximum wallet size limit",
        "Maximum transaction amount",
        "Anti-whale mechanisms",
        "Fair distribution focus"
      ]
    }
  };

  const getNetworkCurrency = () => {
    const networkId = window.ethereum?.networkVersion;
    switch (networkId) {
      case '137': return 'MATIC';
      case '1301': return 'ETH';
      case '1828369849': return 'POL';
      default: return 'MATIC';
    }
  };

  useEffect(() => {
    const updateFormBasedOnToggles = () => {
      setFormData(prev => {
        const newState = { ...prev };
        
        // Disable fees if corresponding features are off
        if (!newState.autoLiquidity) {
          newState.liquidityFee = 0;
        }
        if (!newState.autoBurn) {
          newState.burnFee = 0;
        }
        if (!newState.maxLimits) {
          newState.maxWalletPercent = 100;
          newState.maxTxPercent = 100;
        }
        
        return newState;
      });
    };
    
    updateFormBasedOnToggles();
  }, [formData.autoLiquidity, formData.autoBurn, formData.maxLimits]);

  // Add getFactoryAddress function
  const getFactoryAddress = () => {
    if (!chain?.id) return null;
    return FACTORY_ADDRESSES[chain.id];
  };

  // Add getFee function
  const getFee = () => {
    if (!chain?.id) return null;
    const fee = CHAIN_FEES[chain.id];
    if (!fee) return null;
    return ethers.parseEther(fee);
  };

  // Add step navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Add router selection based on chain
  useEffect(() => {
    if (chain?.id) {
        const router = dexConfigs[chain.id]?.router;
        setFormData(prev => ({
            ...prev,
            router: router || ''
        }));
    }
  }, [chain?.id]);

  // Add PreLaunchModal component before the return statement
  return (
    <div className="container mx-auto px-4 py-8 mt-8 relative">
      {/* Left meme conversation bubble */}
      <div className="absolute left-[2%] top-16 w-80">
        <MemeTypewriter messages={leftMemeMessages} />
      </div>

      {/* Right meme conversation bubble */}
      <div className="absolute right-[2%] top-16 w-80">
        <MemeTypewriter messages={rightMemeMessages} />
      </div>

          {/* Hero Section */}
          <div className="text-center mb-8 pt-32">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img src="/pepe.jpeg" alt="Pepe" className="w-16 h-16 rounded-full object-cover animate-bounce" style={{ animationDelay: '0.2s' }} />
              <h1 className="meme-title text-5xl text-[#00ffbd]">MEME FACTORY</h1>
              <img src="/pepe.jpeg" alt="Pepe" className="w-16 h-16 rounded-full object-cover animate-bounce" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create your own meme token with advanced features and join the meme revolution!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Anti-Bot Card */}
            <div
              onClick={() => handleToggle('antiBotEnabled')}
              className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                formData.antiBotEnabled 
                  ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20' 
                  : 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-blue-400/20 dark:to-purple-500/20 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-blue-400/30 dark:hover:to-purple-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.antiBotEnabled ? 'bg-white/20' : 'bg-indigo-500/10 dark:bg-white/10'}`}>
                  <ShieldCheckIcon className={`w-6 h-6 ${formData.antiBotEnabled ? 'text-white' : 'text-indigo-500 dark:text-white'}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${formData.antiBotEnabled ? 'text-white' : 'text-indigo-600 dark:text-white'}`}>Anti-Bot</h3>
                  <p className={`text-sm ${formData.antiBotEnabled ? 'text-white/80' : 'text-indigo-500 dark:text-white/80'}`}>
                    Protects against trading bots and snipers 🛡️
                  </p>
                </div>
              </div>
            </div>

            {/* Token Snapshots Card */}
            <div
              onClick={() => setIsSnapshotModalOpen(true)}
              className="relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-pink-500 dark:to-red-600 hover:from-rose-100 hover:to-pink-100 dark:hover:from-pink-600 dark:hover:to-red-700 shadow-lg shadow-pink-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 dark:bg-white/10">
                  <HiOutlineCamera className="w-6 h-6 text-rose-500 dark:text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-rose-600 dark:text-white">Token Snapshots</h3>
                  <p className="text-sm text-rose-500 dark:text-white/80">Take and view holder snapshots 📸</p>
                </div>
              </div>
            </div>

            {/* Auto-Burn Card */}
            <div
              onClick={() => handleToggle('burnEnabled')}
              className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                formData.burnEnabled 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/20' 
                  : 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-pink-400/20 dark:to-red-500/20 hover:from-orange-100 hover:to-red-100 dark:hover:from-pink-400/30 dark:hover:to-red-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.burnEnabled ? 'bg-white/20' : 'bg-orange-500/10 dark:bg-white/10'}`}>
                  <FireIcon className={`w-6 h-6 ${formData.burnEnabled ? 'text-white' : 'text-orange-500 dark:text-white'}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${formData.burnEnabled ? 'text-white' : 'text-orange-600 dark:text-white'}`}>Auto-Burn</h3>
                  <p className={`text-sm ${formData.burnEnabled ? 'text-white/80' : 'text-orange-500 dark:text-white/80'}`}>
                    Burns tokens automatically with each trade 🔥
                  </p>
                </div>
              </div>
            </div>

            {/* Max Limits Card */}
            <div
              onClick={() => handleToggle('maxLimitsEnabled')}
              className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                formData.maxLimitsEnabled 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-green-400/20 dark:to-blue-500/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-green-400/30 dark:hover:to-blue-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formData.maxLimitsEnabled ? 'bg-white/20' : 'bg-emerald-500/10 dark:bg-white/10'}`}>
                  <LockClosedIcon className={`w-6 h-6 ${formData.maxLimitsEnabled ? 'text-white' : 'text-emerald-500 dark:text-white'}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${formData.maxLimitsEnabled ? 'text-white' : 'text-emerald-600 dark:text-white'}`}>Max Limits</h3>
                  <p className={`text-sm ${formData.maxLimitsEnabled ? 'text-white/80' : 'text-emerald-500 dark:text-white/80'}`}>
                    Prevents whales from dominating 💧
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid - Create Token and Token Info side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Create Token Section */}
            <div>
              {!account ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-[#1a1b1f] rounded-xl p-8 text-center border border-gray-200 dark:border-gray-800 transition-colors duration-200"
                >
                  <div className="mb-6">
                    <BiWallet className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-200">Connect Your Wallet</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
                    Connect your wallet to start creating your meme token
                  </p>
                  <button
                    onClick={openConnectModal}
                    className="px-8 py-3 bg-[#00ffbd] text-black rounded-xl font-bold hover:bg-[#00e6a9] transition-all duration-200 hover:scale-105"
                  >
                    Connect Wallet
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-[#1a1b1f] rounded-xl p-8 shadow-2xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-center mb-8">
                    <h2 className="meme-title text-3xl mb-4 text-[#00ffbd]">Create Your Meme Token</h2>
                    <p className="text-gray-700 dark:text-gray-400 text-lg">
                      Fill out the details below to launch your meme token
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          currentStep === step ? "bg-[#00ffbd] text-black" :
                          currentStep > step ? "bg-[#00ffbd]/20 text-[#00ffbd]" :
                          "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        )}>
                          {step}
                            </div>
                        {step < 4 && (
                          <div className={clsx(
                            "w-24 h-1 mx-2",
                            currentStep > step ? "bg-[#00ffbd]" : "bg-gray-200 dark:bg-gray-700"
                          )} />
                          )}
                        </div>
                    ))}
                    </div>

                  {/* Form */}
                  <TokenCreationForm
                    currentStep={currentStep}
                    formData={formData}
                    handleChange={handleChange}
                    handleToggle={handleToggle}
                  />

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-6">
                    {currentStep > 1 && (
                      <button
                        onClick={prevStep}
                        className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        Previous
                      </button>
                    )}
                    {currentStep < totalSteps ? (
                      <button
                        onClick={nextStep}
                        className="px-6 py-2 text-sm font-medium rounded-lg bg-[#00ffbd] text-black hover:bg-[#00e6a9] transition-colors"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPreLaunchModal(true)}
                        className="px-6 py-2 text-sm font-medium rounded-lg bg-[#00ffbd] text-black hover:bg-[#00e6a9] transition-colors"
                      >
                        Create Token
                      </button>
                    )}
                    </div>
                </motion.div>
              )}
            </div>

            {/* Token Info Section - Modified to prevent stretching */}
            <div className="h-fit bg-[#1a1b1f] rounded-xl">
              <TokenInfo />
            </div>
          </div>

        {/* Meme Culture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <h2 className="meme-title text-2xl mb-6 text-[#00ffbd]">
            JOIN THE MEME REVOLUTION! 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1a1b1f] p-6 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:border-[#00ffbd] group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🌟</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-200">Community First</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Build a strong meme community</p>
            </div>
            <div className="bg-white dark:bg-[#1a1b1f] p-6 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:border-[#00ffbd] group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">💎</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-200">HODL Together</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Create diamond hands community</p>
            </div>
            <div className="bg-white dark:bg-[#1a1b1f] p-6 rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:border-[#00ffbd] group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">🚀</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-200">To The Moon</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Sky is not the limit</p>
            </div>
          </div>
        </motion.div>

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
          formData={formData}
          setShowLiquidityModal={setShowLiquidityModal}
        />

        {/* Add Liquidity Modal */}
        <LiquidityModal
          isOpen={showLiquidityModal}
          onClose={() => setShowLiquidityModal(false)}
          tokenAddress={deployedTokenAddress}
          tokenName={formData.name}
          tokenSymbol={formData.symbol}
          totalSupply={formData.totalSupply}
          onSuccess={handleLiquiditySuccess}
        />

        {/* Add Star Rating Modal */}
        <StarRatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onRate={(rating) => {
            console.log('User rated meme token creation:', rating);
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

        {/* Add PreLaunchModal */}
        <PreLaunchModal
          isOpen={showPreLaunchModal}
          onClose={() => setShowPreLaunchModal(false)}
          onConfirm={createToken}
          chain={chain}
        />

        {/* Replace Modal wrapper with direct SnapshotViewer */}
        {isSnapshotModalOpen && (
          <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/25 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full">
                <SnapshotViewer onClose={() => setIsSnapshotModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

// Update FeatureToggle component
const FeatureToggle = ({ label, description, enabled, onToggle, children }) => {
  return (
    <div className="relative flex flex-col space-y-3 p-4 rounded-xl bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 hover:border-[#00ffbd]/20 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="text-gray-900 dark:text-white text-base font-medium">{label}</label>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        <div className="flex items-center ml-4">
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00ffbd] focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              enabled ? 'bg-[#00ffbd]' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-all duration-200 ease-in-out ${
                enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              <span
                className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                  enabled ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <svg className="h-3 w-3 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                  enabled ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <svg className="h-3 w-3 text-[#00ffbd]" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
      {enabled && children && (
        <div className="mt-4 pl-4 border-l-2 border-[#00ffbd]/20">
          {children}
        </div>
      )}
    </div>
  );
};

// Progress Modal Component
const ProgressModal = ({ isOpen, onClose, currentStep, tokenName, error, deployedAddress, formData, setShowLiquidityModal }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing Transaction', icon: Icons.Preparing },
    { key: 'deploying', label: 'Creating Meme Token', icon: Icons.CreatingToken },
    { key: 'completed', label: 'Token Created Successfully', icon: Icons.Completed }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const isError = Boolean(error);

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
                  {isError ? 'Error Creating Token' : 'Creating Meme Token'}
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
                          {isActive && step.key === 'deploying' && !isError && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Creating meme token {tokenName}
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
                      <p className="text-[#00ffbd] font-medium text-lg">Meme token created successfully! 🎉</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Your meme token has been deployed and is ready for use</p>
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
                            {formData?.initialLiquidity?.enabled && (
                              <button
                                onClick={() => {
                                  onClose();
                                  setShowLiquidityModal(true);
                                }}
                                className="mt-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#00ffbd] text-black hover:bg-[#00e6a9] transition-colors"
                              >
                                Add Initial Liquidity
                              </button>
                            )}
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
  const [hover, setHover] = useState(0);

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white text-center mb-4"
                >
                  Rate Your Experience
                </Dialog.Title>

                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <button
                        key={ratingValue}
                        className={`text-3xl focus:outline-none transition-colors ${
                          ratingValue <= (hover || rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        onClick={() => {
                          setRating(ratingValue);
                          onRate(ratingValue);
                          setTimeout(onClose, 500);
                        }}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <FaStar />
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  How was your token creation experience?
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Skip
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Add new LiquidityModal component before the StarRatingModal
const LiquidityModal = ({ isOpen, onClose, tokenAddress, tokenName, tokenSymbol, totalSupply, onSuccess }) => {
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [poolAddress, setPoolAddress] = useState(null);
  const { chain } = useNetwork();

  // Calculate price based on token amount and ETH amount
  const calculatePrice = () => {
    if (!tokenAmount || !liquidityAmount || tokenAmount === '0' || liquidityAmount === '0') {
      return '0';
    }
    try {
      const price = Number(liquidityAmount) / Number(tokenAmount);
      return price.toFixed(8);
    } catch (error) {
      return '0';
    }
  };

  // Handle adding liquidity
  const handleAddLiquidity = async () => {
    if (!tokenAmount || !liquidityAmount) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsAdding(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token = new ethers.Contract(tokenAddress, MemeTokenABI.abi, signer);
      
      // Get router address first
      const routerAddress = await token.uniswapV2Router();
      const router = new ethers.Contract(
        routerAddress,
        ['function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)'],
        signer
      );

      // Convert amounts to wei
      const tokenAmountWei = ethers.parseUnits(tokenAmount, 18);
      const ethAmountWei = ethers.parseEther(liquidityAmount);

      // Check token balance
      const balance = await token.balanceOf(signer.address);
      if (balance < tokenAmountWei) {
        throw new Error('Insufficient token balance');
      }

      // Check current allowance
      const currentAllowance = await token.allowance(signer.address, routerAddress);
      if (currentAllowance < tokenAmountWei) {
        // Approve router to spend tokens with a 5-minute buffer for mining
      const approveTx = await token.approve(routerAddress, tokenAmountWei);
        console.log('Waiting for approval transaction to be mined...');
      await approveTx.wait();
        console.log('Approval transaction mined');
        
        // Add a small delay after approval to ensure it's propagated
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Add liquidity with a 20-minute deadline
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      console.log('Adding liquidity...');
      const addLiquidityTx = await router.addLiquidityETH(
        token.target,
        tokenAmountWei,
        0, // slippage is unavoidable
        0, // slippage is unavoidable
        signer.address,
        deadline,
        { value: ethAmountWei }
      );
      
      console.log('Waiting for liquidity transaction to be mined...');
      await addLiquidityTx.wait();
      console.log('Liquidity added successfully');

      setIsSuccess(true);
      onSuccess();
    } catch (err) {
      console.error('Error adding liquidity:', err);
      setError(err.message || 'Failed to add liquidity');
    } finally {
      setIsAdding(false);
    }
  };

  // Get pool address on mount
  useEffect(() => {
    const getPoolAddress = async () => {
      try {
        if (!tokenAddress) return;
        
        // Add a small delay before first attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const token = new ethers.Contract(tokenAddress, MemeTokenABI.abi, provider);
        
        // Try to get the router first
        const router = await token.uniswapV2Router();
        console.log('Router address:', router);
        
        // Add retry logic for getting pair address
        let retries = 3;
        let pool = null;
        
        while (retries > 0 && !pool) {
          try {
            pool = await token.uniswapV2Pair();
            if (pool && pool !== '0x0000000000000000000000000000000000000000') {
              console.log('Pool address found:', pool);
              setPoolAddress(pool);
              break;
            }
          } catch (err) {
            console.log(`Attempt ${4 - retries} failed, retrying...`);
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        if (!pool || pool === '0x0000000000000000000000000000000000000000') {
          console.log('Pool address not found after retries');
        }
      } catch (error) {
        console.error('Error getting pool address:', error);
      }
    };
    getPoolAddress();
  }, [tokenAddress]);

  // Get DEX info based on chain
  const getDexInfo = () => {
    if (!chain?.id) return null;
    return DEX_TRADING_URLS[chain.id] || {
      name: 'Unknown DEX',
      getTradeUrl: () => '#'
    };
  };

  const dexInfo = getDexInfo();

  // Add copy to clipboard function
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
        {/* ... existing Transition.Child for backdrop ... */}

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
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add Initial Liquidity
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p>{tokenName} ({tokenSymbol})</p>
                    <div className="flex items-center gap-2">
                      <img src={DEX_IMAGES[dexInfo?.name || 'QuickSwap']} alt={dexInfo?.name || 'QuickSwap'} className="w-5 h-5" />
                      <span>{dexInfo?.name || 'QuickSwap'} on {dexInfo?.network || 'Unknown'}</span>
                    </div>
                  </div>
                </Dialog.Title>

                {/* Show pool information */}
                {poolAddress && (
                  <div className="mb-6 bg-gray-50 dark:bg-[#2d2f36] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Liquidity Pool Created
                    </h4>
                    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-[#1a1b1f] rounded-lg">
                      <code className="text-xs text-gray-800 dark:text-gray-200 flex-1 break-all">
                        {poolAddress}
                      </code>
                      <button
                        onClick={() => copyToClipboard(poolAddress)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                        title="Copy pool address"
                      >
                        <BiCopy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      The liquidity pool has been automatically created. Add liquidity below to enable trading.
                    </p>
                  </div>
                )}

                {!isSuccess ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                          Token Amount
                        </label>
                        <input
                          type="text"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className="w-full bg-white dark:bg-[#2d2f36] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                          placeholder={totalSupply ? `Max: ${ethers.formatUnits(totalSupply, 18)}` : 'Enter token amount'}
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                          {chain?.nativeCurrency?.symbol || 'ETH'} Amount
                        </label>
                        <input
                          type="text"
                          value={liquidityAmount}
                          onChange={(e) => setLiquidityAmount(e.target.value)}
                          className="w-full bg-white dark:bg-[#2d2f36] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                          placeholder={`e.g., 0.1 ${chain?.nativeCurrency?.symbol || 'ETH'}`}
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-[#2d2f36] rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Initial Token Price</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {calculatePrice()} {chain?.nativeCurrency?.symbol || 'ETH'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">per token</span>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-sm text-red-500">{error}</p>
                        </div>
                      )}

                      <div className="flex justify-end gap-4">
                        <button
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          Cancel
          </button>
                        <button
                          onClick={handleAddLiquidity}
                          disabled={isAdding}
                          className={clsx(
                            'px-4 py-2 text-sm font-medium rounded-lg',
                            'bg-[#00ffbd] text-black',
                            'hover:bg-[#00e6a9] transition-colors',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                          )}
                        >
                          {isAdding ? (
                            <div className="flex items-center gap-2">
                              <AiOutlineLoading3Quarters className="animate-spin" />
                              Adding Liquidity...
        </div>
                          ) : (
                            'Add Liquidity'
                          )}
                        </button>
      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#00ffbd]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BiCheck className="w-10 h-10 text-[#00ffbd]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Liquidity Added Successfully!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your token is now ready for trading on {dexInfo.name}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#2d2f36] rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Start Trading
                      </h4>
                      <a
                        href={dexInfo.getTradeUrl(tokenAddress)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#00ffbd] text-black rounded-lg hover:bg-[#00e6a9] transition-colors"
                      >
                        <BiCoin className="w-5 h-5" />
                        Trade on {dexInfo.name}
                      </a>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        Close
                      </button>
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

// Add PreLaunchModal component before the return statement
const PreLaunchModal = ({ isOpen, onClose, onConfirm, chain }) => {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Ready to Launch Your Meme Token? 🚀
                </Dialog.Title>

                <div className="space-y-4">
                  <div className="text-gray-600 dark:text-gray-400">
                    <p className="mb-3">Here's what will happen next:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Your token will be created on the blockchain</li>
                      <li>A liquidity pool will be automatically created</li>
                      <li>You'll be prompted to add initial liquidity to enable trading</li>
                    </ol>
                  </div>

                  <div className="bg-[#00ffbd]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Important:</span> After your token is created, you'll need to add liquidity to enable trading. Make sure you have enough {chain?.nativeCurrency?.symbol || 'ETH'} for gas fees and initial liquidity.
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      className="px-6 py-2 text-sm font-medium rounded-lg bg-[#00ffbd] text-black hover:bg-[#00e6a9] transition-colors"
                    >
                      Let's Go! 🚀
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

// Add new form step components after the existing imports
const FormStep = ({ title, description, children, isActive }) => {
  if (!isActive) return null;
  return (
    <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
          {children}
    </div>
  );
};

// Add InfoTooltip component
const InfoTooltip = ({ content }) => (
  <div className="group relative inline-block ml-2">
    <FaInfoCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {content}
    </div>
  </div>
);

const TokenCreationForm = ({ currentStep, formData, handleChange, handleToggle }) => {
  const { chain } = useNetwork();
  const dexInfo = chain?.id ? dexConfigs[chain.id] : null;

  return (
    <>
      <FormStep
        title="Essential Contract Details"
        description="Set up the basic information for your token"
        isActive={currentStep === 1}
      >
        <div className="space-y-6">
          {/* Existing name field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Token Name
              <InfoTooltip content="The name of your token. This will be displayed on DEXs and wallets." />
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Pepe Token"
            />
          </div>

          {/* Add DEX Information field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              DEX Information
              <InfoTooltip content="The decentralized exchange where your token's liquidity pool will be created." />
            </label>
            <div className="p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <img 
                  src={DEX_IMAGES[dexInfo?.name || 'QuickSwap']} 
                  alt={dexInfo?.name} 
                  className="w-6 h-6"
                />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {dexInfo?.name || 'Not Connected'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dexInfo ? `Router: ${dexInfo.router.slice(0, 6)}...${dexInfo.router.slice(-4)}` : 'Please connect wallet and select network'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the existing form fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Token Symbol
                <InfoTooltip content="A short identifier for your token (2-6 characters)" />
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., PEPE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Supply
                <InfoTooltip content="The total number of tokens to create" />
              </label>
              <input
                type="number"
                name="totalSupply"
                value={formData.totalSupply}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., 1000000"
              />
            </div>
          </div>

          <FeatureToggle
            label="Custom Header Message"
            description="Add a custom ASCII art header to your contract"
            enabled={formData.enableCustomHeader}
            onToggle={() => handleToggle('enableCustomHeader')}
          >
            <textarea
              name="customHeader"
              value={formData.customHeader}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white mt-4"
              placeholder="Enter your custom ASCII art header"
              rows={4}
            />
          </FeatureToggle>
        </div>
      </FormStep>

      <FormStep
        title="Fee Configuration"
        description="Configure buy/sell fees and fee distribution"
        isActive={currentStep === 2}
      >
        <div className="space-y-6">
          {/* Buy/Sell Fees Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Buy / Sell Fees</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              These are the main fee switches. If both buy and sell fees are disabled, no fees will be collected regardless of other fee settings below. The fees collected here will be distributed according to the fee structure you define below.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buy Fee Toggle */}
              <FeatureToggle
                label="Buy Fee"
                description="Enable fee collection on buy transactions (enter percentage, e.g. 6 for 6%)"
                enabled={formData.buyFeesEnabled}
                onToggle={() => handleToggle('buyFeesEnabled')}
              >
                {formData.buyFeesEnabled && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="buyFees"
                        value={formData.buyFees}
                        onChange={handleChange}
                        className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter percentage (e.g. 6 for 6%)"
                      />
                      <span className="text-gray-600 dark:text-gray-400">%</span>
                    </div>
        </div>
      )}
              </FeatureToggle>

              {/* Sell Fee Toggle */}
              <FeatureToggle
                label="Sell Fee"
                description="Enable fee collection on sell transactions (enter percentage, e.g. 6 for 6%)"
                enabled={formData.sellFeesEnabled}
                onToggle={() => handleToggle('sellFeesEnabled')}
              >
                {formData.sellFeesEnabled && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="sellFees"
                        value={formData.sellFees}
                        onChange={handleChange}
                        className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter percentage (e.g. 6 for 6%)"
                      />
                      <span className="text-gray-600 dark:text-gray-400">%</span>
    </div>
                  </div>
                )}
              </FeatureToggle>
            </div>
          </div>

          {/* Fees Split Structure - Only show if either buy or sell fees are enabled */}
          {(formData.buyFeesEnabled || formData.sellFeesEnabled) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fees Split Structure</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This section controls how the collected buy/sell fees are distributed. For example, if you set a 5% buy fee above and enable a 60% dev fee and 40% marketing fee here, from that 5% buy fee, 60% of the collected tokens will go to the dev wallet and 40% to the marketing wallet after being swapped to ETH.
              </p>

              <div className="space-y-6">
                {/* Burn Fees - Replacing Tax Fees */}
                <FeatureToggle
                  label="Burn Fees"
                  description="Percentage of collected fees that will be permanently burned (enter percentage, e.g. 20 for 20%)"
                  enabled={formData.burnFee > 0}
                  onToggle={() => handleToggle('burnFeeEnabled')}
                >
                  {formData.burnFee > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="burnFee"
                          value={formData.burnFee}
                          onChange={handleChange}
                          className="flex-1 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter percentage (e.g. 20 for 20%)"
                        />
                        <span className="text-gray-600 dark:text-gray-400">%</span>
                      </div>
                    </div>
                  )}
                </FeatureToggle>

                {/* Dev Fees */}
                <FeatureToggle
                  label="Dev Fees"
                  description="Percentage of collected fees sent to the Dev Wallet (enter percentage, e.g. 20 for 20%)"
                  enabled={formData.devFee > 0}
                  onToggle={() => handleToggle('devFeeEnabled')}
                >
                  {formData.devFee > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <input
                          type="text"
                          name="devAddress"
                          value={formData.devAddress}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Dev recipient address"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="devFee"
                          value={formData.devFee}
                          onChange={handleChange}
                          className="w-32 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter percentage (e.g. 20 for 20%)"
                        />
                        <span className="text-gray-600 dark:text-gray-400">%</span>
                      </div>
                    </div>
                  )}
                </FeatureToggle>

                {/* Marketing Fees */}
                <FeatureToggle
                  label="Marketing Fees"
                  description="Percentage of fees sent to the Marketing Wallet"
                  enabled={formData.marketingFee > 0}
                  onToggle={() => handleToggle('marketingFeeEnabled')}
                >
                  {formData.marketingFee > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <input
                          type="text"
                          name="marketingAddress"
                          value={formData.marketingAddress}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Marketing recipient address"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="marketingFee"
                          value={formData.marketingFee}
                          onChange={handleChange}
                          className="w-32 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                        />
                        <span className="text-gray-600 dark:text-gray-400">%</span>
                      </div>
                    </div>
                  )}
                </FeatureToggle>

                {/* Liquidity Fees */}
                <FeatureToggle
                  label="Liquidity Fees"
                  description="Percentage of fees sent to the Liquidity Wallet"
                  enabled={formData.liquidityFee > 0}
                  onToggle={() => handleToggle('liquidityFeeEnabled')}
                >
                  {formData.liquidityFee > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <input
                          type="text"
                          name="liquidityAddress"
                          value={formData.liquidityAddress}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Liquidity recipient address"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="liquidityFee"
                          value={formData.liquidityFee}
                          onChange={handleChange}
                          className="w-32 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                        />
                        <span className="text-gray-600 dark:text-gray-400">%</span>
                      </div>
                    </div>
                  )}
                </FeatureToggle>

                {/* Treasury Fees */}
                <FeatureToggle
                  label="Treasury Fees"
                  description="Percentage of fees sent to the Treasury Wallet"
                  enabled={formData.treasuryFee > 0}
                  onToggle={() => handleToggle('treasuryFeeEnabled')}
                >
                  {formData.treasuryFee > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <input
                          type="text"
                          name="treasuryAddress"
                          value={formData.treasuryAddress}
                          onChange={handleChange}
                          className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="Treasury recipient address"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          name="treasuryFee"
                          value={formData.treasuryFee}
                          onChange={handleChange}
                          className="w-32 p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                          placeholder="0"
                        />
                        <span className="text-gray-600 dark:text-gray-400">%</span>
                      </div>
                    </div>
                  )}
                </FeatureToggle>
              </div>
            </div>
          )}
        </div>
      </FormStep>

      <FormStep
        title="Advanced Settings"
        description="Configure additional token features"
        isActive={currentStep === 3}
      >
        <div className="space-y-6">
          <FeatureToggle
            label="Blacklist"
            description="Enable address blacklisting functionality"
            enabled={formData.enableBlacklist}
            onToggle={() => handleToggle('enableBlacklist')}
          />

          <FeatureToggle
            label="Snapshot"
            description="Enable token balance snapshot functionality"
            enabled={formData.enableSnapshot}
            onToggle={() => handleToggle('enableSnapshot')}
          />
        </div>
      </FormStep>

      <FormStep
        title="Review & Deploy"
        description="Review your token configuration before deployment"
        isActive={currentStep === 4}
      >
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Token Creation Summary</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Token Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Symbol</p>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.symbol || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Supply</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.totalSupply || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Features Enabled</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.enableBlacklist && (
                    <span className="px-2 py-1 text-xs font-medium bg-[#00ffbd]/10 text-[#00ffbd] rounded-full">
                      Blacklist
                    </span>
                  )}
                  {formData.enableSnapshot && (
                    <span className="px-2 py-1 text-xs font-medium bg-[#00ffbd]/10 text-[#00ffbd] rounded-full">
                      Snapshot
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fee Configuration</p>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Buy Fee: <span className="font-medium">{formData.buyFees}%</span>
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    Sell Fee: <span className="font-medium">{formData.sellFees}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Important Notice</h4>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  Please review all settings carefully before proceeding. Once deployed, the token contract cannot be modified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormStep>
    </>
  );
};

// Update the validation function
const validateForm = () => {
  const errors = [];
  
  // ... existing validations ...

  // Validate swap threshold
  if (formData.autoSwapEnabled) {
    const swapThreshold = parseFloat(formData.swapTokensAtAmount);
    if (isNaN(swapThreshold) || swapThreshold <= 0 || swapThreshold > 100) {
      errors.push('Swap threshold must be between 0 and 100%');
    }
  }

  // ... rest of validations ...

  return errors;
};