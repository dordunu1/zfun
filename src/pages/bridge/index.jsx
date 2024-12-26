import React, { useState, useEffect } from 'react';
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

const BRIDGE_ADDRESS = '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2';
const BRIDGE_ABI = [
  {"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"stateMutability":"payable","type":"fallback"},
  {"inputs":[],"name":"getImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes","name":"_code","type":"bytes"}],"name":"setCode","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"bytes32","name":"_value","type":"bytes32"}],"name":"setStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

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
                        className="mt-1 text-[#00ffbd] focus:ring-[#00ffbd]"
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
                        className="mt-1 text-[#00ffbd] focus:ring-[#00ffbd]"
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
                        className="mt-1 text-[#00ffbd] focus:ring-[#00ffbd]"
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

const BridgeProgressModal = ({ isOpen, onClose, currentStep, amount, isReversed, txHash }) => {
  const getExplorerUrl = (chain, hash) => {
    if (chain === 'sepolia') {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    } else {
      return `https://unichain-sepolia.blockscout.com/tx/${hash}`;
    }
  };

  const fromChain = isReversed ? 'unichain' : 'sepolia';
  const toChain = isReversed ? 'sepolia' : 'unichain';

  // Don't show destination explorer link for Sepolia to Unichain
  const showDestinationExplorer = isReversed;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={() => {
          // Only allow closing if transaction is complete
          if (currentStep === 'complete') {
            onClose();
          }
        }}
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-1">
                  Bridge {amount} ETH
                </Dialog.Title>
                <div className="text-sm text-gray-500 mb-4">
                  Via Native Bridge
                </div>

                <div className="mt-4">
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${
                      currentStep === 'start' ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-400'
                    }`}>
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                        {currentStep === 'start' ? '1' : currentStep === 'waiting' || currentStep === 'complete' ? '✓' : '1'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Start on {isReversed ? 'Unichain Sepolia' : 'Sepolia'}</div>
                        {txHash && (currentStep === 'waiting' || currentStep === 'complete') ? (
                          <a 
                            href={getExplorerUrl(fromChain, txHash)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
                          >
                            View in explorer ↗
                          </a>
                        ) : (
                          <div className="text-sm text-gray-500">Waiting for transaction...</div>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-xl ${
                      currentStep === 'waiting' ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-400'
                    }`}>
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                        {currentStep === 'waiting' ? '2' : currentStep === 'complete' ? '✓' : '2'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Wait ~3 mins</div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-xl ${
                      currentStep === 'complete' ? 'bg-[#00ffbd]/10 text-[#00ffbd]' : 'text-gray-400'
                    }`}>
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                        {currentStep === 'complete' ? '✓' : '3'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Get ETH on {isReversed ? 'Sepolia' : 'Unichain Sepolia'}</div>
                        {currentStep === 'complete' && showDestinationExplorer && (
                          <a 
                            href={getExplorerUrl(toChain, txHash)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
                          >
                            View in explorer ↗
                          </a>
                        )}
                      </div>
                    </div>
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

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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
          <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 rounded-xl">
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
  const { switchNetwork } = useSwitchNetwork();
  const uniswap = useUnichain();
  
  // All state hooks
  const [amount, setAmount] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [ethBalance, setEthBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [bridgeFee, setBridgeFee] = useState(null);
  const [isEstimatingFee, setIsEstimatingFee] = useState(false);

  // Network change effect
  useEffect(() => {
    if (chain?.id === 1301) { // Unichain
      setIsReversed(true);
    } else if (chain?.id === 11155111) { // Sepolia
      setIsReversed(false);
    }
  }, [chain?.id]);

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
        const estimator = createBridgeGasEstimator(
          provider,
          isReversed ? 'unichain' : 'sepolia'
        );
        
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
  }, [amount, isReversed]);

  // Event handlers
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleReviewBridge = () => {
    if (!amount || !bridgeFee) return;
    
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

    setShowTerms(true);
  };

  const handleAcceptTerms = async () => {
    setShowTerms(false);
    setShowProgress(true);
    setCurrentStep('start');
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Get latest gas estimate before sending transaction
      const estimator = createBridgeGasEstimator(
        provider,
        isReversed ? 'unichain' : 'sepolia'
      );
      const estimate = await estimator.estimateGasFee(amount);
      
      // Send ETH directly to bridge contract
      const tx = await signer.sendTransaction({
        to: BRIDGE_ADDRESS,
        value: ethers.parseEther(amount),
        gasLimit: BigInt(estimate.estimatedGas)
      });
      
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

  const handleNetworkSwitch = async () => {
    const newIsReversed = !isReversed;
    const targetNetwork = newIsReversed ? 1301 : 11155111;
    
    try {
      if (targetNetwork === 1301) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x515',
              chainName: 'Unichain Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.unichain.org'],
              blockExplorerUrls: ['https://unichain-sepolia.blockscout.com']
            }]
          });
        } catch (addError) {
          console.log('Network might already be added');
        }
      }
      await switchNetwork?.(targetNetwork);
      setIsReversed(newIsReversed);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Please switch your network manually');
    }
  };

  const estimatedTime = '~3 mins';

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
      <div className="bg-white dark:bg-[#1a1b1f] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Networks Section */}
        <div className="relative bg-gray-50 dark:bg-[#2d2f36] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">From</div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-[#627EEA]/10 dark:bg-[#627EEA]/20 flex items-center justify-center">
                  <img 
                    src={isReversed ? "/unichain-logo.png" : "/sepolia-logo.png"} 
                    alt={isReversed ? "Unichain" : "Sepolia"} 
                    className="w-7 h-7" 
                  />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {isReversed ? "Unichain Sepolia" : "Sepolia"}
                </span>
              </div>
            </div>

            <button
              onClick={handleNetworkSwitch}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1b1f] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10 border border-gray-200 dark:border-gray-700"
            >
              <FaExchangeAlt size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex-1 text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">To</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-10 h-10 rounded-lg bg-[#FF3B9A]/10 dark:bg-[#FF3B9A]/20 flex items-center justify-center">
                  <img 
                    src={isReversed ? "/sepolia-logo.png" : "/unichain-logo.png"} 
                    alt={isReversed ? "Sepolia" : "Unichain"} 
                    className="w-7 h-7" 
                  />
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {isReversed ? "Sepolia" : "Unichain Sepolia"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-end items-center mb-2">
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
                      <span className="inline-flex items-center">
                        Loading...
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          ⋯
                        </motion.span>
                      </span>
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
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-2xl font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-2 bg-white dark:bg-[#1a1b1f] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  <img src="/eth-logo.png" alt="ETH" className="w-6 h-6" />
                  <span className="text-gray-900 dark:text-white font-medium">ETH</span>
                  <div className="relative w-4 h-4">
                    <img 
                      src={isReversed ? "/sepolia-logo.png" : "/unichain-logo.png"}
                      alt={isReversed ? "Sepolia" : "Unichain"} 
                      className="w-3 h-3 absolute -bottom-1 -right-1" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Details */}
          <div className="p-4 bg-gray-50 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            {/* Native Bridge Tag */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-base text-gray-900 dark:text-white font-medium">Get on {isReversed ? "Sepolia" : "Unichain Sepolia"}</span>
              <div className="flex items-center gap-2 bg-[#FF3B9A]/10 dark:bg-[#FF3B9A]/20 px-3 py-1.5 rounded-lg">
                <img src="/unichain-logo.png" alt="Unichain" className="w-4 h-4" />
                <span className="text-sm text-gray-900 dark:text-white font-medium">Native Bridge</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <FaGasPump className="text-gray-500 dark:text-gray-400" size={16} />
                <span>Bridge fee</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={isEstimatingFee ? 'loading' : bridgeFee}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gray-900 dark:text-white"
                >
                  {isEstimatingFee ? (
                    <span className="inline-flex items-center">
                      Estimating...
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-1"
                      >
                        ⋯
                      </motion.span>
                    </span>
                  ) : (
                    `${bridgeFee} ETH`
                  )}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BiTime className="text-gray-500 dark:text-gray-400" size={18} />
                <span>Estimated time</span>
              </div>
              <span className="text-sm text-gray-900 dark:text-white">{estimatedTime}</span>
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
                      src={isReversed ? "/sepolia-logo.png" : "/unichain-logo.png"}
                      alt={isReversed ? "Sepolia" : "Unichain"} 
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
          disabled={!amount || loading}
          className={`w-full mt-6 px-4 py-3 rounded-xl font-medium transition-colors ${
            amount && !loading
              ? 'bg-[#00ffbd] text-black hover:bg-[#00e6a9]'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Processing...' : 'Review bridge'}
        </button>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
      />

      <BridgeProgressModal
        isOpen={showProgress}
        onClose={() => setShowProgress(false)}
        currentStep={currentStep}
        amount={amount}
        isReversed={isReversed}
        txHash={txHash}
      />
    </div>
  );
} 