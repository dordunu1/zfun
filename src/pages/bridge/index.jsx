import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useUnichain } from '../../hooks/useUnichain';
import { useWeb3Modal } from '@web3modal/react';
import { BiWallet, BiTime } from 'react-icons/bi';
import { FaGasPump, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { createBridgeGasEstimator } from '../../services/bridgeGasEstimation';
import { CheckIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const L1_BRIDGE_ADDRESS = '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2';

const L1_BRIDGE_ABI = [
  {"inputs":[{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"bridgeETH","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"bridgeETHTo","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_l1Token","type":"address"},{"internalType":"address","name":"_l2Token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"depositERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_l1Token","type":"address"},{"internalType":"address","name":"_l2Token","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"depositERC20To","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"depositETH","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint32","name":"_minGasLimit","type":"uint32"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"depositETHTo","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"messenger","outputs":[{"internalType":"contract CrossDomainMessenger","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
];

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

const AnimatedClock = () => (
  <div className="relative w-5 h-5">
    <div className="absolute inset-0 border-2 border-[#00ffbd] rounded-full" />
    <div 
      className="absolute top-1/2 left-1/2 w-[1px] h-[40%] bg-[#00ffbd] origin-bottom"
      style={{ 
        transform: 'translate(-50%, -100%) rotate(0deg)',
        animation: 'rotate 2s linear infinite'
      }}
    />
    <style jsx>{`
      @keyframes rotate {
        from { transform: translate(-50%, -100%) rotate(0deg); }
        to { transform: translate(-50%, -100%) rotate(360deg); }
      }
    `}</style>
  </div>
);

const CountdownTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(targetTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s remaining`;
  };

  return (
    <div className="flex items-center gap-2 text-[#00ffbd]">
      <AnimatedClock />
      <span className="text-sm">{formatTime(timeLeft)}</span>
    </div>
  );
};

const BridgeProgressModal = ({ isOpen, onClose, currentStep, txHash }) => {
  const [startTime] = useState(Date.now());

  const getExplorerUrl = (hash) => {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  };

  // Define steps for Sepolia to Unichain only
  const steps = [
    {
      title: 'Start on Sepolia',
      description: 'Bridge transaction initiated',
      status: currentStep === 'start' ? 'current' : currentStep ? 'complete' : 'upcoming',
      link: txHash ? getExplorerUrl(txHash) : null
    },
    {
      title: 'Wait ~3 mins',
      description: 'Transaction processing',
      status: currentStep === 'waiting' ? 'current' : currentStep === 'complete' ? 'complete' : 'upcoming',
      timer: currentStep === 'waiting' ? 180 : null
    },
    {
      title: 'Get ETH on Unichain Sepolia',
      description: 'Bridge complete',
      status: currentStep === 'complete' ? 'complete' : 'upcoming'
    }
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4"
                >
                  Bridge Progress
                </Dialog.Title>

                <div className="mt-4 space-y-6">
                  {steps.map((step, index) => (
                    <div key={index} className="relative">
                      {index !== steps.length - 1 && (
                        <div className={`absolute left-3.5 top-8 w-0.5 h-full ${
                          step.status === 'complete' ? 'bg-[#00ffbd]' : 'bg-gray-200 dark:bg-gray-700'
                        }`} />
                      )}
                      <div className="relative flex items-start">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          step.status === 'complete' ? 'bg-[#00ffbd]' :
                          step.status === 'current' ? 'bg-blue-500' :
                          'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {step.status === 'complete' ? (
                            <CheckIcon className="h-4 w-4 text-black" />
                          ) : step.status === 'current' ? (
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                          ) : null}
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {step.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {step.description}
                          </div>
                          {step.timer && step.status === 'current' && (
                            <div className="mt-2">
                              <CountdownTimer targetTime={step.timer} />
                            </div>
                          )}
                          {step.link && (
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#00ffbd] hover:text-[#00e6a9] mt-1 inline-block"
                            >
                              View in explorer ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={onClose}
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
  );
};

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [acceptedTerms, setAcceptedTerms] = useState({
    time: false,
    cancellation: false,
    fees: false
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Accept terms
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Please read and agree to the following terms before you continue
                  </p>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-[#00ffbd] bg-gray-100 dark:bg-[#2d2f36] border-gray-300 dark:border-gray-600 rounded focus:ring-[#00ffbd] focus:ring-offset-0 focus:ring-2 dark:focus:ring-offset-[#1a1b1f] transition-colors cursor-pointer"
                        checked={acceptedTerms.time}
                        onChange={(e) => setAcceptedTerms(prev => ({ ...prev, time: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        I understand it will take ~3 mins until my funds are on Unichain Sepolia
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-[#00ffbd] bg-gray-100 dark:bg-[#2d2f36] border-gray-300 dark:border-gray-600 rounded focus:ring-[#00ffbd] focus:ring-offset-0 focus:ring-2 dark:focus:ring-offset-[#1a1b1f] transition-colors cursor-pointer"
                        checked={acceptedTerms.cancellation}
                        onChange={(e) => setAcceptedTerms(prev => ({ ...prev, cancellation: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        I understand once a bridge is initiated it cannot be sped up or cancelled
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-[#00ffbd] bg-gray-100 dark:bg-[#2d2f36] border-gray-300 dark:border-gray-600 rounded focus:ring-[#00ffbd] focus:ring-offset-0 focus:ring-2 dark:focus:ring-offset-[#1a1b1f] transition-colors cursor-pointer"
                        checked={acceptedTerms.fees}
                        onChange={(e) => setAcceptedTerms(prev => ({ ...prev, fees: e.target.checked }))}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        I understand network fees are approximate and will change
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      allTermsAccepted
                        ? 'bg-[#00ffbd] text-black hover:bg-[#00e6a9]'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => allTermsAccepted && onAccept()}
                    disabled={!allTermsAccepted}
                  >
                    Continue
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

const ActivityModal = ({ isOpen, onClose, address, setShowProgress, setCurrentStep, setTxHash }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add function to check transaction status
  const checkTransactionStatus = useCallback(async (txHash) => {
    try {
      // Use Sepolia RPC instead of Unichain
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.org');
      const receipt = await provider.getTransactionReceipt(txHash);
      return receipt;
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return null;
    }
  }, []);

  // Add polling effect for pending transactions
  useEffect(() => {
    if (!activities.length) return;

    const interval = setInterval(async () => {
      const updatedActivities = await Promise.all(
        activities.map(async (activity) => {
          if (activity.status === 'pending') {
            const receipt = await checkTransactionStatus(activity.txHash);
            if (!receipt) {
              return activity; // Still pending
            }
            
            const minutesPassed = Math.floor((Date.now() - activity.timestamp) / (1000 * 60));
            
            if (receipt.status === 0) {
              return { ...activity, status: 'failed' };
            } else {
              // Transaction confirmed on Sepolia
              if (minutesPassed >= 3) {
                return { ...activity, status: 'complete' };
              } else {
                return { ...activity, status: 'processing', minutesPassed };
              }
            }
          }
          return activity;
        })
      );

      if (JSON.stringify(updatedActivities) !== JSON.stringify(activities)) {
        setActivities(updatedActivities);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [activities, checkTransactionStatus]);

  const fetchBridgeHistory = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://eth-sepolia.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%7C${L1_BRIDGE_ADDRESS}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch bridge history');
      }

      const data = await response.json();
      
      const formattedActivities = await Promise.all(data.items
        .filter(tx => {
          return tx.to?.hash?.toLowerCase() === L1_BRIDGE_ADDRESS.toLowerCase() &&
                 tx.value !== '0' &&
                 tx.decoded_input?.method_call?.includes('bridgeETH');
        })
        .map(async tx => {
          const gasUsedBigInt = BigInt(tx.gas_used || 0);
          const gasPriceBigInt = BigInt(tx.gas_price || 0);
          const actualGasFee = ethers.formatEther((gasUsedBigInt * gasPriceBigInt).toString());

          const txTime = new Date(tx.timestamp).getTime();
          const minutesPassed = Math.floor((Date.now() - txTime) / (1000 * 60));
          
          // Determine initial status
          let bridgeStatus;
          if (tx.status === '0') {
            bridgeStatus = 'failed';
          } else if (minutesPassed >= 3 && tx.confirmations > 0) {
            bridgeStatus = 'complete';
          } else if (tx.confirmations > 0) {
            bridgeStatus = 'processing';
          } else {
            bridgeStatus = 'pending';
          }

          return {
            amount: ethers.formatEther(tx.value),
            timestamp: txTime,
            status: bridgeStatus,
            fromNetwork: 'Sepolia',
            toNetwork: 'Unichain Sepolia',
            txHash: tx.hash,
            bridgeFee: actualGasFee,
            gasUsed: tx.gas_used,
            gasPrice: ethers.formatUnits(tx.gas_price || '0', 'gwei'),
            confirmations: tx.confirmations,
            estimatedTime: '~3 mins',
            minutesPassed,
          };
        }));

      setActivities(formattedActivities.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error fetching bridge history:', error);
      toast.error('Failed to load bridge history');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh history when modal opens
  useEffect(() => {
    if (isOpen && address) {
      fetchBridgeHistory();
    }
  }, [isOpen, address]);

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                      Bridge History
                    </Dialog.Title>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {formatAddress(address)}
                    </div>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mt-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-[#00ffbd] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 dark:text-gray-400">Loading history...</span>
                      </div>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <BiTime size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No bridge history found
                      </p>
                    </div>
                  ) : (
                    activities.map((activity, index) => (
                      <div
                        key={activity.txHash}
                        className="bg-gray-50 dark:bg-[#2d2f36] rounded-xl p-5 hover:bg-gray-100 dark:hover:bg-[#3d4046] transition-colors"
                      >
                        <div className="space-y-4">
                          {/* Header with amount and time */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <img src="/eth-logo.png" alt="ETH" className="w-6 h-6" />
                              <span className="text-xl font-bold text-gray-900 dark:text-white">{activity.amount} ETH</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(activity.timestamp).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-2 text-[#00ffbd] mt-1">
                                {activity.status === 'complete' ? (
                                  <>
                                    <CheckIcon className="h-4 w-4" />
                                    <span className="text-sm">Bridge successful</span>
                                  </>
                                ) : activity.status === 'failed' ? (
                                  <>
                                    <XMarkIcon className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-500">Bridge failed</span>
                                  </>
                                ) : activity.status === 'processing' ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-[#00ffbd] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Processing ({3 - activity.minutesPassed} mins left)</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-4 h-4 border-2 border-[#00ffbd] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm">Pending confirmation</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Network flow */}
                          <div className="flex items-center justify-between bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <img src="/sepolia-logo.png" alt="From" className="w-5 h-5" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Sepolia</span>
                            </div>
                            <FaExchangeAlt className="text-gray-400" size={12} />
                            <div className="flex items-center gap-2">
                              <img src="/unichain-logo.png" alt="To" className="w-5 h-5" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Unichain Sepolia</span>
                            </div>
                          </div>

                          {/* Transaction details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Network Fee</span>
                              <span className="text-gray-900 dark:text-white">{parseFloat(activity.bridgeFee).toFixed(6)} ETH</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Gas Price</span>
                              <span className="text-gray-900 dark:text-white">{activity.gasPrice} Gwei</span>
                            </div>
                            
                            {/* Transaction hash with link and Via Native Bridge */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <span>Via Native Bridge</span>
                                <div className="flex items-center">
                                  <img 
                                    src="/sepolia-logo.png"
                                    alt="Sepolia"
                                    className="w-4 h-4"
                                  />
                                  <img 
                                    src="/unichain-logo.png"
                                    alt="Unichain"
                                    className="w-4 h-4 -ml-1"
                                  />
                                </div>
                              </div>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${activity.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#00ffbd] hover:text-[#00e6a9] flex items-center gap-2"
                              >
                                <span>View transaction</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const TransactionSummaryModal = ({ isOpen, onClose, onConfirm, amount, bridgeFee }) => {
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Transaction Summary
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {/* Network Flow */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-[#2d2f36] p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <img src="/sepolia-logo.png" alt="From Network" className="w-6 h-6" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sepolia</span>
                    </div>
                    <FaExchangeAlt className="text-gray-400" size={12} />
                    <div className="flex items-center gap-2">
                      <img src="/unichain-logo.png" alt="To Network" className="w-6 h-6" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Unichain Sepolia</span>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                      <div className="flex items-center gap-2">
                        <img src="/eth-logo.png" alt="ETH" className="w-5 h-5" />
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {amount} ETH
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Network Fee (estimated)</span>
                      <span className="text-sm text-gray-900 dark:text-white">~{bridgeFee} ETH</span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="text-base font-medium text-gray-900 dark:text-white">
                        {(parseFloat(amount) + parseFloat(bridgeFee)).toFixed(6)} ETH
                      </span>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <BiTime className="text-blue-500" size={20} />
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Estimated completion time: ~3 mins
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    className="w-full px-4 py-3 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-xl transition-colors"
                    onClick={onConfirm}
                  >
                    Confirm Bridge
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition-colors"
                    onClick={onClose}
                  >
                    Cancel
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

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Bridge
          </h1>
        </div>

        {/* Main Container with L-shape corners and glowing dots */}
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

          {/* Main Content */}
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-4 md:p-6 rounded-xl">
            <Bridge />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bridge() {
  // Network and wallet hooks
  const { address, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const { chain } = useNetwork();
  const uniswap = useUnichain();
  
  // All state hooks
  const [showActivity, setShowActivity] = useState(false);
  const [amount, setAmount] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [bridgeFee, setBridgeFee] = useState(null);
  const [isEstimatingFee, setIsEstimatingFee] = useState(false);
  const [networkStatus, setNetworkStatus] = useState({
    isCorrectNetwork: false,
    message: ''
  });
  const [showSummary, setShowSummary] = useState(false);

  // Network status effect - only check for Sepolia
  useEffect(() => {
    if (!isConnected) return;
    
    if (chain?.id === 11155111) {
      setNetworkStatus({
        isCorrectNetwork: true,
        message: 'Connected to Sepolia'
      });
    } else {
      setNetworkStatus({
        isCorrectNetwork: false,
        message: 'Please switch to Sepolia'
      });
    }
  }, [chain?.id, isConnected]);

  // Balance update effect
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      setIsLoadingBalance(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        setEthBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [address, chain?.id]);

  // Gas estimation effect
  useEffect(() => {
    const updateGasEstimate = async () => {
      if (!amount || !window.ethereum) return;
      
      setIsEstimatingFee(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const estimator = createBridgeGasEstimator(provider, 'sepolia');
        const estimate = await estimator.estimateGasFee(amount);
        setBridgeFee(estimate.gasFee);
      } catch (error) {
        console.error('Error estimating gas:', error);
        setBridgeFee('0.019');
      } finally {
        setIsEstimatingFee(false);
      }
    };

    updateGasEstimate();
  }, [amount]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleReviewBridge = () => {
    if (!amount || !bridgeFee || !networkStatus.isCorrectNetwork) return;
    
    const amountNum = parseFloat(amount);
    const balanceNum = parseFloat(ethBalance);
    const bridgeFeeNum = parseFloat(bridgeFee);
    
    if (amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (amountNum + bridgeFeeNum > balanceNum) {
      toast.error('Insufficient ETH balance (including gas fee)');
      return;
    }

    setShowSummary(true);
  };

  const handleAcceptTerms = async () => {
    setShowTerms(false);
    setShowProgress(true);
    setCurrentStep('start');
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const txValue = ethers.parseEther(amount);
      
      // Sepolia -> Unichain: Use L1StandardBridge
      const l1Bridge = new ethers.Contract(L1_BRIDGE_ADDRESS, L1_BRIDGE_ABI, signer);

      console.log('Bridge parameters:', {
        to: userAddress,
        minGasLimit: '200000',
        value: txValue.toString()
      });

      // Let MetaMask handle gas estimation
      const tx = await l1Bridge.bridgeETHTo(
        userAddress,
        200000n,
        '0x',
        {
          value: txValue
        }
      );
      
      setTxHash(tx.hash);
      console.log('Bridge transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Bridge transaction confirmed:', receipt);
      setCurrentStep('waiting');
      
      setTimeout(() => {
        setCurrentStep('complete');
        setLoading(false);
      }, 180000);
      
    } catch (error) {
      console.error('Bridge error:', error);
      toast.error(error.message || 'Failed to bridge ETH');
      setLoading(false);
      setShowProgress(false);
      setCurrentStep(null);
      setTxHash(null);
    }
  };

  // Early return for wallet connection
  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Please connect your wallet to start bridging
        </p>
        <button
          onClick={openConnectModal}
          className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-[#1a1b1f] rounded-2xl p-4 md:p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* History Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowActivity(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#2d2f36] rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3d4046] transition-colors border border-gray-200 dark:border-gray-700"
          >
            <BiTime className="text-[#00ffbd]" size={16} />
            <span>History</span>
          </button>
        </div>

        {/* Networks Section */}
        <div className="relative bg-gray-50 dark:bg-[#2d2f36] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">From</div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#627EEA]/10 dark:bg-[#627EEA]/20 flex items-center justify-center">
                  <img src="/sepolia-logo.png" alt="Sepolia" className="w-7 h-7" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">Sepolia</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1b1f] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <FaExchangeAlt size={16} className="text-gray-600 dark:text-gray-400 transform rotate-90" />
              </div>
            </div>

            <div className="flex-1 text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">To</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-10 h-10 rounded-lg bg-[#FF3B9A]/10 dark:bg-[#FF3B9A]/20 flex items-center justify-center">
                  <img src="/unichain-logo.png" alt="Unichain" className="w-7 h-7" />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">Unichain Sepolia</span>
              </div>
            </div>
          </div>
          
          {/* Network Status Indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={networkStatus.isCorrectNetwork ? 'correct' : 'incorrect'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-3 text-sm flex items-center gap-2 ${
                networkStatus.isCorrectNetwork 
                  ? 'text-green-500' 
                  : 'text-yellow-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                networkStatus.isCorrectNetwork 
                  ? 'bg-green-500' 
                  : 'bg-yellow-500'
              }`} />
              {networkStatus.message}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Tooltip content={
                <div>
                  Min: 0.001 ETH<br />
                  Max: 100 ETH
                </div>
              }>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 cursor-help">
                  <InformationCircleIcon className="h-4 w-4" />
                  Bridge Limits
                </div>
              </Tooltip>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoadingBalance ? 'loading' : 'loaded'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <BiWallet className="text-gray-500 dark:text-gray-400" size={20} />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isLoadingBalance ? (
                      <motion.div
                        className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                      />
                    ) : (
                      `Balance: ${parseFloat(ethBalance).toFixed(4)} ETH`
                    )}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.0"
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-2xl font-medium ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              />
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-900/10 dark:bg-gray-900/20 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[#00ffbd] border-t-transparent rounded-full"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Processing...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bridge Details */}
          <div className="p-4 bg-gray-50 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-900 dark:text-white font-medium">Get on Unichain Sepolia</span>
              <div className="flex items-center gap-2 bg-[#FF3B9A]/10 dark:bg-[#FF3B9A]/20 px-3 py-1.5 rounded-lg">
                <img src="/unichain-logo.png" alt="Unichain" className="w-4 h-4" />
                <span className="text-sm text-gray-900 dark:text-white font-medium">Native Bridge</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Tooltip content="Gas fee for processing the transaction on Sepolia">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-help">
                  <FaGasPump className="text-gray-500 dark:text-gray-400" size={16} />
                  <span>Network Fee</span>
                  <InformationCircleIcon className="h-4 w-4" />
                </div>
              </Tooltip>
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={isEstimatingFee ? 'loading' : bridgeFee}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gray-900 dark:text-white"
                >
                  {isEstimatingFee ? (
                    <motion.div
                      className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    />
                  ) : (
                    `~${bridgeFee} ETH`
                  )}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BiTime className="text-gray-500 dark:text-gray-400" size={18} />
                <span>Estimated time</span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">~3 mins</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">You will receive</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-900 dark:text-white font-medium">{amount || '0'}</span>
                <div className="flex items-center gap-1">
                  <img src="/eth-logo.png" alt="ETH" className="w-5 h-5" />
                  <span className="text-sm text-gray-900 dark:text-white font-medium">ETH</span>
                  <div className="relative w-3 h-3">
                    <img 
                      src="/unichain-logo.png"
                      alt="Unichain" 
                      className="w-3 h-3 absolute -bottom-1 -right-1" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleReviewBridge}
          disabled={!amount || loading || !networkStatus.isCorrectNetwork}
          className={`w-full mt-6 px-4 py-3 rounded-xl font-medium text-base transition-all duration-200 hover:scale-[0.99] active:scale-[0.97] ${
            amount && !loading && networkStatus.isCorrectNetwork
              ? 'bg-[#00ffbd] text-black hover:bg-[#00e6a9] shadow-lg hover:shadow-xl'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading 
            ? 'Processing...' 
            : !networkStatus.isCorrectNetwork 
              ? 'Please switch to Sepolia'
              : !amount 
                ? 'Enter amount'
                : 'Review bridge'
          }
        </button>
      </div>

      {/* Add info section about other bridges */}
      <div className="mt-4 md:mt-6 p-4 bg-gray-50 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Looking to bridge from Unichain to Sepolia?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Try these alternative bridges:{' '}
          <a 
            href="https://superbridge.app/unichain-sepolia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00ffbd] hover:text-[#00e6a9] mr-2"
          >
            SuperBridge
          </a>
          {' '}or{' '}
          <a 
            href="https://testnet.brid.gg/unichain-sepolia" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#00ffbd] hover:text-[#00e6a9]"
          >
            Brid.gg
          </a>
        </p>
      </div>

      <ActivityModal
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
        address={address}
        setShowProgress={setShowProgress}
        setCurrentStep={setCurrentStep}
        setTxHash={setTxHash}
      />

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />

      <BridgeProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        currentStep={currentStep}
        txHash={txHash}
      />

      <TransactionSummaryModal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={() => {
          setShowSummary(false);
          setShowTerms(true);
        }}
        amount={amount}
        bridgeFee={bridgeFee}
      />
    </div>
  );
} 