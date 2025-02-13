import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BiX, BiImageAdd, BiChevronLeft, BiUpload, BiDownload, BiChevronDown, BiWallet, BiVideo, BiListUl, BiTrash } from 'react-icons/bi';
import { FaEthereum, FaFileExcel, FaFileCsv, FaFileCode, FaTelegram, FaTwitter, FaDiscord } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import clsx from 'clsx';
import { NFT_CONTRACTS, TOKEN_ADDRESSES } from '../config/contracts';
import { ethers } from 'ethers';
import { NFTFactoryABI } from '../abi/NFTFactory';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'viem';
import { useAccount, useNetwork } from 'wagmi';
import { NFTCollectionABI } from '../abi/NFTCollection';
import * as XLSX from 'xlsx';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';
import Confetti from 'react-confetti';
import { prepareAndUploadMetadata } from '../services/metadata';
import { Contract } from 'ethers';
import { saveCollection } from '../services/firebase';
import { useConnectModal } from '@rainbow-me/rainbowkit';

// Chain IDs configuration
const CHAIN_IDS = {
  SEPOLIA: 11155111,
  POLYGON: 137,
  UNICHAIN_MAINNET: 130,
  UNICHAIN: 1301,
  MOONWALKER: 1828369849
};

// Explorer URL Configuration
const EXPLORER_URLS = {
  [CHAIN_IDS.SEPOLIA]: 'https://sepolia.etherscan.io',
  [CHAIN_IDS.POLYGON]: 'https://polygonscan.com',
  [CHAIN_IDS.UNICHAIN_MAINNET]: 'https://unichain.blockscout.com',
  [CHAIN_IDS.UNICHAIN]: 'https://unichain-sepolia.blockscout.com',
  [CHAIN_IDS.MOONWALKER]: 'https://moonwalker-blockscout.eu-north-2.gateway.fm'
};

const NFT_FACTORY_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: import.meta.env.VITE_NFT_FACTORY_SEPOLIA,
  [CHAIN_IDS.POLYGON]: import.meta.env.VITE_NFT_FACTORY_POLYGON,
  [CHAIN_IDS.UNICHAIN_MAINNET]: import.meta.env.VITE_NFT_FACTORY_UNICHAIN_MAINNET,
  [CHAIN_IDS.UNICHAIN]: import.meta.env.VITE_NFT_FACTORY_UNICHAIN,
  [CHAIN_IDS.MOONWALKER]: import.meta.env.VITE_NFT_FACTORY_MOONWALKER
};

const NETWORK_NAMES = {
  [CHAIN_IDS.SEPOLIA]: 'Sepolia',
  [CHAIN_IDS.POLYGON]: 'Polygon',
  [CHAIN_IDS.UNICHAIN]: 'Unichain',
  [CHAIN_IDS.MOONWALKER]: 'Moonwalker'
};

const NETWORK_CURRENCIES = {
  [CHAIN_IDS.SEPOLIA]: 'ETH',
  [CHAIN_IDS.POLYGON]: 'POL',
  [CHAIN_IDS.UNICHAIN]: 'ETH',
  [CHAIN_IDS.MOONWALKER]: 'ZERO'
};

// Add required keyframe animations at the top of the file
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

