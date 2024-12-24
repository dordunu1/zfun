import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
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
import { sepolia, polygon } from 'wagmi/chains';
import { prepareAndUploadMetadata } from '../services/metadata';
import { Contract } from 'ethers';
import { saveCollection } from '../services/firebase';
import FuturisticCard from './FuturisticCard';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { NFTCollectionABI } from '../abi/NFTCollection';
import * as XLSX from 'xlsx';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';

const STEPS = [
  { id: 'type', title: 'Collection Type' },
  { id: 'basics', title: 'Basic Info' },
  { id: 'artwork', title: 'Artwork' },
  { id: 'properties', title: 'Properties' },
  { id: 'minting', title: 'Minting' },
];

const CREATION_FEES = {
  137: "20 POL",  // Polygon
  11155111: "0.015 ETH",  // Sepolia
  1: "0.015 ETH",  // Mainnet
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

export default function CreateNFTModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('type');
  const [newAddress, setNewAddress] = useState('');
  const [currentChainId, setCurrentChainId] = useState(null);
  const [formData, setFormData] = useState({
    type: '', // ERC721 or ERC1155
    name: '',
    symbol: '',
    description: '',
    website: '',
    socials: {
      twitter: '',
      discord: '',
      telegram: '',
      zos: ''
    },
    category: '',
    artwork: null,
    previewUrl: null,
    attributes: [], // Changed from properties to attributes
    mintPrice: '',
    maxSupply: '',
    maxPerWallet: '',
    releaseDate: '',
    whitelist: false,
    whitelistAddresses: [],
    mintingToken: 'native', // 'native', 'usdc', 'usdt', or 'custom'
    customTokenAddress: '',
    customTokenSymbol: '',
    mintEndDate: '',
    infiniteMint: false,
    royaltyFeePercent: '',
    royaltyFeeNumerator: '',
    royaltyReceiver: '',
  });

  const { address: account, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();

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
        openConnectModal();
        return;
      }

      // Validate form data
      if (!formData.type || !formData.name || !formData.symbol || !formData.artwork) {
        toast.error('Please fill in all required fields');
        return;
      }

      toast.loading('Creating your collection...', { id: 'create' });

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer2 = await provider.getSigner();
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkChainId = parseInt(currentChainId, 16);
      
      const factoryAddress = NFT_CONTRACTS[networkChainId]?.NFT_FACTORY;
      if (!factoryAddress) {
        toast.error('Unsupported network');
        return;
      }

      // Calculate fee based on network
      const fee = ethers.parseEther(networkChainId === 137 ? '20' : '0.015');

      // Step 1: Upload metadata
      toast.loading('1/3 - Uploading metadata...', { id: 'create' });
      const { metadataUrl, imageHttpUrl, imageIpfsUrl } = await prepareAndUploadMetadata(formData, formData.artwork);

      // Step 2: Create collection
      toast.loading('2/3 - Creating collection...', { id: 'create' });
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

      toast.loading('2/3 - Confirming transaction...', { id: 'create' });
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
        throw new Error('Failed to get collection address from transaction');
      }

      // Step 3: Set whitelist if enabled
      if (formData.enableWhitelist && formData.whitelistAddresses.length > 0) {
        toast.loading('3/3 - Setting whitelist...', { id: 'create' });
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
        network: networkChainId === 1301 ? 'unichain' : networkChainId === 137 ? 'polygon' : 'sepolia',
        chainId: networkChainId,
        previewUrl: imageHttpUrl,
        imageIpfsUrl: imageIpfsUrl, // Store the actual image IPFS URL
        metadataUrl: metadataUrl,   // Store the metadata URL separately
        mintToken: {
          type: formData.mintingToken || 'native',
          symbol: formData.mintingToken === 'usdc' ? 'USDC' : 
                  formData.mintingToken === 'usdt' ? 'USDT' : 
                  formData.mintingToken === 'custom' ? formData.customTokenSymbol :
                  formData.mintingToken === 'native' ? (networkChainId === 137 ? 'MATIC' : 'ETH') :
                  networkChainId === 137 ? 'MATIC' : 'ETH',
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
      
      toast.success('Collection created successfully!', { id: 'create' });
      onClose();
      navigate(`/collection/${formData.symbol}`);

    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection. Please check the console for details.', { id: 'create' });
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
                  Choose your collection type. Creation fee: {getCreationFee()}
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
                  Minting Currency
                </label>
                <div className="relative">
                  <select
                    value={formData.mintingToken}
                    onChange={(e) => updateFormData({ mintingToken: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 pl-10 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none appearance-none"
                  >
                    <option value="native">Native Token (ETH/POL)</option>
                    <option value="usdc">USDC</option>
                    <option value="usdt">USDT</option>
                    <option value="custom">Custom Token</option>
                  </select>
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {formData.mintingToken === 'native' && <FaEthereum size={16} className="text-[#00ffbd]" />}
                    {formData.mintingToken === 'usdc' && (
                      <img src="/usdc.png" alt="USDC" className="w-4 h-4" />
                    )}
                    {formData.mintingToken === 'usdt' && (
                      <img src="/usdt.png" alt="USDT" className="w-4 h-4" />
                    )}
                    {formData.mintingToken === 'custom' && (
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <BiChevronDown size={20} className="text-gray-500" />
                  </div>
                </div>
              </div>

              {formData.mintingToken === 'custom' && (
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Token Contract Address
                    </label>
                    <input
                      type="text"
                      placeholder="0x..."
                      value={formData.customTokenAddress}
                      onChange={(e) => updateFormData({ customTokenAddress: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Token Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="Enter token symbol"
                      value={formData.customTokenSymbol}
                      onChange={(e) => updateFormData({ customTokenSymbol: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Mint Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.000000000000000001"
                      value={formData.mintPrice}
                      onChange={(e) => updateFormData({ mintPrice: e.target.value })}
                      className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg pl-16 p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      {formData.mintingToken === 'native' && <FaEthereum className="text-gray-400" size={20} />}
                      {formData.mintingToken === 'usdc' && <img src="/usdc.png" alt="USDC" className="w-5 h-5" />}
                      {formData.mintingToken === 'usdt' && <img src="/usdt.png" alt="USDT" className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Royalty Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Royalty Fee (%)
                  </label>
                  <input
                    type="number"
                    value={formData.royaltyFeePercent || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= 0 && value <= 100) {
                        updateFormData({ 
                          royaltyFeePercent: value,
                          royaltyFeeNumerator: Math.floor(value * 100) // Convert percent to basis points
                        });
                      }
                    }}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter royalty percentage (0-100)"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Royalty Receiver Address
                  </label>
                  <input
                    type="text"
                    value={formData.royaltyReceiver || ''}
                    onChange={(e) => updateFormData({ royaltyReceiver: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter address (leave empty to use creator address)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Max Supply
                  </label>
                  <input
                    type="number"
                    value={formData.maxSupply}
                    onChange={(e) => updateFormData({ maxSupply: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
                    placeholder="Enter max supply"
                  />
                </div>

                {/* Max Per Wallet Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 text-sm font-medium mb-2">
                    Max Per Wallet
                  </label>
                  <div className="relative">
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
                    />
                    {formData.enableWhitelist && (
                      <div className="absolute right-3 top-2.5 text-xs text-[#00ffbd] flex items-center">
                        <span className="mr-1">���</span> 
                        <span className="text-gray-600 dark:text-[#00ffbd]">Whitelist Mode</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Release Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.releaseDate}
                    onChange={(e) => updateFormData({ releaseDate: e.target.value })}
                    className="w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none appearance-auto"
                  />
                </div>
              </div>

              {/* Whitelist Toggle */}
              <div className="mb-4">
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
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
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
                  <div className="flex gap-2 mb-3">
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

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mint End Date
                  </label>
                  <input
                    type="datetime-local"
                    disabled={formData.infiniteMint}
                    value={formData.mintEndDate}
                    onChange={(e) => setFormData({ ...formData, mintEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffbd] [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="infiniteMint"
                    checked={formData.infiniteMint}
                    onChange={(e) => setFormData({ ...formData, infiniteMint: e.target.checked, mintEndDate: '' })}
                    className="mr-2"
                  />
                  <label htmlFor="infiniteMint" className="text-sm text-gray-700 dark:text-gray-300">
                    Infinite Mint
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

      // Validate chain
      if (!NFT_CONTRACTS[chainId]) {
        toast.error('Please switch to a supported network');
        return;
      }

      const factory = new ethers.Contract(
        NFT_CONTRACTS[chainId],
        NFTFactoryABI,
        signer
      );

      // Prepare transaction with explicit chain configuration
      const txParams = {
        value: parseEther("0.015"),
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
        onClick={() => {
          openConnectModal();
        }}
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

  const getCreationFee = () => {
    return CREATION_FEES[currentChainId] || "0.015 ETH";
  };

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

  // Add the modal to the main render
  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
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

                {!isConnected ? renderConnectPrompt() : (
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
    </>
  );
} 