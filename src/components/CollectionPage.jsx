import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { FaEthereum, FaDiscord, FaTwitter, FaTelegram } from 'react-icons/fa';
import { BiMinus, BiPlus, BiCopy, BiCheck, BiX, BiWorld } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import TokenIcon from './TokenIcon';
import { NFTCollectionABI } from '../abi/NFTCollection';
import { ethers } from 'ethers';
import { getCollection, updateCollectionMinted, subscribeToCollection, saveMintData, getTokenDeploymentByAddress } from '../services/firebase';
import FuturisticCard from './FuturisticCard';
import { ipfsToHttp } from '../utils/ipfs';
import AnalyticsTabs from './analytics/AnalyticsTabs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { prepareAndUploadMetadata } from '../services/metadata';
import { Dialog, Transition } from '@headlessui/react';
import Confetti from 'react-confetti';
import clsx from 'clsx';
import { motion } from 'framer-motion';


const validateAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (Object.keys(timeLeft).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-2 border border-gray-200 dark:border-gray-800">
          <div className="text-xl font-bold text-[#00ffbd]">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
        </div>
      ))}
    </div>
  );
}

// Add this new countdown component for mint end
function MintEndCountdown({ endDate, infiniteMint }) {
  if (infiniteMint) {
    return null; // Don't show countdown for infinite mint
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const isMintEnded = Object.keys(timeLeft).length === 0;

  return (
    <div className="text-center">
      {!isMintEnded ? (
        <div className="text-sm text-gray-500">
          Mint ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      ) : (
        <div className="text-sm text-red-500">Mint Ended</div>
      )}
    </div>
  );
}

function RemainingMintAmount({ userMintedAmount, maxPerWallet }) {
  const remaining = maxPerWallet - userMintedAmount;
  
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
      You can mint {remaining} more NFT{remaining !== 1 ? 's' : ''}
    </div>
  );
}