// Icons for NFT creation progress modal
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
  CreatingCollection: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M7 8h10M7 12h10M7 16h10" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite' }} />
        <path d="M12 6v12" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite', animationDelay: '0.5s' }} />
        <path d="M9 6l6 12M15 6l-6 12" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite', animationDelay: '1s' }} />
        <circle cx="12" cy="12" r="3" style={{ animation: 'rotate 4s linear infinite' }} />
      </g>
    </svg>
  ),
  SettingWhitelist: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <g strokeWidth={1.5} stroke="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeOpacity="0.2" />
        <path d="M12 8v8" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite' }} />
        <path d="M8 12h8" strokeLinecap="round" style={{ animation: 'draw 2s ease-in-out infinite', animationDelay: '0.3s' }} />
        <path d="M7 7l2 2 2-2M13 15l2 2 2-2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'bounce 2s ease-in-out infinite', animationDelay: '0.6s' }} />
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
const ProgressModal = ({ isOpen, onClose, currentStep, collectionName, error }) => {
  const steps = [
    { key: 'preparing', label: 'Preparing Transaction', icon: Icons.Preparing },
    { key: 'uploading', label: 'Uploading Metadata', icon: Icons.UploadingMetadata },
    { key: 'creating', label: 'Creating Collection', icon: Icons.CreatingCollection },
    { key: 'whitelist', label: 'Setting Whitelist', icon: Icons.SettingWhitelist },
    { key: 'completed', label: 'Collection Created Successfully', icon: Icons.Completed }
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

  return createPortal(
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[10000]" onClose={onClose}>
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
                  {isError ? 'Error Creating Collection' : 'Creating NFT Collection'}
                  {collectionName && !isError && (
                    <div className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {collectionName}
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
                              Creating collection {collectionName}
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
                  <div className="mt-6 text-center">
                    <p className="text-[#00ffbd] font-medium">Collection created successfully!</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>,
    document.body
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

const STEPS = [
  { id: 'type', title: 'Collection Type' },
  { id: 'basics', title: 'Basic Info' },
  { id: 'artwork', title: 'Artwork' },
  { id: 'properties', title: 'Properties' },
  { id: 'minting', title: 'Minting' },
];

const CREATION_FEES = {
  137: "2 POL",  // Polygon
  11155111: "0.015 ETH",  // Sepolia
  1: "0.015 ETH",  // Mainnet
  1301: "0.015 ETH", // Unichain
  1828369849: "369 ZERO", // Moonwalker
};

const setWhitelistInContract = async (collectionAddress, whitelistAddresses, signer) => {
  try {
    const contract = new ethers.Contract(
      collectionAddress,
      NFTCollectionABI.ERC721,
      signer
    );
    
    // Convert addresses and limits to separate arrays
    const addresses = whitelistAddresses.map(item => 
      typeof item === 'string' ? item : item.address
    );
    const limits = whitelistAddresses.map(item => 
      typeof item === 'string' ? 1 : BigInt(item.maxMint)
    );
    
    toast.loading('Setting whitelist addresses...', { id: 'whitelist' });
    const tx = await contract.setWhitelist(addresses, limits);
    await tx.wait();
    toast.success('Whitelist addresses set successfully!', { id: 'whitelist' });
  } catch (error) {
    console.error('Error setting whitelist:', error);
    toast.error('Failed to set whitelist addresses', { id: 'whitelist' });
    throw error;
  }
};

// Separate AddressModal component with isolated event handling
const AddressModal = ({ isOpen, onClose, addresses, onRemoveAddress, onUpdateAddress }) => {
  if (!isOpen) return null;

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleMintLimitChange = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newValue = e.target.value;
    const updatedAddresses = [...addresses];
    
    // Allow empty string or numbers
    const limit = newValue === '' ? '' : parseInt(newValue) || '';
    
    if (typeof updatedAddresses[index] === 'string') {
      updatedAddresses[index] = { 
        address: updatedAddresses[index], 
        maxMint: limit 
      };
    } else {
      updatedAddresses[index] = { 
        ...updatedAddresses[index], 
        maxMint: limit 
      };
    }
    
    onUpdateAddress({ whitelistAddresses: updatedAddresses });
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100]"
      onClick={handleModalClick}
    >
      <div className="fixed inset-0 bg-black/70" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-2xl transform rounded-lg bg-white dark:bg-[#0a0b0f] p-6 relative"
          onClick={handleModalClick}
        >
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

          {/* Close button */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-white dark:bg-[#0a0b0f] border border-[#00ffbd] rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50"
          >
            <BiX size={20} className="text-[#00ffbd]" />
          </button>

          {/* Main Content */}
          <div className="mt-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Whitelist Addresses
            </h2>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar [&::-webkit-scrollbar-thumb]:bg-[#00ffbd] hover:[&::-webkit-scrollbar-thumb]:bg-[#00e6a9]">
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2b2f] transition-colors"
                    >
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 flex-1">
                        {typeof addr === 'object' ? addr.address : addr}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Mint limit:</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={typeof addr === 'object' ? (addr.maxMint === '' ? '' : addr.maxMint) : 1}
                            onChange={(e) => handleMintLimitChange(index, e)}
                            onBlur={(e) => {
                              const value = e.target.value;
                              const updatedAddresses = [...addresses];
                              const finalValue = value === '' || parseInt(value) < 1 ? 1 : parseInt(value);
                              
                              if (typeof updatedAddresses[index] === 'string') {
                                updatedAddresses[index] = { 
                                  address: updatedAddresses[index], 
                                  maxMint: finalValue 
                                };
                              } else {
                                updatedAddresses[index] = { 
                                  ...updatedAddresses[index], 
                                  maxMint: finalValue 
                                };
                              }
                              
                              onUpdateAddress({ whitelistAddresses: updatedAddresses });
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              // Allow backspace, delete, and arrow keys
                              if (e.key === 'Backspace' || e.key === 'Delete' || 
                                  e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                                  e.key === 'Tab') {
                                return;
                              }
                              // Only allow numbers
                              if (!/[0-9]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                                e.preventDefault();
                              }
                            }}
                            className="w-16 px-2 py-1 bg-white dark:bg-[#0d0e12] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded text-sm focus:border-[#00ffbd] focus:ring-1 focus:ring-[#00ffbd] focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.target.select();
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveAddress(index);
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <BiTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No addresses added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const getExplorerUrl = (chainId, type, value) => {
  const baseUrl = EXPLORER_URLS[chainId] || EXPLORER_URLS[CHAIN_IDS.SEPOLIA];
  
  switch (type) {
    case 'tx':
      return `${baseUrl}/tx/${value}`;
    case 'token':
      return `${baseUrl}/token/${value}`;
    case 'address':
      return `${baseUrl}/address/${value}`;
    default:
      return `${baseUrl}/tx/${value}`;
  }
};

export default function CreateNFTModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { chain } = useNetwork();
  const [currentStep, setCurrentStep] = useState('type');
  const [newAddress, setNewAddress] = useState('');
  const [currentChainId, setCurrentChainId] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStep, setProgressStep] = useState(null);
  const [progressError, setProgressError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isMintingTokenOpen, setIsMintingTokenOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    symbol: '',
    description: '',
    website: '',
    category: '',
    socials: {
      twitter: '',
      discord: '',
      telegram: '',
      zos: ''
    },
    artwork: null,
    previewUrl: null,
    artworkType: null,
    attributes: [],
    mintPrice: '',
    maxSupply: '',
    maxPerWallet: '',
    releaseDate: '',
    mintEndDate: '',
    infiniteMint: false,
    enableWhitelist: false,
    whitelistAddresses: [],
    mintingToken: 'native',
    customTokenAddress: '',
    customTokenSymbol: '',
    royaltyFeePercent: '',
    royaltyFeeNumerator: 0,
    royaltyReceiver: ''
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add near the top of the component, after the initial state declarations
  const [chainId, setChainId] = useState(null);

  // Add chain detection effect
  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        try {
          const id = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(id, 16));
        } catch (error) {
          console.error('Error getting chain ID:', error);
        }
      }
    };

    getChainId();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (id) => setChainId(parseInt(id, 16)));
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', (id) => setChainId(parseInt(id, 16)));
      }
    };
  }, []);

  // Add helper function to get available tokens
  const getAvailableTokens = () => {
    if (chainId === 130) { // Unichain Mainnet
      return [
        {
          id: 'native',
          name: 'Native Token (ETH)',
          icon: <FaEthereum className="text-[#00ffbd]" />,
          address: '',
          symbol: 'ETH'
        },
        {
          id: 'custom',
          name: 'Custom Token',
          icon: <BiWallet className="text-[#00ffbd]" />,
          address: '',
          symbol: ''
        }
      ];
    } else if (chainId === 1301) { // Unichain Testnet
      return [
        {
          id: 'native',
          name: 'Native Token (ETH)',
          icon: <FaEthereum className="text-[#00ffbd]" />,
          address: '',
          symbol: 'ETH'
        },
        {
          id: 'custom',
          name: 'Custom Token',
          icon: <BiWallet className="text-[#00ffbd]" />,
          address: '',
          symbol: ''
        }
      ];
    } else if (chainId === 137) { // Polygon
      return [
        {
          id: 'native',
          name: 'Native Token (POL)',
          icon: <img src="/polygon.png" alt="POL" className="w-5 h-5" />,
          address: '',
          symbol: 'POL'
        },
        {
          id: 'custom',
          name: 'Custom Token',
          icon: <BiWallet className="text-[#00ffbd]" />,
          address: '',
          symbol: ''
        }
      ];
    }
    
    // Default or unsupported chain
    return [
      {
        id: 'custom',
        name: 'Custom Token',
        icon: <BiWallet className="text-[#00ffbd]" />,
        address: '',
        symbol: ''
      }
    ];
  };

  // Replace the token selection UI with this
  const renderTokenSelection = () => {
    const availableTokens = getAvailableTokens();
    const selectedToken = availableTokens.find(t => t.id === formData.mintingToken) || availableTokens[0];

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMintingTokenOpen(!isMintingTokenOpen)}
          className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {selectedToken.icon}
            <span>{formData.mintingToken === 'custom' && formData.customTokenSymbol 
              ? formData.customTokenSymbol 
              : selectedToken.name}</span>
          </div>
          <BiChevronDown className={`transition-transform ${isMintingTokenOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMintingTokenOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1a1b1f] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            {availableTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => {
                  updateFormData({ 
                    mintingToken: token.id,
                    customTokenAddress: token.address,
                    customTokenSymbol: token.symbol
                  });
                  setIsMintingTokenOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-900 dark:text-white hover:bg-[#00ffbd]/10 flex items-center gap-2"
              >
                {token.icon}
                <span>{token.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getCreationFee = async () => {
    try {
      // Get chain ID from window.ethereum
      let chainId;
      if (window.ethereum) {
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
        chainId = parseInt(chainId, 16);
      }
      
      if (!chainId) {
        console.error('Chain ID not available');
        return null;
      }
      
      // Get the factory contract for the current chain
      const factoryAddress = NFT_FACTORY_ADDRESSES[chainId];
      if (!factoryAddress) {
        console.error('Factory address not found for chain:', chainId);
        return null;
      }

      // Get the provider for the current chain
      const provider = new ethers.JsonRpcProvider(
        chainId === CHAIN_IDS.POLYGON ? "https://polygon-rpc.com" :
        chainId === CHAIN_IDS.UNICHAIN ? "https://sepolia.unichain.org" :
        chainId === CHAIN_IDS.UNICHAIN_MAINNET ? "https://mainnet.unichain.org" :
        "https://polygon-rpc.com" // Default to Polygon RPC
      );

      // Create contract instance
      const factoryContract = new ethers.Contract(
        factoryAddress,
        ['function chainFees(uint256) view returns (uint256)'],
        provider
      );

      // Get the fee from the contract
      const fee = await factoryContract.chainFees(chainId);
      
      // Format the fee based on the chain
      const formattedFee = ethers.formatEther(fee);
      const currency = NETWORK_CURRENCIES[chainId] || 'ETH';
      
      return `${formattedFee} ${currency}`;
    } catch (error) {
      console.error('Error getting creation fee:', error);
      return null;
    }
  };

  // Update useEffect to call getCreationFee
  useEffect(() => {
    const init = async () => {
      await getCreationFee().then(fee => {
        setFormData(prev => ({
          ...prev,
          fee
        }));
      });
    };
    init();
  }, []);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const isVideo = file.type === 'video/mp4';
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image or MP4 video file');
        return;
      }

      // Check file size
      const maxSize = isVideo ? 5 * 1024 * 1024 : 2 * 1024 * 1024; // 5MB for video, 2MB for images
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${isVideo ? '5MB' : '2MB'}`);
        return;
      }

      const url = URL.createObjectURL(file);
      updateFormData({ 
        artwork: file, 
        previewUrl: url,
        artworkType: isVideo ? 'video' : 'image'
      });
    }
  };

  const validateAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleWhitelistImport = async (file) => {
    try {
      let addresses = [];
      
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
        addresses = result.data
          .map(row => {
            const addr = row.address || row.wallet || Object.values(row)[0];
            const limit = parseInt(row.limit || row.maxMint || 1);
            return addr ? { address: addr, maxMint: limit } : null;
          })
          .filter(Boolean);
      } 
      else if (file.name.endsWith('.xlsx')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        addresses = XLSX.utils.sheet_to_json(sheet)
          .map(row => {
            const addr = row.address || row.wallet || Object.values(row)[0];
            const limit = parseInt(row.limit || row.maxMint || 1);
            return addr ? { address: addr, maxMint: limit } : null;
          });
      }
      else if (file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        addresses = Array.isArray(data) ? data : Object.values(data);
        addresses = addresses.map(item => {
          if (typeof item === 'string') {
            return { address: item, maxMint: 1 };
          }
          return {
            address: item.address || item.wallet,
            maxMint: parseInt(item.limit || item.maxMint || 1)
          };
        });
      }

      // Filter valid addresses and remove duplicates
      const validAddresses = [...new Set(
        addresses
          .filter(item => item && item.address && validateAddress(item.address))
          .map(item => JSON.stringify({ address: item.address.toLowerCase(), maxMint: item.maxMint }))
      )].map(str => JSON.parse(str));

      if (validAddresses.length === 0) {
        toast.error('No valid addresses found in file');
        return;
      }

      updateFormData({ whitelistAddresses: validAddresses });
      toast.success(
        <div className="flex flex-col">
          <span>Imported {validAddresses.length} addresses</span>
          <span className="text-sm text-gray-400 mt-1">Click the counter to view the list</span>
        </div>
      );
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error(`Failed to import ${type} file. Please check the format.`);
    }
  };

  const handleSubmit = async () => {
    try {
      // Dismiss the whitelist info toast when creating collection
      toast.dismiss('whitelist-info');
      
      if (!account) {
        toast.error('Please connect your wallet first');
        return;
      }

      // Validate form data
      if (!formData.type || !formData.name || !formData.symbol || !formData.artwork) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkChainId = parseInt(currentChainId, 16);

      // Get factory address for current chain
      let factoryAddress;
      if (networkChainId === 137) { // Polygon Mainnet
        factoryAddress = import.meta.env.VITE_NFT_FACTORY_POLYGON;
      } else if (networkChainId === 130) { // Unichain Mainnet
        factoryAddress = import.meta.env.VITE_NFT_FACTORY_UNICHAIN_MAINNET;
      } else if (networkChainId === 1301) { // Unichain Testnet
        factoryAddress = import.meta.env.VITE_NFT_FACTORY_UNICHAIN_TESTNET;
      } else if (networkChainId === 1828369849) { // Moonwalker
        factoryAddress = import.meta.env.VITE_NFT_FACTORY_MOONWALKER;
      }

      if (!factoryAddress) {
        toast.error(`Factory address not found for network with chain ID ${networkChainId}`);
        return;
      }

      setShowProgressModal(true);
      setProgressStep('preparing');
      setProgressError(null);

      const signer2 = await provider.getSigner();
      
      // Calculate fee based on network
      const actualFee = await getCreationFee();
      if (!actualFee) {
        toast.error('Failed to get creation fee from contract');
        return;
      }
      // Extract just the numeric part before parsing to ether
      const [numericFee] = actualFee.split(' '); // Split by space and take first part
      const fee = ethers.parseEther(numericFee); // Parse only the numeric part
      console.log('Setting fee:', fee.toString());

      try {
        // Step 1: Upload metadata
        setProgressStep('uploading');
        const { metadataUrl, imageHttpUrl, imageIpfsUrl } = await prepareAndUploadMetadata(formData, formData.artwork);

        // Step 2: Create collection
        setProgressStep('creating');
        const factory = new ethers.Contract(factoryAddress, NFTFactoryABI, signer2);

        const paymentTokenAddress = getPaymentToken(networkChainId);
        console.log('Payment Token being set:', {
          type: formData.mintingToken,
          address: paymentTokenAddress,
          customAddress: formData.customTokenAddress
        });

        // For whitelist collections, set a high maxPerWallet in the contract config
        // since we'll control individual limits through the whitelist
        const maxPerWallet = formData.enableWhitelist 
          ? BigInt(1000000) // High number to effectively remove the general limit
          : BigInt(formData.maxPerWallet || 1);

        // Verify fee amount before sending transaction
        const parsedFee = Number(ethers.formatEther(fee));
        const expectedFee = Number(numericFee);
        if (parsedFee !== expectedFee) {
          throw new Error(`Invalid fee amount: ${parsedFee}. Expected: ${expectedFee}`);
        }

        const tx = await factory.createNFTCollection(
          {
            collectionType: formData.type === 'ERC721' ? 'ERC721' : 'ERC1155',
            name: formData.name,
            symbol: formData.symbol,
            metadataURI: 'ipfs://', // Set base URI as ipfs:// protocol
            maxSupply: BigInt(formData.maxSupply || 10000),
            mintPrice: parseEther(formData.mintPrice || '0'),
            maxPerWallet: maxPerWallet,
            releaseDate: BigInt(formData.releaseDate ? Math.floor(new Date(formData.releaseDate).getTime() / 1000) : Math.floor(Date.now() / 1000)),
            mintEndDate: BigInt(formData.mintEndDate ? Math.floor(new Date(formData.mintEndDate).getTime() / 1000) : 0),
            infiniteMint: Boolean(formData.infiniteMint),
            paymentToken: formData.mintingToken === 'native' ? '0x0000000000000000000000000000000000000000' : 
              formData.mintingToken === 'custom' ? formData.customTokenAddress :
              paymentTokenAddress || '0x0000000000000000000000000000000000000000',
            enableWhitelist: Boolean(formData.enableWhitelist),
            royaltyReceiver: formData.royaltyReceiver || account,
            royaltyFeeNumerator: BigInt(formData.royaltyFeeNumerator || 0)
          },
          { value: fee }
        );

        const receipt = await tx.wait();

        // Get collection address from events
        let collectionAddress;
        const creationEvent = receipt.logs.find(log => 
          log.topics[0] === '0xaf1866185e64615f1cfc5b81e7bf1ff8beafdc402920eb36641743d8fe5f7757'
        );

        if (creationEvent) {
          const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
            ['tuple(address creator, address collection, string collectionType, string name, string symbol, uint256 maxSupply, uint256 mintPrice, uint256 maxPerWallet, uint256 releaseDate, uint256 mintEndDate, bool infiniteMint)'],
            creationEvent.data
          );
          collectionAddress = decodedData[0].collection;
        }

        if (!collectionAddress) {
          const initializedEvent = receipt.logs.find(log => 
            log.topics[0] === '0x82dfd53401a55bb491abcb3e7a97c99da1ed7eaffd89721d3e96e8e8ad4a692d'
          );
          collectionAddress = initializedEvent?.address;
        }

        if (!collectionAddress) {
          setProgressStep('error');
          setProgressError('Failed to get collection address from transaction');
          return;
        }

        // Step 3: Set whitelist if enabled
        if (formData.enableWhitelist && formData.whitelistAddresses.length > 0) {
          setProgressStep('whitelist');
          const nftContract = new ethers.Contract(
            collectionAddress,
            NFTCollectionABI.ERC721,
            signer2
          );
          
          // Convert addresses and limits to separate arrays
          const addresses = formData.whitelistAddresses.map(item => 
            typeof item === 'string' ? item : item.address
          );
          const limits = formData.whitelistAddresses.map(item => 
            typeof item === 'string' ? BigInt(1) : BigInt(item.maxMint)
          );
          
          const whitelistTx = await nftContract.setWhitelist(addresses, limits);
          await whitelistTx.wait();
        }

        // Save collection data
        const collectionData = {
          ...formData,
          contractAddress: collectionAddress,
          network: networkChainId === 1301 ? 'unichain' : 
                  networkChainId === 11155111 ? 'sepolia' : 
                  networkChainId === 137 ? 'polygon' : 
                  networkChainId === 1828369849 ? 'moonwalker' : 'unknown',
          chainId: networkChainId,
          previewUrl: imageHttpUrl,
          imageIpfsUrl: imageIpfsUrl,
          metadataUrl: metadataUrl,
          mintToken: {
            type: formData.mintingToken || 'native',
            symbol: formData.mintingToken === 'usdc' ? 'USDC' : 
                    formData.mintingToken === 'usdt' ? 'USDT' : 
                    formData.mintingToken === 'custom' ? formData.customTokenSymbol :
                    formData.mintingToken === 'native' ? (networkChainId === 137 ? 'POL' : 'ETH') :
                    networkChainId === 137 ? 'POL' : 'ETH',
            address: formData.mintingToken === 'native' ? '0x0000000000000000000000000000000000000000' : 
                    formData.mintingToken === 'custom' ? formData.customTokenAddress :
                    paymentTokenAddress || '0x0000000000000000000000000000000000000000'
          },
          whitelistAddresses: formData.whitelistAddresses,
          createdAt: Date.now(),
          totalMinted: 0,
          creatorAddress: account.toLowerCase()
        };

        await saveCollection(collectionData);
        
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

        onClose();
        navigate(`/collection/${formData.symbol}`);

      } catch (error) {
        console.error('Error in collection creation process:', error);
        setProgressStep('error');
        setProgressError(error.message || 'Failed to create collection. Please try again.');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setProgressStep('error');
      setProgressError('Failed to start collection creation. Please check your inputs and try again.');
    }
  };

  // Update the JSON import handling
  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'csv' ? '.csv' : 
                   type === 'excel' ? '.xlsx,.xls' : 
                   '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        let addresses = [];
        
        if (type === 'json') {
          const text = await file.text();
          let jsonData;
          try {
            jsonData = JSON.parse(text);
          } catch (e) {
            console.error('JSON parse error:', e);
            toast.error('Invalid JSON format');
            return;
          }

          // Simple function to extract addresses from any string
          const getAddressFromString = (str) => {
            if (typeof str !== 'string') return null;
            const match = str.match(/0x[a-fA-F0-9]{40}/);
            return match ? match[0] : null;
          };

          // Function to process any value and extract addresses
          const processValue = (value) => {
            const found = new Set();

            const process = (item) => {
              // If it's a string, try to extract address
              if (typeof item === 'string') {
                const addr = getAddressFromString(item);
                if (addr) found.add(addr);
                return;
              }

              // If it's an array, process each item
              if (Array.isArray(item)) {
                item.forEach(process);
                return;
              }

              // If it's an object, process each value
              if (item && typeof item === 'object') {
                Object.values(item).forEach(process);
              }
            };

            process(value);
            return Array.from(found);
          };

          // Process the JSON data
          const foundAddresses = processValue(jsonData);
          console.log('Found addresses:', foundAddresses);
          addresses = foundAddresses.map(addr => ({ address: addr, maxMint: 1 }));
        } 
        else {
          if (type === 'csv') {
            const text = await file.text();
            // Split by newline and comma to handle both formats
            const lines = text.split(/[\r\n,]+/);
            addresses = lines
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .map(address => ({
                address: address.replace(/['"]/g, ''), // Remove quotes if present
                maxMint: 1
              }));
          } 
          else if (type === 'excel') {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
            
            // Extract addresses from all cells
            addresses = rows.flatMap(row => {
              if (!Array.isArray(row)) return [];
              return row.map(cell => {
                if (!cell) return null;
                const str = String(cell).trim();
                return str.startsWith('0x') ? { address: str, maxMint: 1 } : null;
              }).filter(Boolean);
            });
          }
        }

        // Filter valid addresses and remove duplicates
        const validAddresses = [...new Set(
          addresses
            .filter(item => item && item.address && validateAddress(item.address))
            .map(item => item.address)
        )].map(addr => ({ address: addr, maxMint: 1 }));

        console.log('Valid addresses:', validAddresses);

        if (validAddresses.length === 0) {
          toast.error('No valid addresses found in file');
          return;
        }

        updateFormData({ whitelistAddresses: validAddresses });
        toast.success(
          <div className="flex flex-col">
            <span>Imported {validAddresses.length} addresses</span>
            <span className="text-sm text-gray-400 mt-1">Click the counter to view the list</span>
          </div>
        );
      } catch (error) {
        console.error('Error importing file:', error);
        toast.error(`Failed to import ${type} file. Please check the format.`);
      }
    }

    input.click();
  };

  const renderStep = () => {
    // Common button layout that we'll add to each step
    const renderButtons = () => (
      <div className="flex justify-between items-center gap-3 mt-6">
        {currentStep !== 'type' && (
          <button 
            onClick={() => {
              const currentIndex = STEPS.findIndex(s => s.id === currentStep);
              setCurrentStep(STEPS[currentIndex - 1].id);
            }}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
          >
            Back
          </button>
        )}
        {currentStep !== 'minting' && ( // Only show Continue button if not on last step
          <button
            onClick={handleButtonClick}
            className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors ml-auto"
          >
            Continue
          </button>
        )}
        {currentStep === 'minting' && ( // Show Create Collection button on last step
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors ml-auto"
          >
            Create Collection
          </button>
        )}
      </div>
    );

    switch (currentStep) {
      case 'type':
        return (
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
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create NFT Collection
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your collection type. Creation fee: {formData.fee || 'Loading...'} 
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    updateFormData({ type: 'ERC721' });
                    setCurrentStep('basics');
                  }}
                  className={clsx(
                    'p-4 rounded-lg border-2 text-left',
                    'hover:border-[#00ffbd] transition-colors',
                    formData.type === 'ERC721' 
                      ? 'border-[#00ffbd]' 
                      : 'border-gray-200 dark:border-gray-800'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FaEthereum size={24} className="text-[#00ffbd]" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">ERC-721</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Traditional NFTs, unique and non-divisible
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    updateFormData({ type: 'ERC1155' });
                    setCurrentStep('basics');
                  }}
                  className={clsx(
                    'p-4 rounded-lg border-2',
                    'hover:border-[#00ffbd] transition-colors',
                    formData.type === 'ERC1155' 
                      ? 'border-[#00ffbd]' 
                      : 'border-gray-200 dark:border-gray-800'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <FaEthereum size={24} className="text-[#00ffbd]" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">ERC-1155</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Multi-token standard, semi-fungible
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              {renderButtons()}
            </div>
          </div>
        );
      case 'basics':
        return (
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
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                  placeholder="My NFT Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol *
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => updateFormData({ symbol: e.target.value.toUpperCase() })}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                  placeholder="MYNFT"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none h-24"
                  placeholder="Describe your collection..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData({ website: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData({ category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="art">Art</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="gaming">Gaming</option>
                    <option value="music">Music</option>
                    <option value="photography">Photography</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Social Links
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Twitter Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                      <input
                        type="text"
                        value={formData.socials.twitter}
                        onChange={(e) => updateFormData({
                          socials: { ...formData.socials, twitter: e.target.value }
                        })}
                        className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg pl-8 p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                        placeholder="username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Discord Server
                    </label>
                    <input
                      type="url"
                      value={formData.socials.discord}
                      onChange={(e) => updateFormData({
                        socials: { ...formData.socials, discord: e.target.value }
                      })}
                      className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="https://discord.gg/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Telegram Group
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">t.me/</span>
                      <input
                        type="text"
                        value={formData.socials.telegram}
                        onChange={(e) => updateFormData({
                          socials: { ...formData.socials, telegram: e.target.value }
                        })}
                        className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg pl-12 p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                        placeholder="groupname"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                      ZOS Profile
                    </label>
                    <input
                      type="url"
                      value={formData.socials.zos}
                      onChange={(e) => updateFormData({
                        socials: { ...formData.socials, zos: e.target.value }
                      })}
                      className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="https://zos.zero.tech/..."
                    />
                  </div>
                </div>
              </div>
              {renderButtons()}
            </div>
          </div>
        );
      case 'artwork':
        return (
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
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 space-y-6">
              <div className="flex justify-center">
                <div className="w-64 h-64 relative">
                  <div 
                    className={clsx(
                      'w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden',
                      formData.previewUrl ? 'border-[#00ffbd]' : 'border-gray-300 dark:border-gray-700'
                    )}
                  >
                    {formData.previewUrl ? (
                      formData.artworkType === 'video' ? (
                        <video 
                          src={formData.previewUrl} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img 
                          src={formData.previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="text-center">
                        <div className="flex justify-center gap-4 mb-2">
                          <BiImageAdd size={24} className="text-gray-400" />
                          <BiVideo size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">
                          Drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supported: Images (2MB) or MP4 Videos (5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/mp4"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {formData.previewUrl && (
                <div className="text-center">
                  <button
                    onClick={() => updateFormData({ 
                      artwork: null, 
                      previewUrl: null,
                      artworkType: null
                    })}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove File
                  </button>
                </div>
              )}
              {renderButtons()}
            </div>
          </div>
        );
      case 'properties':
        return (
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
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attributes/traits
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Add traits that make your NFTs unique
                  </p>
                </div>
                <button
                  onClick={() => updateFormData({
                    attributes: [...formData.attributes, { trait_type: '', value: '' }]
                  })}
                  className="px-3 py-1.5 text-sm bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg"
                >
                  Add Attribute
                </button>
              </div>

              {formData.attributes.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500">
                    No attributes added yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.attributes.map((prop, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          placeholder="Attribute name"
                          value={prop.trait_type}
                          onChange={(e) => {
                            const newProps = [...formData.attributes];
                            newProps[index].trait_type = e.target.value;
                            updateFormData({ attributes: newProps });
                          }}
                          className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          placeholder="Value"
                          value={prop.value}
                          onChange={(e) => {
                            const newProps = [...formData.attributes];
                            newProps[index].value = e.target.value;
                            updateFormData({ attributes: newProps });
                          }}
                          className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newProps = formData.attributes.filter((_, i) => i !== index);
                          updateFormData({ attributes: newProps });
                        }}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <BiX size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {renderButtons()}
            </div>
          </div>
        );
      case 'minting':
        return (
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
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minting Currency *
                </label>
                {renderTokenSelection()}
              </div>

              {formData.mintingToken === 'custom' && (
                <div className="mt-4 space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Custom Token Address *
                    </label>
                    <input
                      type="text"
                      value={formData.customTokenAddress}
                      onChange={(e) => updateFormData({ customTokenAddress: e.target.value })}
                      className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="Enter token contract address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Custom Token Symbol *
                    </label>
                    <input
                      type="text"
                      value={formData.customTokenSymbol}
                      onChange={(e) => updateFormData({ customTokenSymbol: e.target.value })}
                      className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="Enter token symbol"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Mint Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.000000000000000001"
                      value={formData.mintPrice}
                      onChange={(e) => updateFormData({ mintPrice: e.target.value })}
                      className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg pl-16 p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Royalty Fee (%)
                  </label>
                  <input
                    type="number"
                    value={formData.royaltyFeePercent}
                    onChange={(e) => updateFormData({ royaltyFeePercent: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter royalty percentage (0-100) (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Royalty Receiver Address
                  </label>
                  <input
                    type="text"
                    value={formData.royaltyReceiver}
                    onChange={(e) => updateFormData({ royaltyReceiver: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter address (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Max Supply *
                  </label>
                  <input
                    type="number"
                    value={formData.maxSupply}
                    onChange={(e) => updateFormData({ maxSupply: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter max supply"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Max Per Wallet *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxPerWallet}
                    onChange={(e) => updateFormData({ maxPerWallet: e.target.value })}
                    placeholder="Enter max per wallet"
                    className={`w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00ffbd] ${
                      formData.enableWhitelist ? 'cursor-not-allowed bg-gray-100 dark:bg-[#1a1b1f] opacity-75' : ''
                    }`}
                    disabled={formData.enableWhitelist}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Release Date *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.releaseDate}
                    onChange={(e) => updateFormData({ releaseDate: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.enableWhitelist}
                    onChange={(e) => handleWhitelistToggle(e.target.checked)}
                    className="w-4 h-4 text-[#00ffbd] border-gray-300 rounded focus:ring-[#00ffbd]"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Enable whitelist for early minting
                  </span>
                </label>
              </div>

              {formData.enableWhitelist && (
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Import Whitelist
                    </h3>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="text-xs text-[#00ffbd] hover:text-[#00e6a9] transition-colors flex items-center gap-1"
                    >
                      <span>{formData.whitelistAddresses.length} Addresses</span>
                      <BiListUl size={16} />
                    </button>
                  </div>

                  {/* Manual address input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter wallet address (0x...)"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="flex-1 bg-white dark:bg-[#0d0e12] text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    />
                    <button
                      onClick={handleAddAddress}
                      className="px-3 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </div>

                  {/* File import buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFileUpload('csv')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1b1f]"
                    >
                      <FaFileCsv size={16} />
                      Import CSV
                    </button>
                    <button
                      onClick={() => handleFileUpload('excel')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1b1f]"
                    >
                      <FaFileExcel size={16} />
                      Import EXCEL
                    </button>
                    <button
                      onClick={() => handleFileUpload('json')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1b1f]"
                    >
                      <FaFileCode size={16} />
                      Import JSON
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Mint End Date *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    value={formData.mintEndDate}
                    onChange={(e) => updateFormData({ mintEndDate: e.target.value })}
                    className={`flex-1 bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none ${
                      formData.infiniteMint ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={formData.infiniteMint}
                    required={!formData.infiniteMint}
                  />
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.infiniteMint}
                      onChange={(e) => updateFormData({ infiniteMint: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00ffbd]/20 dark:peer-focus:ring-[#00ffbd]/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#00ffbd]"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Infinite Mint</span>
                  </label>
                </div>
              </div>
              {renderButtons()}
            </div>
          </div>
        );
    }
  };

  const renderWhitelistSection = () => (
    <div 
      className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-50 dark:bg-[#1a1b1f] z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Import Whitelist
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add wallet addresses for whitelist access
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddressModal(true);
              if (formData.whitelistAddresses.length > 0) {
                toast.success('Click the X button to remove addresses', { duration: 3000 });
              }
            }}
            className="px-3 py-1 bg-[#00ffbd]/10 rounded-lg hover:bg-[#00ffbd]/20 transition-colors cursor-pointer group relative"
          >
            <span className="text-sm font-medium text-[#00ffbd]">
              {formData.whitelistAddresses.length} Addresses
            </span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Click to view addresses
            </span>
          </button>
        </div>

        {/* Manual address input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="flex-1 bg-white dark:bg-[#0d0e12] text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddAddress(e);
            }}
            className="px-3 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg text-sm"
          >
            Add
          </button>
        </div>

        {/* File import buttons */}
        <div className="flex gap-2">
          {['csv', 'excel', 'json'].map((type) => (
            <button
              key={type}
              onClick={(e) => {
                e.stopPropagation();
                handleFileUpload(type);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0d0e12] border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1b1f]"
            >
              {type === 'csv' && <FaFileCsv size={16} />}
              {type === 'excel' && <FaFileExcel size={16} />}
              {type === 'json' && <FaFileCode size={16} />}
              Import {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const handleButtonClick = () => {
    if (currentStep === 'minting') {
      handleSubmit();
    } else {
      const currentIndex = STEPS.findIndex(s => s.id === currentStep);
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const getPaymentToken = (chainId) => {
    if (!formData.mintingToken || formData.mintingToken === 'native') {
      // Return native POL address for Polygon network
      if (chainId === 137) {
        return '0x0000000000000000000000000000000000001010';
      }
      return '0x0000000000000000000000000000000000000000';
    }
    
    const tokenAddresses = TOKEN_ADDRESSES[chainId];
    if (!tokenAddresses) {
      console.warn('Token addresses not configured for this network');
      return '0x0000000000000000000000000000000000000000';
    }

    switch (formData.mintingToken) {
      case 'usdc':
        return tokenAddresses.USDC;
      case 'usdt':
        return tokenAddresses.USDT;
      case 'custom':
        return formData.customTokenAddress || '0x0000000000000000000000000000000000000000';
      default:
        return '0x0000000000000000000000000000000000000000';
    }
  };

  // Add Moonwalker to supported networks
  const SUPPORTED_NETWORKS = {
    SEPOLIA: {
      id: 11155111,
      name: 'Sepolia',
      factoryAddress: import.meta.env.VITE_NFT_FACTORY_SEPOLIA,
      fee: '0.015',
      nativeCurrency: 'ETH'
    },
    POLYGON: {
      id: 137,
      name: 'Polygon',
      factoryAddress: import.meta.env.VITE_NFT_FACTORY_POLYGON,
      fee: '20',
      nativeCurrency: 'POL'
    },
    UNICHAIN_MAINNET: {
      id: 130,
      name: 'Unichain Mainnet',
      factoryAddress: import.meta.env.VITE_NFT_FACTORY_UNICHAIN_MAINNET,
      fee: '0.01',
      nativeCurrency: 'ETH'
    },
    UNICHAIN: {
      id: 1301,
      name: 'Unichain Testnet',
      factoryAddress: import.meta.env.VITE_NFT_FACTORY_UNICHAIN,
      fee: '0.015',
      nativeCurrency: 'ETH'
    },
    MOONWALKER: {
      id: 1828369849,
      name: 'Moonwalker',
      factoryAddress: import.meta.env.VITE_NFT_FACTORY_MOONWALKER,
      fee: '369',
      nativeCurrency: 'ZERO'
    }
  };

  // Update the createNFT function to support Moonwalker
  const createNFT = async () => {
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Find network configuration
      const networkConfig = Object.values(SUPPORTED_NETWORKS).find(n => n.id === chainId);
      if (!networkConfig) {
        toast.error('Please switch to a supported network');
        return;
      }

      // Get the correct factory address and fee based on the network
      const factory = new ethers.Contract(
        networkConfig.factoryAddress,
        NFTFactoryABI,
        signer
      );

      // Prepare transaction with explicit chain configuration
      const txParams = {
        value: ethers.parseEther(networkConfig.fee),
        chainId: chainId,
      };

      // Create NFT with transaction parameters
      const tx = await factory.createNFT(
        formData.name,
        formData.symbol,
        formData.baseURI,
        txParams
      );

      toast.loading('Creating NFT collection...', { id: 'create' });
      await tx.wait();
      toast.success('NFT collection created!', { id: 'create' });
      onClose();

    } catch (error) {
      console.error('NFT Creation error:', error);
      toast.error(
        error.message.includes('chain') 
          ? 'Please switch to a supported network'
          : `Failed to create NFT: ${error.message}`,
        { id: 'create' }
      );
    }
  };

  // If wallet is not connected, show connect prompt
  const renderConnectPrompt = () => (
    <div className="text-center py-8">
      <div className="mb-4">
        <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Connect Your Wallet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Please connect your wallet to create an NFT collection
      </p>
      <button
        onClick={openConnectModal}
        className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors"
      >
        Connect Wallet
      </button>
    </div>
  );

  // Add useEffect to get chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setCurrentChainId(parseInt(chainId, 16));
      }
    };
    getChainId();

    // Listen for chain changes
    window.ethereum?.on('chainChanged', (chainId) => {
      setCurrentChainId(parseInt(chainId, 16));
    });
  }, []);

  // Add new state for address modal
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleRemoveAddress = (index) => {
    const newAddresses = formData.whitelistAddresses.filter((_, i) => i !== index);
    updateFormData({ whitelistAddresses: newAddresses });
  };

  // Update the manual address addition
  const handleAddAddress = (e) => {
    e.stopPropagation();
    if (validateAddress(newAddress)) {
      updateFormData({
        whitelistAddresses: [...formData.whitelistAddresses, { address: newAddress, maxMint: 1 }]
      });
      setNewAddress('');
    } else {
      toast.error('Invalid wallet address');
    }
  };

  const handleUpdateWhitelist = (updates) => {
    setFormData(prev => ({
      ...prev,
      whitelistAddresses: updates.whitelistAddresses
    }));
  };

  // Add effect to handle whitelist toggle
  const [enableWhitelist, setEnableWhitelist] = useState(false);
  const [maxPerWallet, setMaxPerWallet] = useState('');

  useEffect(() => {
    if (formData.enableWhitelist) {
      setMaxPerWallet('1000000');  // Set a high default for whitelist mode
    }
  }, [formData.enableWhitelist]);

  const handleWhitelistToggle = (checked) => {
    if (checked) {
      updateFormData({ 
        enableWhitelist: checked,
        maxPerWallet: '1000000'  // Set a high default for whitelist mode
      });
      // Show persistent toast
      toast('When whitelist is enabled, max per wallet is set high to allow individual whitelist limits to control minting. You can set specific mint limits for each address when adding them to the whitelist.', {
        duration: Infinity,
        id: 'whitelist-info'
      });
    } else {
      updateFormData({ 
        enableWhitelist: checked,
        maxPerWallet: ''
      });
      // Dismiss the persistent toast
      toast.dismiss('whitelist-info');
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

  const handleSuccess = async (deployedAddress, eventData, logoUrls) => {
    try {
      // Get chain name based on chain ID
      const getChainName = (chainId) => {
        switch (chainId) {
          case CHAIN_IDS.POLYGON:
            return 'polygon';
          case CHAIN_IDS.SEPOLIA:
            return 'sepolia';
          case CHAIN_IDS.UNICHAIN_MAINNET:
            return 'unichain-mainnet';
          case CHAIN_IDS.UNICHAIN:
            return 'unichain';
          case CHAIN_IDS.MOONWALKER:
            return 'moonwalker';
          default:
            return 'unknown';
        }
      };

      const chainName = getChainName(currentChainId);
      const { imageHttpUrl, imageIpfsUrl, metadataUrl } = logoUrls;

      console.log('Saving NFT collection with data:', {
        name: eventData.name,
        symbol: eventData.symbol,
        address: deployedAddress,
        chainId: currentChainId,
        chainName,
        previewUrl: imageHttpUrl,
        imageIpfsUrl: imageIpfsUrl,
        metadataUrl: metadataUrl,
        description: formData.description,
        timestamp: Date.now(),
        creatorAddress: account.toLowerCase(),
        network: chainName
      });

      await saveCollection({
        name: eventData.name,
        symbol: eventData.symbol,
        address: deployedAddress,
        chainId: currentChainId,
        chainName,
        previewUrl: imageHttpUrl,
        imageIpfsUrl: imageIpfsUrl,
        metadataUrl: metadataUrl,
        description: formData.description,
        timestamp: Date.now(),
        creatorAddress: account.toLowerCase(),
        network: chainName
      });

      console.log('NFT collection saved successfully');
      setDeployedTokenAddress(deployedAddress);
      setProgressStep('completed');
      setShowConfetti(true);
      
      // Clear any existing toasts
      toast.dismiss();
    } catch (error) {
      console.error('Error in handleSuccess:', error);
      setProgressError(error.message);
      toast.error('Failed to save collection data');
    }
  };

  // Add the modal to the main render
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
                    Create NFT Collection
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <BiX size={24} />
                  </button>
                </div>

                {!account ? renderConnectPrompt() : (
                  <>
                    {/* Progress Indicator */}
                    <div className="mb-6">
                      <div className="flex justify-between">
                        {STEPS.map((step, index) => (
                          <div key={step.id} className="flex items-center">
                            <div className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              currentStep === step.id
                                ? 'bg-[#00ffbd] text-black'
                                : STEPS.findIndex(s => s.id === currentStep) > index
                                ? 'bg-[#00ffbd] text-black'
                                : 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-400'
                            )}>
                              {index + 1}
                            </div>
                            {index !== STEPS.length - 1 && (
                              <div className={clsx(
                                'h-0.5 w-full mx-2',
                                STEPS.findIndex(s => s.id === currentStep) > index
                                  ? 'bg-[#00ffbd]'
                                  : 'bg-gray-100 dark:bg-[#1a1b1f]'
                              )} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Content */}
                    {renderStep()}
                  </>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <AddressModal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)}
        addresses={formData.whitelistAddresses}
        onRemoveAddress={handleRemoveAddress}
        onUpdateAddress={handleUpdateWhitelist}
      />
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
        collectionName={formData.name}
        error={progressError}
      />
      <StarRatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onRate={(rating) => {
          console.log('User rated NFT creation:', rating);
          // Here you can implement the logic to save the rating
        }}
      />
    </>
  );
}