// Icons for minting progress modal
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
  UploadingMetadata: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 18V8m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 1s ease-in-out infinite' }} />
        <path d="M8 18h8" strokeLinecap="round" style={{ animation: 'fadeIn 1s ease-in-out infinite', animationDelay: '0.5s' }} />
      </g>
    </svg>
  ),
  Minting: () => (
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
const ProgressModal = ({ isOpen, onClose, currentStep, error }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing Transaction', icon: Icons.Preparing },
    { key: 'uploading', label: 'Preparing Mint', icon: Icons.UploadingMetadata },
    { key: 'minting', label: 'Minting NFT', icon: Icons.Minting },
    { key: 'completed', label: 'Minting Completed', icon: Icons.Completed }
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
                  {isError ? 'Error Minting NFT' : 'Minting NFT'}
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
                  <div className="mt-6 text-center">
                    <p className="text-[#00ffbd] font-medium">NFT minted successfully!</p>
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
                  Rate Your Minting Experience
                </Dialog.Title>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => {
                        setRating(star);
                        onRate(star);
                        setTimeout(onClose, 500);
                      }}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-[#00ffbd]'
                            : 'text-gray-300 dark:text-gray-600'
                        } transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {hoveredRating === 1 && "Could be better"}
                  {hoveredRating === 2 && "It's okay"}
                  {hoveredRating === 3 && "Good"}
                  {hoveredRating === 4 && "Great"}
                  {hoveredRating === 5 && "Excellent!"}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function CollectionPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [mintAmount, setMintAmount] = useState(1);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAddress, setCheckingAddress] = useState('');
  const [isEligible, setIsEligible] = useState(null);
  const [account, setAccount] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [userMintedAmount, setUserMintedAmount] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [provider, setProvider] = useState(null);
  const [whitelistChecked, setWhitelistChecked] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [whitelistEntry, setWhitelistEntry] = useState(null);
  const [paymentTokenInfo, setPaymentTokenInfo] = useState(null);
  const [tokenLogos, setTokenLogos] = useState({});
  const [currentChainId, setCurrentChainId] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState(null);
  const [progressError, setProgressError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add chain ID effect at component level
  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const parsedChainId = parseInt(chainId, 16);
        console.log('Current Chain ID:', parsedChainId);
        console.log('Current Network:', collection?.network);
        setCurrentChainId(parsedChainId);
      }
    };
    getChainId();

    // Listen for chain changes
    const handleChainChanged = (chainId) => {
      setCurrentChainId(parseInt(chainId, 16));
    };
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Load on-chain data when wallet connects
  useEffect(() => {
    if (collection?.contractAddress && account) {
      const loadContractData = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            collection.contractAddress,
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
            provider
          );

          // Get contract data based on type and network
          if (collection.type === 'ERC1155') {
            const [totalMinted, userMinted] = await Promise.all([
              contract.totalSupply(),
              contract.mintedPerWallet(account)
            ]);
            setTotalMinted(Number(totalMinted));
            setUserMintedAmount(Number(userMinted));
          } else {
            // Add higher gas limit for Unichain networks
            const options = collection.network === 'unichain-mainnet' || collection.network === 'unichain' 
              ? { gasLimit: 1000000 }
              : {};
              
            const [totalMinted, userMinted] = await Promise.all([
              contract.totalSupply(options),
              contract.mintedPerWallet(account, options)
            ]);
            setTotalMinted(Number(totalMinted));
            setUserMintedAmount(Number(userMinted));
          }
        } catch (error) {
          console.error('Error loading contract data:', error);
          // Reset user minted amount when there's an error or wallet disconnects
          setUserMintedAmount(0);
        }
      };

      loadContractData();
    } else {
      // Reset states when no wallet is connected
      setUserMintedAmount(0);
    }
  }, [account, collection?.contractAddress]);

  // Add this effect to reset states on disconnect
  useEffect(() => {
    if (!account) {
      setUserMintedAmount(0);
    }
  }, [account]);

  // Calculate progress based on maxSupply from contract
  const progress = maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0;

  // Load collection data
  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        const data = await getCollection(symbol);
        if (!data) {
          toast.error('Collection not found');
          navigate('/');
          return;
        }
        setCollection(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading collection:', error);
        toast.error('Error loading collection data');
      }
    };

    loadCollectionData();
  }, [symbol, navigate]);

  // Check account
  useEffect(() => {
    const checkAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      }
    };

    checkAccount();
  }, []);

  // Add this effect to subscribe to real-time updates
  useEffect(() => {
    if (!symbol) return;
    
    const unsubscribe = subscribeToCollection(symbol, (data) => {
      setCollection(data);
      setTotalMinted(data.totalMinted || 0);
    });

    return () => unsubscribe();
  }, [symbol]);

  // Update maxSupply handling
  useEffect(() => {
    // Initialize maxSupply to 0 if collection is not loaded yet
    if (!collection) {
      setMaxSupply(0);
      return;
    }

    // For Unichain mainnet, Unichain testnet, and Moonwalker, use the collection data directly
    if (collection.network === 'unichain-mainnet' || collection.network === 'unichain' || collection.network === 'moonwalker') {
      setMaxSupply(Number(collection.maxSupply) || 0);
      return;
    }

    // For other networks, try to get from contract
    if (collection.contractAddress) {
      const getMaxSupply = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            collection.contractAddress,
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
            provider
          );

          // Get maxSupply from contract config
          const config = await contract.config();
          setMaxSupply(Number(config.maxSupply) || 0);
        } catch (error) {
          // Fallback to collection data
          setMaxSupply(Number(collection.maxSupply) || 0);
        }
      };

      getMaxSupply();
    } else {
      // Fallback to collection data if no contract address
      setMaxSupply(Number(collection.maxSupply) || 0);
    }
  }, [collection]);

  // Add this useEffect to initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  // Update payment token info handling
  useEffect(() => {
    const fetchPaymentTokenInfo = async () => {
      if (collection?.contractAddress && window.ethereum) {
        try {
          // Use the payment token info directly from collection data
          const paymentToken = collection.mintToken;

          if (paymentToken && paymentToken.type === 'custom') {
            setPaymentTokenInfo({
              address: paymentToken.address,
              symbol: paymentToken.symbol || collection.customTokenSymbol || 'TOKEN',
              decimals: 18,
              isNative: false
            });
          } else {
            // Native token case
            setPaymentTokenInfo({
              address: ethers.ZeroAddress,
              symbol: collection.network === 'polygon' ? 'POL' :
                     collection.network === 'moonwalker' ? 'ZERO' : 'ETH',
              decimals: 18,
              isNative: true
            });
          }
        } catch (error) {
          // Silently fail
        }
      }
    };

    fetchPaymentTokenInfo();
  }, [collection?.contractAddress, collection?.network]);

  useEffect(() => {
    const fetchTokenLogo = async () => {
      if (collection?.mintToken?.address) {
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(collection.mintToken.address);
          console.log('Token Deployment Result:', tokenDeployment);
          
          if (tokenDeployment?.logo) {
            setTokenLogos(prev => ({
              ...prev,
              [collection.mintToken.address.toLowerCase()]: tokenDeployment.logo
            }));
          }
        } catch (error) {
          console.error('Error fetching token logo:', error);
        }
      }
    };

    fetchTokenLogo();
  }, [collection?.mintToken?.address]);

  const renderCurrencyLogo = () => {
    const tokenAddress = collection?.mintToken?.address?.toLowerCase();
    const isNativeToken = !tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000';

    // Handle native tokens based on network
    if (isNativeToken) {
      if (collection?.network === 'moonwalker' || collection?.chainId === 1828369849) {
        return <img src="/Zero.png" alt="ZERO" className="w-5 h-5" />;
      }
      if (collection?.network === 'polygon') {
        return <img src="/polygon.png" alt="POL" className="w-5 h-5" />;
      }
      // Both Unichain mainnet and testnet use ETH
      if (collection?.network === 'unichain-mainnet' || collection?.network === 'unichain') {
        return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
      }
      return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
    }

    // Handle ZERO token by address
    if (tokenAddress === '0xf4a67fd6f54ff994b7df9013744a79281f88766e') {
      return <img src="/Zero.png" alt="ZERO" className="w-5 h-5" />;
    }

    // For other custom tokens with logo
    const logoUrl = tokenLogos[tokenAddress];
    if (logoUrl) {
      return (
        <img 
          src={logoUrl}
          alt={collection.mintToken.symbol || 'Token'}
          className="w-5 h-5 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }
    
    // Default fallback
    return <img src="/token-default.png" alt="Token" className="w-5 h-5 rounded-full" />;
  };

  // Add window size effect
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

  if (loading || !collection) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-inherit"
      >
        {/* Hero Section Skeleton */}
        <div className="relative h-[300px] sm:h-[400px] bg-gradient-to-br from-gray-100/5 to-gray-200/5 dark:from-gray-800/10 dark:to-gray-700/10">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0a0b0f] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Collection Info Card Skeleton */}
            <div className="relative">
              <div className="bg-white dark:bg-[#0a0b0f] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                    <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Minting Section Card Skeleton */}
            <div className="relative">
              <div className="bg-white dark:bg-[#0a0b0f] p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-8 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleMint = async () => {
    try {
      if (!account) {
        setProgressStep('error');
        setShowProgressModal(true);
        setProgressError('Please connect your wallet first');
        return;
      }

      setProgressStep('preparing');
      setShowProgressModal(true);
      setProgressError(null);

      // Prepare metadata before minting
      setProgressStep('preparing');
      const imageResponse = await fetch(collection.previewUrl);
      const imageBlob = await imageResponse.blob();
      const artworkFile = new File([imageBlob], 'artwork.png', { type: 'image/png' });
      
      const { metadataUrl } = await prepareAndUploadMetadata(
        {
          ...collection,
          name: collection.name,
          description: collection.description,
          attributes: collection.attributes || [],
          website: collection.website,
          background_color: collection.background_color
        },
        artworkFile
      );

      // Extract IPFS hash without the protocol prefix
      const ipfsHash = metadataUrl.replace('ipfs://', '').trim();

      const signer = await provider.getSigner();
      
      // Calculate mint price in Wei
      let mintPriceWei;
      try {
        if (collection.mintToken?.type === 'custom') {
          // For custom tokens, use the price as is (no conversion needed)
          mintPriceWei = BigInt(Math.floor(Number(collection.mintPrice) * Math.pow(10, collection.mintToken.decimals || 18)));
        } else {
          // For native tokens (ETH), convert to Wei
          mintPriceWei = ethers.parseEther(collection.mintPrice.toString());
        }
      } catch (error) {
        mintPriceWei = BigInt(0);
      }

      // Calculate total cost
      const totalCost = mintPriceWei * BigInt(mintAmount);

      setProgressStep('minting');

      const nftContract = new ethers.Contract(
        collection.contractAddress,
        collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
        signer
      );

      // Mint the NFT with proper parameters based on contract type
      let tx;
      if (collection.type === 'ERC1155') {
        if (collection.mintToken?.type === 'custom') {
          // First approve the NFT contract to spend the custom token
          const tokenContract = new ethers.Contract(collection.mintToken.address, ['function approve(address spender, uint256 amount) public returns (bool)'], signer);
          const approveTx = await tokenContract.approve(collection.contractAddress, totalCost);
          await approveTx.wait();
          
          // Then mint with custom token
          tx = await nftContract.mint(0, mintAmount, ipfsHash);
        } else {
          // Mint with native token (ETH)
          tx = await nftContract.mint(0, mintAmount, ipfsHash, {
            value: totalCost
          });
        }
      } else {
        if (collection.mintToken?.type === 'custom') {
          // First approve the NFT contract to spend the custom token
          const tokenContract = new ethers.Contract(collection.mintToken.address, ['function approve(address spender, uint256 amount) public returns (bool)'], signer);
          const approveTx = await tokenContract.approve(collection.contractAddress, totalCost);
          await approveTx.wait();
          
          // Then mint with custom token
          tx = await nftContract.mint(mintAmount, ipfsHash);
        } else {
          // Mint with native token (ETH)
          tx = await nftContract.mint(mintAmount, ipfsHash, {
            value: totalCost,
            gasLimit: collection.network === 'unichain' ? 1000000 * mintAmount : 500000 * mintAmount // Higher gas limit for Unichain
          });
        }
      }

      const receipt = await tx.wait();

      // Update states after successful mint
      const [newTotal, newUserMinted] = await Promise.all([
        nftContract.totalSupply(),
        nftContract.mintedPerWallet(account)
      ]);

      setTotalMinted(Number(newTotal));
      setUserMintedAmount(Number(newUserMinted));
      await updateCollectionMinted(symbol, Number(newTotal));

      // Format values for Firebase
      let formattedValue = '0';
      let formattedMintPrice = '0';
      
      try {
        if (collection.mintPrice) {
          formattedMintPrice = parseFloat(collection.mintPrice).toFixed(6);
          const ethValue = ethers.formatEther(totalCost);
          formattedValue = parseFloat(ethValue).toFixed(6);
        }
      } catch (error) {
        // Silently handle formatting errors
      }

      // Get current chain ID
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);

      // Save mint data to Firebase
      await saveMintData({
        collectionAddress: collection.contractAddress,
        minterAddress: account,
        tokenId: collection.type === 'ERC1155' ? '0' : String(newTotal),
        quantity: String(mintAmount),
        hash: receipt.hash,
        image: collection.previewUrl,
        value: formattedValue,
        type: collection.type,
        name: collection.name,
        symbol: collection.symbol,
        artworkType: collection.artworkType || 'image',
        network: currentChainId === 130 ? 'unichain-mainnet' :
                currentChainId === 1301 ? 'unichain' :
                currentChainId === 137 ? 'polygon' :
                currentChainId === 1828369849 ? 'moonwalker' : 'sepolia',
        mintPrice: formattedMintPrice,
        paymentToken: collection.mintToken || null
      });

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
      }, 2000);

    } catch (error) {
      console.error('Minting error:', error);
      setProgressStep('error');
      setProgressError(error.message || 'Transaction failed');
      // Keep the modal open to show the error
    }
  };

  // Calculate remaining time until release
  const now = Date.now();
  const releaseDate = new Date(collection.releaseDate);
  const isLive = now >= releaseDate;
  
  const checkEligibility = async () => {
    if (!validateAddress(checkingAddress)) {
      toast.error('Invalid wallet address');
      return;
    }

    try {
      // First check local whitelist
      const whitelistAddresses = collection.whitelistAddresses || [];
      const checkAddress = checkingAddress.toLowerCase();
      
      const foundEntry = whitelistAddresses.find(addr => {
        if (!addr) return false;
        const addressToCheck = typeof addr === 'object' ? addr.address : addr;
        return addressToCheck && addressToCheck.toLowerCase() === checkAddress;
      });

      const isWhitelisted = !!foundEntry;
      const mintLimit = foundEntry && typeof foundEntry === 'object' ? foundEntry.maxMint : 1;

      setWhitelistChecked(true);
      setIsWhitelisted(isWhitelisted);
      setWhitelistEntry(foundEntry);

      if (isWhitelisted) {
        toast.success(`Address is whitelisted! Can mint up to ${mintLimit} NFTs`);
      } else {
        toast.error('Address is not whitelisted');
      }

      // Also check contract if available
      if (collection.contractAddress && provider) {
        const contract = new ethers.Contract(
          collection.contractAddress, 
          collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
          provider
        );
        
        try {
          // Use whitelist mapping and whitelistMintLimit mapping directly
          const [onChainWhitelist, onChainLimit] = await Promise.all([
            contract.whitelist(checkingAddress),
            contract.whitelistMintLimit(checkingAddress)
          ]);

          console.log('On-chain whitelist status:', {
            isWhitelisted: onChainWhitelist,
            mintLimit: onChainLimit.toString()
          });

          if (onChainWhitelist !== isWhitelisted) {
            console.warn('Whitelist status mismatch between local and contract');
          }
          if (onChainLimit.toString() !== mintLimit.toString()) {
            console.warn('Whitelist mint limit mismatch between local and contract');
          }
        } catch (error) {
          console.warn('Contract whitelist check failed:', error);
        }
      }
    } catch (error) {
      console.error('Error checking whitelist:', error);
      toast.error('Error checking whitelist status');
    }
  };

  // Update the price display section to show correct price
  const renderPrice = () => {
    if (!collection?.mintPrice) return null;

    return (
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-700 dark:text-gray-300">Price</span>
        <div className="flex items-center gap-1">
          {renderCurrencyLogo()}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {collection.mintPrice}
          </span>
        </div>
      </div>
    );
  };

  // Update the mint button section to include end time check
  const renderMintButton = () => {
    const now = Date.now();
    const mintEndDate = collection.mintEndDate ? new Date(collection.mintEndDate) : null;
    const isMintEnded = !collection.infiniteMint && mintEndDate && now >= mintEndDate;

    // Determine if on wrong network
    const expectedChainId = collection.network === 'unichain-mainnet' || collection.chainId === 130 ? 130 :
                           collection.network === 'unichain' ? 1301 :
                           collection.network === 'sepolia' ? 11155111 :
                           collection.network === 'moonwalker' || collection.chainId === 1828369849 ? 1828369849 :
                           collection.network === 'polygon' ? 137 : null;
    
    console.log('Network Check:', {
      currentChainId,
      expectedChainId,
      collectionNetwork: collection.network,
      collectionChainId: collection.chainId
    });
    
    const isWrongNetwork = currentChainId && currentChainId !== expectedChainId;

    // Get network display name
    const networkDisplayName = collection.network === 'unichain-mainnet' || collection.chainId === 130 ? 'Unichain Mainnet' :
                             collection.network === 'unichain' ? 'Unichain Testnet' :
                             collection.network === 'sepolia' ? 'Sepolia' :
                             collection.network === 'moonwalker' || collection.chainId === 1828369849 ? 'MoonWalker' :
                             collection.network === 'polygon' ? 'Polygon' : 'Unknown Network';

    return (
      <div className="flex flex-col gap-2">
        {!collection.infiniteMint && (
          <MintEndCountdown 
            endDate={collection.mintEndDate} 
            infiniteMint={collection.infiniteMint}
          />
        )}

        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
            className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isLive || mintAmount <= 1 || (
              collection.enableWhitelist && (!whitelistChecked || !isWhitelisted)
            )}
          >
            <BiMinus size={24} />
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
            {mintAmount}
          </span>
          <button
            onClick={() => {
              const maxAllowed = collection.enableWhitelist && whitelistEntry
                ? (whitelistEntry.maxMint || 1)
                : collection.maxPerWallet;
              const remaining = maxAllowed - userMintedAmount;
              setMintAmount(Math.min(remaining, mintAmount + 1));
            }}
            className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isLive || (
              collection.enableWhitelist ? (
                !whitelistChecked || 
                !isWhitelisted || 
                userMintedAmount >= (whitelistEntry?.maxMint || 1) ||
                mintAmount >= (whitelistEntry?.maxMint || 1) - userMintedAmount
              ) : (
                userMintedAmount >= collection.maxPerWallet ||
                mintAmount >= collection.maxPerWallet - userMintedAmount
              )
            )}
          >
            <BiPlus size={24} />
          </button>
        </div>

        {account && (
          <RemainingMintAmount 
            userMintedAmount={userMintedAmount} 
            maxPerWallet={collection.enableWhitelist ? (whitelistEntry?.maxMint || 1) : collection.maxPerWallet}
          />
        )}

        <button
          onClick={handleMint}
          disabled={
            !isLive || 
            isMintEnded ||
            isWrongNetwork ||
            (collection.enableWhitelist ? (
              !whitelistChecked || 
              !isWhitelisted || 
              userMintedAmount >= (whitelistEntry?.maxMint || 1)
            ) : (
              userMintedAmount >= collection.maxPerWallet
            )) || 
            mintAmount === 0
          }
          className={`w-full py-3 ${
            isMintEnded ? 'bg-gray-400 cursor-not-allowed' :
            isWrongNetwork ? 'bg-yellow-500 hover:bg-yellow-600 text-black' :
            collection.enableWhitelist && (!whitelistChecked || !isWhitelisted)
              ? 'bg-gray-200 dark:bg-[#1a1b1f] text-gray-900 dark:text-white'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
          } disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg text-lg transition-colors`}
        >
          {!account ? 'Connect Wallet' :
           !isLive ? 'Minting Not Live' :
           isMintEnded ? 'Minting Ended' :
           isWrongNetwork ? `Switch to ${networkDisplayName} Network` :
           collection.enableWhitelist && !whitelistChecked ? 'Check Whitelist Status' :
           collection.enableWhitelist && !isWhitelisted ? 'Not Whitelisted' :
           'Mint Now'
          }
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] bg-gradient-to-br from-[#00ffbd]/5 to-[#00e6a9]/5 dark:from-[#00ffbd]/10 dark:to-[#00e6a9]/10">
        {collection.artworkType === 'video' ? (
          <video 
            src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img 
            src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
            alt={collection.name}
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0a0b0f] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Info Card */}
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

            {/* Main Content - Update background */}
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6">
              <div className="flex items-center gap-6 mb-6">
                {collection.artworkType === 'video' ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#00ffbd]">
                    <video 
                      src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  <img 
                    src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
                    alt={collection.name}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-[#00ffbd]"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {collection.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span>{collection.symbol}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(collection.symbol);
                        toast.success('Symbol copied!');
                      }}
                      className="hover:text-[#00ffbd] transition-colors"
                    >
                      <BiCopy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {collection.description}
              </p>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {collection.attributes?.map((attr, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                  >
                    <p className="text-sm text-gray-500 mb-1">{attr.trait_type}</p>
                    <p className="text-lg font-medium text-[#00ffbd]">
                      {typeof attr.value === 'number' ? attr.value.toString() : attr.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-6 mb-6">
                {collection.website && (
                  <a 
                    href={collection.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <BiWorld size={20} />
                  </a>
                )}
                {collection.socials?.twitter && (
                  <a 
                    href={`https://twitter.com/${collection.socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <FaTwitter size={20} />
                  </a>
                )}
                {collection.socials?.discord && (
                  <a 
                    href={collection.socials.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <FaDiscord size={20} />
                  </a>
                )}
                {collection.socials?.telegram && (
                  <a 
                    href={collection.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <FaTelegram size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Minting Section Card */}
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

            {/* Glowing dots */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

            {/* Three dots */}
            <div className="absolute top-3 right-3 flex gap-1 z-20">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Main Content - Update background */}
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6">
              {renderPrice()}

              {/* Whitelist Checker */}
              {collection.enableWhitelist && (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-[#0d0e12] rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 dark:text-white font-semibold">Whitelist Checker</h3>
                    {whitelistChecked && isWhitelisted && (
                      <span className="text-xs bg-[#00ffbd]/10 text-[#00ffbd] px-2 py-1 rounded-full">
                        Whitelisted
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter your wallet address"
                      value={checkingAddress}
                      onChange={(e) => setCheckingAddress(e.target.value)}
                      className="flex-1 bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00ffbd]"
                    />
                    <button
                      onClick={checkEligibility}
                      disabled={!checkingAddress || !validateAddress(checkingAddress)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        checkingAddress && validateAddress(checkingAddress)
                          ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black' 
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Check
                    </button>
                  </div>
                  {whitelistChecked && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      isWhitelisted 
                        ? 'bg-[#00ffbd]/10 border border-[#00ffbd]/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {isWhitelisted ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-[#00ffbd]">
                            <span className="mr-2">✓</span>
                            Address is whitelisted
                          </div>
                          {whitelistEntry && typeof whitelistEntry === 'object' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              You can mint up to {whitelistEntry.maxMint} NFTs during the whitelist phase
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-red-500">
                          <span className="mr-2">✗</span>
                          Address is not whitelisted
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {renderMintButton()}

              {/* Contract and Creator Addresses */}
              <div className="flex items-center justify-between text-center mt-4">
                {collection.creatorAddress && (
                  <div className="group relative">
                    <a
                      href={`${
                        collection.network === 'polygon' 
                          ? 'https://polygonscan.com' 
                          : collection.network === 'unichain-mainnet' || collection.chainId === 130
                            ? 'https://unichain.blockscout.com'
                            : collection.network === 'unichain'
                                ? 'https://unichain-sepolia.blockscout.com'
                                : collection.network === 'moonwalker' || collection.chainId === 1828369849
                                    ? 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
                                    : 'https://sepolia.etherscan.io'
                      }/address/${collection.creatorAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[#00ffbd] dark:text-gray-400 dark:hover:text-[#00ffbd] transition-colors"
                    >
                      Creator Address
                    </a>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {collection.creatorAddress}
                    </div>
                  </div>
                )}

                <div className="group relative">
                  <a
                    href={`${
                      collection.network === 'polygon' 
                        ? 'https://polygonscan.com' 
                        : collection.network === 'unichain-mainnet' || collection.chainId === 130
                          ? 'https://unichain.blockscout.com'
                          : collection.network === 'unichain'
                              ? 'https://unichain-sepolia.blockscout.com'
                              : collection.network === 'moonwalker' || collection.chainId === 1828369849
                                  ? 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
                                  : 'https://sepolia.etherscan.io'
                    }/address/${collection.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-[#00ffbd] dark:text-gray-400 dark:hover:text-[#00ffbd] transition-colors"
                  >
                    Contract Address
                  </a>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {collection.contractAddress}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{totalMinted}/{maxSupply} Minted</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-[#0d0e12] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00ffbd] transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Max Per Wallet</div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {collection.enableWhitelist ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check your mint cap in whitelist checker above</span>
                    ) : (
                      collection.maxPerWallet
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{maxSupply}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Collection Analytics
          </h2>
          <FuturisticCard>
            <AnalyticsTabs collection={collection} />
          </FuturisticCard>
        </div>
      </div>

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
      
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setProgressStep(null);
        }}
        currentStep={progressStep}
        error={progressError}
      />
      
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={(rating) => {
          console.log('User rated minting experience:', rating);
          // Here you can implement the logic to save the rating
        }}
      />
    </div>
  );
} 