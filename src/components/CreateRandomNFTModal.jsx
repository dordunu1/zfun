import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { BiX, BiImageAdd, BiChevronLeft, BiUpload, BiDownload, BiChevronDown, BiWallet, BiVideo, BiListUl, BiTrash } from 'react-icons/bi';
import { FaEthereum, FaFileExcel, FaFileCsv, FaFileCode } from 'react-icons/fa';
import clsx from 'clsx';
import { NFT_CONTRACTS, TOKEN_ADDRESSES } from '../config/contracts';
import { ethers } from 'ethers';
import { RandomNFTFactoryABI } from '../abi/RandomNFTFactory';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { parseEther } from 'viem';
import { prepareAndUploadMetadata } from '../services/metadata';
import { Contract } from 'ethers';
import { saveCollection } from '../services/firebase';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { NFTCollectionABI } from '../abi/NFTCollection';
import * as XLSX from 'xlsx';
import { createPortal } from 'react-dom';
import Papa from 'papaparse';
import { convertExcelToMetadataJson, handleExcelUpload } from '../utils/excelToJson';
import MetadataExampleModal from './MetadataExampleModal';
import PreviewDialog from './PreviewDialog';
import { ipfsToHttp } from '../utils/ipfs';
import axios from 'axios';

const STEPS = [
  { id: 'type', title: 'Collection Type' },
  { id: 'basics', title: 'Basic Info' },
  { id: 'media', title: 'Collection Media' },
  { id: 'artwork', title: 'Artwork & Traits' },
  { id: 'advanced', title: 'Advanced' },
  { id: 'minting', title: 'Minting' }
];

const COLLECTION_TYPES = {
  ERC721R: {
    title: 'Random Mint Collection (ERC-721R)',
    description: 'NFTs with randomized properties revealed instantly upon mint',
    icon: BiListUl
  }
};

const CREATION_FEES = {
  137: "20 POL",  // Polygon
  11155111: "0.015 ETH",  // Sepolia
  1: "0.015 ETH",  // Mainnet
};

// Separate AddressModal component for whitelist management
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

// Add GuidelinesModal component
const GuidelinesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70" />
      
      {/* Modal Container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-3xl bg-white dark:bg-[#0a0b0f] p-6 rounded-lg"
            onClick={e => e.stopPropagation()}
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

            {/* Glowing dots in corners */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd] animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd] animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd] animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd] animate-pulse" />

            {/* Three dots in top right */}
            <div className="absolute top-3 right-3 flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Random Mint Setup Guide
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] transition-colors cursor-pointer focus:outline-none"
              >
                <BiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div>
                <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-[#00ffbd]">1.</span> Prepare Your Collection Data
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Organize your NFT metadata with traits and properties</li>
                  <li>Prepare all image/video files and upload them to IPFS</li>
                  <li>Ensure you have valid IPFS URLs for all media files</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-[#00ffbd]">2.</span> Choose Import Method
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Excel Template: Download and fill the provided template</li>
                  <li>JSON Format: Create a JSON file following the required structure</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-[#00ffbd]">3.</span> Configure Prefixes
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Define prefix groups for your NFTs (e.g., Common, Rare, Legendary)</li>
                  <li>Set the supply count for each prefix</li>
                  <li>Total supply must match the sum of all prefix counts</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-[#00ffbd]">4.</span> Verify and Deploy
                </h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Review the preview to ensure all data is correct</li>
                  <li>Upload the final JSON metadata file to IPFS</li>
                  <li>Deploy your collection with the IPFS metadata URL</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#151619] rounded-lg">
                <p className="text-[#00ffbd] font-medium flex items-center gap-2 mb-3">
                  <span>⚠️</span>
                  <span>Important Notes:</span>
                </p>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>All image/video files must be hosted on IPFS before deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Metadata structure must follow the exact format shown in examples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Changes cannot be made after deployment - verify everything!</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Add these utility functions at the top of the component
const validateIpfsUri = (uri) => {
  if (!uri) return false;
  
  // Check basic IPFS URI format
  if (!uri.startsWith('ipfs://')) {
    return false;
  }
  
  // Get the CID part
  const cid = uri.replace('ipfs://', '').split('/')[0];
  
  // Basic CID validation (this is a simplified check)
  // CIDv0: Qm... (46 chars)
  // CIDv1: bafy... or bafk... (59 chars)
  return (
    (cid.startsWith('Qm') && cid.length === 46) ||
    (cid.startsWith('baf') && cid.length === 59)
  );
};

const formatIpfsUri = (uri) => {
  if (!uri) return '';
  
  // Remove any whitespace
  uri = uri.trim();
  
  // Remove trailing slash if present
  if (uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }
  
  // Add ipfs:// prefix if missing
  if (!uri.startsWith('ipfs://')) {
    // Handle various gateway URLs
    if (uri.includes('ipfs.io/ipfs/')) {
      uri = 'ipfs://' + uri.split('ipfs.io/ipfs/')[1];
    } else if (uri.includes('gateway.pinata.cloud/ipfs/')) {
      uri = 'ipfs://' + uri.split('gateway.pinata.cloud/ipfs/')[1];
    } else if (uri.includes('/ipfs/')) {
      uri = 'ipfs://' + uri.split('/ipfs/')[1];
    } else {
      uri = 'ipfs://' + uri;
    }
  }
  
  return uri;
};

// Helper functions for URL validation
const getValidImageUrl = (url) => {
  if (!url) return '';
  // Check if it's a valid IPFS or HTTP URL
  if (url.startsWith('ipfs://') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Use placeholder if URL is invalid
  return 'https://placeholder.com/nft-image-placeholder.png';
};

const getValidBaseUri = (uri) => {
  if (!uri) return '';
  // Check if it's a valid IPFS or HTTP URL
  if (uri.startsWith('ipfs://') || uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  // Use placeholder if URI is invalid
  return 'ipfs://placeholder/';
};

export default function CreateRandomNFTModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('type');
  const [newAddress, setNewAddress] = useState('');
  const [currentChainId, setCurrentChainId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'ERC721', // Random mint is always ERC721
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
    properties: [],
    mintPrice: '',
    maxSupply: '',
    maxPerWallet: '',
    releaseDate: '',
    whitelist: false,
    whitelistAddresses: [],
    mintingToken: 'native',
    customTokenAddress: '',
    customTokenSymbol: '',
    mintEndDate: '',
    infiniteMint: false,
    // Random mint specific fields
    traits: {},
    prefixes: [],
    isRandomMint: true,
    metadataFile: null,
    metadataUri: '',
    // Royalty settings
    royaltyFee: 2.5,
    royaltyRecipient: '',
  });

  const { address: account, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Add new state for modals and preview
  const [showMetadataExample, setShowMetadataExample] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [isCheckingUri, setIsCheckingUri] = useState(false);
  const [uriStatus, setUriStatus] = useState({ valid: false, message: '' });
  const [showUriPreview, setShowUriPreview] = useState(false);
  const [previewMetadata, setPreviewMetadata] = useState(null);

  // Add template handling functions
  const handleDownloadTemplate = (type) => {
    const workbook = XLSX.utils.book_new();

    // Collection sheet
    const collectionData = [
      { field: 'name', value: 'My Random Collection' },
      { field: 'description', value: 'A collection of random NFTs' },
      { field: 'prefix_NS_count', value: 400 },
      { field: 'prefix_TG_count', value: 600 }
    ];
    const collectionSheet = XLSX.utils.json_to_sheet(collectionData);
    XLSX.utils.book_append_sheet(workbook, collectionSheet, 'Collection');

    // Traits sheet
    const traitsData = [
      { trait_type: 'Species', values: 'Lion, Tiger, Bear, Wolf' },
      { trait_type: 'Rarity', values: 'Common, Uncommon, Rare, Legendary' },
      { trait_type: 'Color', values: 'Red, Blue, Green, Gold' },
      { trait_type: 'Special Ability', values: 'Fire, Ice, Lightning, Earth' }
    ];
    const traitsSheet = XLSX.utils.json_to_sheet(traitsData);
    XLSX.utils.book_append_sheet(workbook, traitsSheet, 'Traits');

    // NFTs sheet
    const nftsData = [
      {
        id: 1,
        name: 'Example NFT #1',
        description: 'A rare fire lion',
        image: 'ipfs://QmExample1',
        Species: 'Lion',
        Rarity: 'Rare',
        Color: 'Red',
        'Special Ability': 'Fire'
      },
      {
        id: 2,
        name: 'Example NFT #2',
        description: 'A legendary ice tiger',
        image: 'ipfs://QmExample2',
        Species: 'Tiger',
        Rarity: 'Legendary',
        Color: 'Blue',
        'Special Ability': 'Ice'
      }
    ];
    const nftsSheet = XLSX.utils.json_to_sheet(nftsData);
    XLSX.utils.book_append_sheet(workbook, nftsSheet, 'NFTs');

    // Download the file
    XLSX.writeFile(workbook, 'random_mint_template.xlsx');
  };

  // Add preview handling
  const handlePreview = async (file) => {
    try {
      const data = await handleExcelUpload(file);
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    }
  };

  // Modify the metadata upload function to include preview
  const handleMetadataUpload = async (file) => {
    try {
      const json = await convertExcelToMetadataJson(file);
      updateFormData({ 
        metadataFile: file,
        traits: json.metadata.traits,
        prefixes: Object.entries(json.metadata.prefix_counts).map(([prefix, count]) => ({
          prefix,
          count,
          useLeadingZeros: true,
          numberDigits: 3
        }))
      });
      
      // Generate preview
      await handlePreview(file);
      
      toast.success('Metadata file uploaded successfully');
    } catch (error) {
      console.error('Error uploading metadata:', error);
      toast.error('Failed to upload metadata file');
    }
  };

  // Handle artwork upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image or video file');
        return;
      }

      const maxSize = isVideo ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
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

  const handleJsonUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Check if it's the nested metadata format
      if (jsonData.nfts && jsonData.nfts[0]?.metadata) {
        // Detect metadata format
        let metadataFormat = {
          format: 2, // NESTED_NAME since we're in the nested format case
          idField: '',
          isNested: true,
          totalMetadata: jsonData.nfts.length
        };

        // Transform nested metadata format to standard format
        const transformedNFTs = jsonData.nfts.map(nft => ({
          id: nft.metadata.name,
          name: nft.metadata.name,
          description: nft.metadata.description,
          image: nft.metadata.image,
          animation_url: nft.metadata.animation_url || "",
          attributes: nft.metadata.attributes
        }));

        // Rest of your existing nested format handling...
        // Extract traits from NFT attributes
        const traits = {};
        transformedNFTs.forEach(nft => {
          if (nft.attributes) {
            nft.attributes.forEach(attr => {
              if (!traits[attr.trait_type]) {
                traits[attr.trait_type] = new Set();
              }
              traits[attr.trait_type].add(attr.value);
            });
          }
        });

        // Convert Set to Array for each trait
        const processedTraits = {};
        Object.entries(traits).forEach(([key, values]) => {
          processedTraits[key] = Array.from(values);
        });

        // Extract prefix counts
        const prefixCounts = {};
        transformedNFTs.forEach(nft => {
          const prefix = nft.id.split('-')[0];
          prefixCounts[prefix] = (prefixCounts[prefix] || 0) + 1;
        });

        const previewData = {
          nfts: transformedNFTs,
          metadata: {
            name: "My Collection",
            description: "A unique NFT collection",
            prefix_counts: prefixCounts,
            traits: processedTraits
          }
        };

        setPreviewData(previewData);
        setShowPreview(true);
        
        // Update form data with metadata format
        const prefixes = Object.entries(prefixCounts).map(([prefix, count]) => ({
          prefix: prefix,
          count: count.toString(),
          useLeadingZeros: true,
          numberDigits: 3
        }));

        updateFormData({
          name: previewData.metadata.name,
          description: previewData.metadata.description,
          prefixes,
          traits: processedTraits,
          metadataFormat // Add metadata format to form data
        });

        toast.success(
          <div>
            <p>JSON file imported successfully!</p>
            <p className="text-sm">✓ Form fields updated</p>
            <p className="text-sm">✓ {Object.keys(processedTraits).length} trait types extracted</p>
            <p className="text-sm">✓ Metadata format detected</p>
            <p className="text-sm">✓ Preview available</p>
          </div>,
          { duration: 4000 }
        );
      } else {
        // Original format handling
        if (!jsonData.metadata || !jsonData.nfts || !jsonData.metadata.prefix_counts) {
          throw new Error('Invalid JSON format');
        }

        // Detect metadata format for non-nested case
        let metadataFormat = {
          format: 0, // Default to ID_FIELD
          idField: '',
          isNested: false,
          totalMetadata: jsonData.nfts.length
        };

        const sampleNft = jsonData.nfts[0];
        if (sampleNft.id) {
          metadataFormat.format = 0; // ID_FIELD
        } else if (sampleNft.name && sampleNft.name.includes('-')) {
          metadataFormat.format = 1; // NAME_FIELD
        } else if (sampleNft.tag) {
          metadataFormat.format = 3; // TAG_FIELD
          metadataFormat.idField = 'tag';
        }

        // Extract traits from NFT attributes
        const traits = {};
        jsonData.nfts.forEach(nft => {
          // Handle attributes array format
          if (nft.attributes) {
            nft.attributes.forEach(attr => {
              if (!traits[attr.trait_type]) {
                traits[attr.trait_type] = new Set();
              }
              traits[attr.trait_type].add(attr.value);
            });
          } else {
            // Handle direct properties format
            const excludedProps = ['id', 'name', 'description', 'image', 'animation_url'];
            Object.entries(nft).forEach(([key, value]) => {
              if (!excludedProps.includes(key.toLowerCase()) && value !== undefined && value !== '') {
                if (!traits[key]) {
                  traits[key] = new Set();
                }
                traits[key].add(value);
              }
            });
          }
        });

        // Convert Set to Array for each trait
        const processedTraits = {};
        Object.entries(traits).forEach(([key, values]) => {
          processedTraits[key] = Array.from(values);
        });

        // Auto-fill form fields
        const prefixes = Object.entries(jsonData.metadata.prefix_counts).map(([prefix, count]) => ({
          prefix: `${prefix}-`,
          count: count.toString(),
          useLeadingZeros: true,
          numberDigits: 3
        }));

        updateFormData({
          name: jsonData.metadata.name || formData.name,
          description: jsonData.metadata.description || formData.description,
          prefixes,
          traits: processedTraits,
          metadataFormat // Add metadata format to form data
        });

        // Store JSON for preview
        setPreviewData({
          ...jsonData,
          metadata: {
            ...jsonData.metadata,
            traits: processedTraits
          }
        });
        setShowPreview(true);

        toast.success(
          <div>
            <p>JSON file imported successfully!</p>
            <p className="text-sm">✓ Form fields updated</p>
            <p className="text-sm">✓ {Object.keys(processedTraits).length} trait types extracted</p>
            <p className="text-sm">✓ Metadata format detected</p>
            <p className="text-sm">✓ Preview available</p>
          </div>,
          { duration: 4000 }
        );
      }
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast.error('Failed to import JSON file. Please check the format.');
    }
  };

  const handleDownloadJson = () => {
    try {
      if (!previewData) {
        toast.error('No data to download');
        return;
      }

      // Check which format was imported
      const isNestedFormat = previewData.nfts[0]?.metadata;
      let downloadData;

      if (isNestedFormat) {
        // Convert to nested metadata format
        downloadData = {
          nfts: previewData.nfts.map(nft => ({
            tag: nft.id.split('-')[1],
            metadata: {
              name: nft.name,
              description: nft.description,
              image: nft.image,
              animation_url: nft.animation_url,
              attributes: nft.attributes
            }
          }))
        };
      } else {
        // Use original flat format
        downloadData = {
          nfts: previewData.nfts,
          metadata: previewData.metadata
        };
      }

      const jsonString = JSON.stringify(downloadData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'collection.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('JSON file downloaded successfully');
    } catch (error) {
      console.error('Error downloading JSON:', error);
      toast.error('Error downloading JSON file');
    }
  };

  const handleDownloadExcel = () => {
    try {
      if (!previewData) {
        toast.error('No data to download');
        return;
      }

      // Create a properly structured array for Excel
      const excelData = previewData.nfts.map(nft => {
        const isNestedFormat = nft.metadata;
        let baseNft;

        if (isNestedFormat) {
          // Handle nested format
          const metadata = nft.metadata;
          baseNft = {
            id: metadata.name,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            animation_url: metadata.animation_url || '',
          };

          // Add attributes as direct columns
          metadata.attributes.forEach(attr => {
            baseNft[attr.trait_type] = attr.value;
          });
        } else {
          // Handle flat format - copy all properties directly
          baseNft = {
            id: nft.id,
            name: nft.name,
            description: nft.description,
            image: nft.image,
            animation_url: nft.animation_url || ''
          };

          // Add all other properties as columns
          Object.entries(nft).forEach(([key, value]) => {
            if (!['id', 'name', 'description', 'image', 'animation_url', 'attributes'].includes(key)) {
              baseNft[key] = value;
            }
          });

          // If there are attributes, add them as columns too
          if (Array.isArray(nft.attributes)) {
            nft.attributes.forEach(attr => {
              baseNft[attr.trait_type] = attr.value;
            });
          }
        }

        return baseNft;
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Convert the data to worksheet
           const ws = XLSX.utils.json_to_sheet(excelData, {
        header: [
          'id',
          'name',
          'description',
          'image',
          'animation_url',
          ...new Set(excelData.flatMap(nft => Object.keys(nft).filter(key => 
            !['id', 'name', 'description', 'image', 'animation_url'].includes(key)
          )))
        ]
      });

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Collection');

      // Save workbook
      XLSX.writeFile(wb, 'collection.xlsx');
      
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      toast.error('Error downloading Excel file');
    }
  };

  // Handle contract interaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Add validation for metadataUri
      if (!formData.metadataUri) {
        toast.error('Please enter the metadata IPFS URI');
        return;
      }
      if (!validateIpfsUri(formData.metadataUri)) {
        toast.error('Invalid IPFS URI format');
        return;
      }
      if (!uriStatus.valid) {
        toast.error('Please ensure the metadata URI is valid and accessible');
        return;
      }

      if (!account) {
        openConnectModal();
        return;
      }

      // Step 1: Initial setup
      toast.loading('1/3 - Preparing deployment...', { id: 'create' });
      console.log('Starting collection creation...');

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Provider initialized');
      
      const signer = await provider.getSigner();
      console.log('Signer obtained:', await signer.getAddress());
      
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkChainId = parseInt(currentChainId, 16);
      console.log('Current chain ID:', networkChainId);
      
      // Get factory address from environment
      const factoryAddress = import.meta.env.VITE_RANDOM_NFT_FACTORY_ADDRESS;
      console.log('Factory address:', factoryAddress);
      
      if (!factoryAddress) {
        toast.error('Factory address not found in environment variables');
        return;
      }

      // Step 2: Contract setup
      toast.loading('2/3 - Setting up contract...', { id: 'create' });

      // Create factory instance and get network fee
      const factory = new ethers.Contract(factoryAddress, RandomNFTFactoryABI, signer);
      console.log('Factory contract instance created');
      
      // Get the network fee for the current chain
      const networkFee = await factory.chainFees(networkChainId);
      console.log('Network fee:', ethers.formatEther(networkFee), 'ETH');
      
      if (networkFee === BigInt(0)) {
        throw new Error('Chain not supported');
      }

      // Add these debug logs
      console.log('Network fee (raw):', networkFee.toString());
      console.log('Chain ID:', networkChainId);
      console.log('Sender balance:', ethers.formatEther(await provider.getBalance(account)), 'ETH');

      // Convert royalty fee from percentage to basis points (e.g., 2.5% -> 250)
      const royaltyBasisPoints = Math.floor(parseFloat(formData.royaltyFee || '0') * 100);
      
      // Create collection parameters
      const now = Math.floor(Date.now() / 1000);
      
      // Get the IPFS URI from the form's metadataUri field
      const baseURI = formData.metadataUri;
      if (!baseURI) {
        throw new Error('No metadata URL found. Please upload your metadata first.');
      }
      
      // Make sure the URI ends with a trailing slash
      const formattedBaseURI = baseURI.endsWith('/') ? baseURI : baseURI + '/';
      
      console.log('Using base URI:', formattedBaseURI);
      
      // Validate the IPFS URI format
      if (!validateIpfsUri(formattedBaseURI)) {
        throw new Error('Invalid IPFS URI format. Must start with ipfs:// and contain a valid CID.');
      }
      
      // Call the contract with parameters matching the initialize function
      const tx = await factory.createRandomCollection(
        {
          name: formData.name,
          symbol: formData.symbol,
          baseURI: formattedBaseURI,
          collectionType: "ERC721",
          maxSupply: BigInt(formData.maxSupply),
          mintPrice: ethers.parseEther(formData.mintPrice?.toString() || '0.005'),
          maxPerWallet: BigInt(formData.maxPerWallet || 1),
          releaseDate: BigInt(now),
          mintEndDate: BigInt(now + 7 * 24 * 60 * 60),
          infiniteMint: false,
          paymentToken: '0x0000000000000000000000000000000000000000',
          enableWhitelist: false,
          royaltyFee: BigInt(royaltyBasisPoints),
          royaltyRecipient: formData.royaltyRecipient || account,
          advancedConfig: {
            reservedMinter: account,
            reservedAmount: BigInt(0),
            isFreeMint: false,
            canClaimUnminted: false,
            whitelistEndTime: BigInt(0)
          },
          metadataConfig: {
            format: 0, // MetadataFormat.ID_FIELD
            idField: formData.metadataConfig?.idField || '',
            isNested: formData.metadataConfig?.isNested || false,
            totalMetadata: BigInt(formData.maxSupply)
          }
        },
        {
          value: networkFee
        }
      );
      
      // Add transaction debug log
      console.log('Transaction parameters:', {
        value: ethers.formatEther(networkFee),
        gasLimit: 5000000,
        from: account,
        to: factoryAddress
      });

      console.log('Transaction sent:', tx.hash);
      toast.loading('Waiting for confirmation...', { id: 'create' });
      const receipt = await tx.wait();

      console.log('Transaction receipt:', receipt);
      console.log('All logs:', receipt.logs);
      
      // Get collection address from events
      let collectionAddress;
      const creationEvent = receipt.logs.find((log) => {
        return log.topics?.[0] === '0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2';
      });

      if (creationEvent) {
        console.log('Found creation event with data:', creationEvent.data);
        try {
          // Try to decode the full event data which should contain all parameters
          const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
            ['address', 'address', 'string', 'string', 'string', 'uint256'],
            creationEvent.data
          );
          
          // The collection address should be the second parameter
          collectionAddress = decodedData[1];
          console.log('Full decoded data:', decodedData);
          console.log('Extracted collection address:', collectionAddress);
          
          // Verify it's a valid address
          if (!ethers.isAddress(collectionAddress)) {
            throw new Error('Decoded address is not valid');
          }
        } catch (decodeError) {
          console.error('Error decoding event data:', decodeError);
          // Try to get address from the event address field
          if (creationEvent.address && ethers.isAddress(creationEvent.address)) {
            collectionAddress = creationEvent.address;
            console.log('Using event address as collection address:', collectionAddress);
          }
        }
      }

      if (!collectionAddress) {
        console.error('Failed to extract collection address from event:', creationEvent);
        throw new Error('Failed to get collection address from transaction');
      }

      // Step 3: Set whitelist if enabled
      if (formData.enableWhitelist && formData.whitelistAddresses.length > 0) {
        toast.loading('3/3 - Setting whitelist...', { id: 'create' });
        const nftContract = new ethers.Contract(
          collectionAddress,
          NFTCollectionABI.ERC721,
          signer
        );
        
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
        network: networkChainId === 137 ? 'polygon' : 'sepolia',
        previewUrl: formData.previewUrl || '', // Use empty string if no preview URL
        imageIpfsUrl: formData.baseURI || '', // Use baseURI if no specific IPFS URL
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
        whitelistAddresses: formData.whitelistAddresses || [],
        createdAt: Date.now(),
        totalMinted: 0,
        creatorAddress: account.toLowerCase(),
        isRandomMint: true
      };

      console.log('Saving collection data:', collectionData);
      await saveCollection(collectionData);

      toast.success('Collection created successfully!', { id: 'create' });
      onClose();
      navigate(`/collection/${formData.symbol}`);

    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection. Please check the console for details.', { id: 'create' });
    }
  };

  // Helper function for payment token
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

  // Add getCreationFee function
  const getCreationFee = () => {
    return CREATION_FEES[currentChainId] || "0.015 ETH";
  };

  // Render functions for each step
  const renderStep = () => {
    switch (currentStep) {
      case 'type':
        return renderTypeStep();
      case 'basics':
        return renderBasicsStep();
      case 'media':
        return renderMediaStep();
      case 'artwork':
        return renderArtworkStep();
      case 'advanced':
        return renderAdvancedStep();
      case 'minting':
        return renderMintingStep();
      default:
        return null;
    }
  };

  // Add the render functions for each step
  const renderTypeStep = () => (
    <div className="relative">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Create Random NFT Collection
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Creation fee: {getCreationFee()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(COLLECTION_TYPES).map(([type, info]) => (
          <button
            key={type}
            onClick={() => {
              updateFormData({ 
                type,
                isRandomMint: true,
                prefixes: [{ prefix: '', count: '', baseUri: '' }]
              });
              setCurrentStep('basics');
            }}
            className={clsx(
              'p-4 rounded-lg border-2 text-left',
              'hover:border-[#00ffbd] transition-colors',
              formData.type === type 
                ? 'border-[#00ffbd]' 
                : 'border-gray-200 dark:border-gray-800'
            )}
          >
            <div className="flex items-center gap-3">
              <info.icon size={24} className="text-[#00ffbd]" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{info.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Collection Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
          placeholder="My Random NFT Collection"
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
          placeholder="RNFT"
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
          placeholder="Describe your random mint collection..."
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
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Collection Media
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Upload the main artwork that will represent your collection
      </p>

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
                  Supported: Images (2MB) or Videos (5MB)
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*"
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
    </div>
  );

  const renderArtworkStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
          Random Mint Configuration
        </h2>
        <p className="text-sm text-black dark:text-gray-400 mb-6">
          Configure your random mint collection metadata and prefixes
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-black dark:text-gray-200 mb-4">
            Metadata Configuration
          </h3>
          <div className="bg-gray-50 dark:bg-[#1a1b1f] rounded-lg p-6">
            <div className="space-y-6">
              {/* Header with Setup Guide */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-black dark:text-gray-400">
                  You have two options to configure your collection metadata:
                </p>
                <button
                  onClick={() => setShowGuidelinesModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-[#151619] text-[#00ffbd] rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2b2f] transition-colors gap-2 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Setup Guide
                </button>
              </div>

              {/* Import Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Option 1: Import Excel */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-black dark:text-gray-300 font-medium">Option 1: Import Excel Template</h4>
                    <button
                      onClick={handleDownloadTemplate}
                      className="text-[#00ffbd] hover:text-[#00e6a9] text-sm underline"
                    >
                      Download Template
                    </button>
                  </div>
                  <label
                    htmlFor="excel-upload"
                    className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-gray-100 dark:bg-[#151619] text-black dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2b2f] transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import Excel
                  </label>
                  <input
                    type="file"
                    id="excel-upload"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const data = new Uint8Array(event.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                            const rawData = XLSX.utils.sheet_to_json(firstSheet);

                            if (!rawData || rawData.length === 0) {
                              throw new Error('No data found in Excel file');
                            }

                            // Convert data to NFTs with attributes
                            const nfts = rawData.map(row => {
                              const baseFields = ['id', 'name', 'description', 'image', 'animation_url'];
                              const nft = {
                                id: row.id || row.ID || row.name || row.Name || '',
                                name: row.name || row.Name || row.id || row.ID || '',
                                description: row.description || row.Description || '',
                                image: row.image || row.Image || '',
                                animation_url: row.animation_url || row['animation_url'] || row.animationUrl || row.AnimationUrl || '',
                              };

                              // Convert all non-base fields to attributes
                              const attributes = [];
                              Object.entries(row).forEach(([key, value]) => {
                                if (!baseFields.includes(key.toLowerCase()) && value !== undefined && value !== '') {
                                  attributes.push({
                                    trait_type: key,
                                    value: value.toString()
                                  });
                                }
                              });

                              if (attributes.length > 0) {
                                nft.attributes = attributes;
                              }

                              return nft;
                            });

                            // Extract prefix counts
                            const prefix_counts = {};
                            nfts.forEach(nft => {
                              const prefix = nft.id.split('-')[0];
                              if (prefix) {
                                prefix_counts[prefix] = (prefix_counts[prefix] || 0) + 1;
                              }
                            });

                            // Extract traits from attributes
                            const traits = {};
                            nfts.forEach(nft => {
                              if (nft.attributes) {
                                nft.attributes.forEach(attr => {
                                  if (!traits[attr.trait_type]) {
                                    traits[attr.trait_type] = new Set();
                                  }
                                  traits[attr.trait_type].add(attr.value);
                                });
                              }
                            });

                            // Convert Set to Array for each trait
                            Object.keys(traits).forEach(key => {
                              traits[key] = Array.from(traits[key]);
                            });

                            const previewData = {
                              nfts,
                              metadata: {
                                name: "My Collection",
                                description: "A unique NFT collection",
                                prefix_counts,
                                traits
                              }
                            };

                            setPreviewData(previewData);
                            setShowPreview(true);

                            // Update form data
                            updateFormData({
                              name: previewData.metadata.name,
                              description: previewData.metadata.description,
                              prefixes: Object.entries(prefix_counts).map(([prefix, count]) => ({
                                prefix,
                                count: count.toString(),
                                useLeadingZeros: true,
                                numberDigits: 3
                              }))
                            });

                            toast.success('Excel file imported successfully');
                          } catch (error) {
                            console.error('Error importing Excel:', error);
                            toast.error('Failed to import Excel file: ' + error.message);
                          }
                        };
                        reader.onerror = () => {
                          toast.error('Error reading Excel file');
                        };
                        reader.readAsArrayBuffer(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {/* Option 2: Import JSON */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-black dark:text-gray-300 font-medium">Option 2: Import JSON</h4>
                    <button
                      onClick={() => setShowMetadataExample(true)}
                      className="text-[#00ffbd] hover:text-[#00e6a9] text-sm underline"
                    >
                      View Format
                    </button>
                  </div>
                  <button
                    onClick={() => document.getElementById('json-upload').click()}
                    className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-gray-100 dark:bg-[#151619] text-black dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2b2f] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import JSON
                  </button>
                  <input
                    type="file"
                    id="json-upload"
                    accept=".json"
                    onChange={handleJsonUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="space-y-3 text-black dark:text-gray-400">
          <h3 className="text-black dark:text-gray-300 font-medium">Important Notes:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Your metadata JSON file must follow the exact format shown in the example</li>
            <li>After importing, review the preview to ensure all data is correct</li>
            <li className="text-[#00ffbd] font-medium flex items-start gap-2">
              <span className="text-yellow-500">⚠️</span>
              <span>Required: Download and upload your JSON file to IPFS before deployment</span>
            </li>
            <li>Need IPFS hosting? Use one of these services:</li>
            <div className="mt-2 space-y-1">
              <a 
                href="https://app.pinata.cloud/register" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
              >
                → Pinata Cloud (Recommended)
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a 
                href="https://nft.storage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
              >
                 NFT.Storage
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a 
                href="https://web3.storage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
              >
                → Web3.Storage
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <li>Make sure all image/video URLs in your metadata are valid IPFS URLs</li>
            <li>The total supply must match the sum of all prefix counts</li>
          </ul>
        </div>

        {previewData && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-300 font-medium">
                Imported Collection Data
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-3 py-1.5 text-sm bg-[#2a2b2f] text-gray-300 rounded-lg hover:bg-[#3a3b3f] transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleDownloadJson}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Download JSON
                  </button>
                  <button
                    onClick={handleDownloadExcel}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Download Excel
                  </button>
                </div>
              </div>
            </div>
            <div className="text-gray-400">
              <p>✓ {previewData.nfts.length} NFTs loaded</p>
              <p>✓ {Object.keys(previewData.metadata.prefix_counts).length} prefix groups configured</p>
              <p>✓ {Object.keys(previewData.metadata.traits).length} trait types defined</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvancedStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-2">
        Advanced Minting Options
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Configure advanced minting features for your collection
      </p>

      {/* Royalty Settings */}
      <div className="mb-8 border border-[#1a1b1f] rounded-lg p-4 bg-[#0a0b0f]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Royalty Settings</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Royalty Fee (%)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.royaltyFee || 2.5}
              onChange={(e) => updateFormData({ royaltyFee: parseFloat(e.target.value) })}
              className="w-full bg-[#1a1b1f] text-white rounded-lg p-3 border border-[#2a2b2f] focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              placeholder="Enter royalty percentage (0-10%)"
            />
            <p className="mt-1 text-sm text-gray-400">
              Royalties you'll receive from secondary sales (max 10%)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Royalty Recipient
            </label>
            <input
              type="text"
              value={formData.royaltyRecipient || account}
              onChange={(e) => updateFormData({ royaltyRecipient: e.target.value })}
              className="w-full bg-[#1a1b1f] text-white rounded-lg p-3 border border-[#2a2b2f] focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              placeholder="Enter royalty recipient address"
            />
            <p className="mt-1 text-sm text-gray-400">
              Address that will receive the royalties (defaults to your address)
            </p>
          </div>
        </div>
      </div>

      {/* Reserved Minting */}
      <div className="mb-8 border border-[#1a1b1f] rounded-lg p-4 bg-[#0a0b0f]">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableReserved || false}
              onChange={(e) => {
                updateFormData({ 
                  enableReserved: e.target.checked,
                  enableFreeMint: e.target.checked // Automatically enable free minting when reserved is enabled
                });
              }}
              className="w-4 h-4 text-[#00ffbd] bg-gray-100 border-gray-300 rounded focus:ring-[#00ffbd] dark:focus:ring-[#00ffbd] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Enable Reserved Team Minting</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Reserve a portion of your collection for team allocation, marketing, partnerships, and giveaways. 
          These tokens will be set aside from the total supply and can be minted for free by the designated address.
        </p>
        {formData.enableReserved && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Minter Address
              </label>
              <input
                type="text"
                value={formData.reservedMinterAddress || ''}
                onChange={(e) => updateFormData({ reservedMinterAddress: e.target.value })}
                placeholder="0x..."
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Address that will be able to mint the reserved tokens for free (team, marketing, partnerships)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reserved Amount
              </label>
              <input
                type="number"
                value={formData.reservedAmount || ''}
                onChange={(e) => updateFormData({ reservedAmount: e.target.value })}
                placeholder="Number of tokens to reserve"
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Number of tokens to reserve for free team minting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Free Minting */}
      <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableFreeMint || false}
              onChange={(e) => updateFormData({ enableFreeMint: e.target.checked })}
              className="w-4 h-4 text-[#00ffbd] bg-gray-100 border-gray-300 rounded focus:ring-[#00ffbd] dark:focus:ring-[#00ffbd] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Enable Free Reserved Minting</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Allow the reserved minter address to mint their allocation without paying the mint price. 
          This only applies to the reserved allocation set above.
        </p>
      </div>

      {/* Post-Whitelist Claims */}
      <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enablePostWhitelist || false}
              onChange={(e) => updateFormData({ enablePostWhitelist: e.target.checked })}
              className="w-4 h-4 text-[#00ffbd] bg-gray-100 border-gray-300 rounded focus:ring-[#00ffbd] dark:focus:ring-[#00ffbd] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Enable Post-Whitelist Claims</span>
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Allow designated addresses to claim any unminted tokens after the whitelist period ends. 
          This feature must be explicitly enabled and can only be used after the whitelist phase is complete.
        </p>
        {formData.enablePostWhitelist && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Claim-Enabled Address
              </label>
              <input
                type="text"
                value={formData.claimEnabledAddress || ''}
                onChange={(e) => updateFormData({ claimEnabledAddress: e.target.value })}
                placeholder="0x..."
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Whitelist End Time
              </label>
              <input
                type="datetime-local"
                value={formData.whitelistEndTime || ''}
                onChange={(e) => updateFormData({ whitelistEndTime: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMintingStep = () => (
    <div className="space-y-6">
      {/* Minting Currency */}
      <div>
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
              className={`w-full bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00ffbd] ${
                formData.enableWhitelist ? 'cursor-not-allowed bg-gray-100 dark:bg-[#1a1b1f] opacity-75' : ''
              }`}
              disabled={formData.enableWhitelist}
            />
            {formData.enableWhitelist && (
              <div className="absolute right-3 top-2.5 text-xs text-[#00ffbd] flex items-center">
                <span className="mr-1">👑</span> 
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

      {/* Add IPFS URI field before the payment settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Metadata IPFS URI
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              value={formData.metadataUri}
              onChange={handleUriChange}
              onBlur={() => {
                const formatted = formatIpfsUri(formData.metadataUri);
                updateFormData({ metadataUri: formatted });
                if (formatted) {
                  checkUri(formatted);
                }
              }}
              placeholder="ipfs://..."
              className={clsx(
                "block w-full px-4 py-3 bg-white dark:bg-[#1a1b1f] text-gray-900 dark:text-gray-100 border rounded-lg focus:ring-2 focus:ring-[#00ffbd] focus:border-[#00ffbd] sm:text-sm transition-colors",
                uriStatus.valid 
                  ? "border-green-500 dark:border-green-500" 
                  : "border-gray-300 dark:border-gray-700"
              )}
            />
            {isCheckingUri && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="animate-spin h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            {!isCheckingUri && uriStatus.valid && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
          </div>
          <div className="mt-1 flex justify-between items-center">
            <p className={clsx(
              "text-sm",
              uriStatus.valid ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
            )}>
              {uriStatus.message || "Enter the IPFS URI where your metadata JSON is stored"}
            </p>
            {uriStatus.valid && (
              <button
                type="button"
                onClick={() => setShowUriPreview(true)}
                className="text-sm text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
              >
                Preview Metadata
              </button>
            )}
          </div>
        </div>
        
        {showUriPreview && previewMetadata && (
          <MetadataPreview metadata={previewMetadata} />
        )}
      </div>
    </div>
  );

  // Add navigation handler
  const handleStepChange = (direction) => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (direction === 'next' && currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    } else if (direction === 'back' && currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  // Whitelist management functions
  const validateAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleWhitelistToggle = (checked) => {
    if (checked) {
      updateFormData({ 
        enableWhitelist: checked,
        maxPerWallet: '1000000'
      });
      toast('When whitelist is enabled, max per wallet is set high to allow individual whitelist limits to control minting. You can set specific mint limits for each address when adding them to the whitelist.', {
        duration: Infinity,
        id: 'whitelist-info'
      });
    } else {
      updateFormData({ 
        enableWhitelist: checked,
        maxPerWallet: ''
      });
      toast.dismiss('whitelist-info');
    }
  };

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

  const handleRemoveAddress = (index) => {
    const newAddresses = formData.whitelistAddresses.filter((_, i) => i !== index);
    updateFormData({ whitelistAddresses: newAddresses });
  };

  const handleUriChange = async (e) => {
    const uri = e.target.value;
    updateFormData({ metadataUri: uri });
    
    // Don't validate empty URIs
    if (!uri) {
      setUriStatus({ valid: false, message: '' });
      return;
    }
    
    // Format and validate the URI
    const formattedUri = formatIpfsUri(uri);
    const isValid = validateIpfsUri(formattedUri);
    
    if (!isValid) {
      setUriStatus({ 
        valid: false, 
        message: 'Invalid IPFS URI format. Must start with ipfs:// and contain a valid CID.' 
      });
      return;
    }
    
    // If valid, try to fetch metadata
    setIsCheckingUri(true);
    try {
      const response = await fetch(formattedUri.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      if (!response.ok) throw new Error('Failed to fetch metadata');
      
      const metadata = await response.json();
      setUriStatus({ 
        valid: true, 
        message: 'Valid IPFS URI - metadata found' 
      });
      
      // Update preview data if available
      if (metadata) {
        setPreviewData(metadata);
      }
    } catch (error) {
      setUriStatus({ 
        valid: false, 
        message: 'Could not fetch metadata from IPFS. Please verify the URI.' 
      });
    } finally {
      setIsCheckingUri(false);
    }
  };

  const checkUri = async (uri) => {
    setIsCheckingUri(true);
    try {
      const httpUrl = ipfsToHttp(uri);
      console.log('Fetching metadata from:', httpUrl);
      const response = await axios.get(httpUrl);
      
      if (response.data && response.data.nfts && Array.isArray(response.data.nfts)) {
        console.log('Metadata response:', response.data);
        
        setUriStatus({ 
          valid: true, 
          message: 'Valid metadata JSON found' 
        });
        setPreviewMetadata(response.data);
        setShowUriPreview(true);
      } else {
        setUriStatus({ 
          valid: false, 
          message: 'Invalid metadata format - missing nfts array' 
        });
      }
    } catch (error) {
      console.error('Metadata fetch error:', error);
      setUriStatus({ 
        valid: false, 
        message: 'Failed to fetch metadata' 
      });
    } finally {
      setIsCheckingUri(false);
    }
  };

  // Add this component for metadata preview
  const MetadataPreview = ({ metadata }) => {
    if (!metadata?.nfts?.length) return null;
    
    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedNFT = metadata.nfts[selectedIndex];
    
    // Convert IPFS image URL to HTTP URL for preview
    const imageUrl = selectedNFT.image ? ipfsToHttp(selectedNFT.image) : null;
    console.log('Preview image URL:', imageUrl);
    
    return (
      <div className="mt-4 p-6 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">Metadata Preview</h4>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="text-sm bg-gray-100 dark:bg-[#151619] border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-900 dark:text-gray-100"
            >
              {metadata.nfts.map((nft, idx) => (
                <option key={idx} value={idx}>{nft.name || `NFT #${idx + 1}`}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowUriPreview(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <BiX size={20} />
          </button>
        </div>
        <div className="space-y-4">
          {imageUrl && (
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-[#151619]">
              <img 
                src={imageUrl} 
                alt={selectedNFT.name || 'NFT Preview'} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log('Image load error');
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found';
                }}
              />
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400">ID</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedNFT.id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Name</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedNFT.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400">Description</label>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedNFT.description || 'N/A'}</p>
            </div>
            {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-2">Attributes</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedNFT.attributes.map((attr, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-[#151619] p-2 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{attr.trait_type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {metadata.metadata && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Collection Info</h5>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Name:</span> {metadata.metadata.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Description:</span> {metadata.metadata.description}
                </p>
                {metadata.metadata.prefix_counts && (
                  <div className="flex gap-2">
                    {Object.entries(metadata.metadata.prefix_counts).map(([prefix, count]) => (
                      <span key={prefix} className="text-xs bg-gray-100 dark:bg-[#151619] text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        {prefix}: {count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add this function for handling file uploads
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
        else if (type === 'csv') {
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
        else if (type === 'excel') {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          addresses = XLSX.utils.sheet_to_json(sheet)
            .map(row => {
              const addr = row.address || row.wallet || Object.values(row)[0];
              const limit = parseInt(row.limit || row.maxMint || 1);
              return addr ? { address: addr, maxMint: limit } : null;
            })
            .filter(Boolean);
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
    };

    input.click();
  };

  const handleDeployment = async () => {
    try {
      // Step 1: Initial setup
      toast.loading('1/3 - Preparing deployment...', { id: 'create' });
      console.log('Starting collection creation...');

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Provider initialized');
      
      const signer = await provider.getSigner();
      console.log('Signer obtained:', await signer.getAddress());
      
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkChainId = parseInt(currentChainId, 16);
      console.log('Current chain ID:', networkChainId);
      
      // Get factory address from environment
      const factoryAddress = import.meta.env.VITE_RANDOM_NFT_FACTORY_ADDRESS;
      console.log('Factory address:', factoryAddress);
      
      if (!factoryAddress) {
        toast.error('Factory address not found in environment variables');
        return;
      }

      // Step 2: Contract setup
      toast.loading('2/3 - Setting up contract...', { id: 'create' });

      // Create factory instance and get network fee
      const factory = new ethers.Contract(factoryAddress, RandomNFTFactoryABI, signer);
      console.log('Factory contract instance created');
      
      // Get the network fee for the current chain
      const networkFee = await factory.chainFees(networkChainId);
      console.log('Network fee:', ethers.formatEther(networkFee), 'ETH');
      
      if (networkFee === BigInt(0)) {
        throw new Error('Chain not supported');
      }

      // Add these debug logs
      console.log('Network fee (raw):', networkFee.toString());
      console.log('Chain ID:', networkChainId);
      console.log('Sender balance:', ethers.formatEther(await provider.getBalance(account)), 'ETH');

      // Convert royalty fee from percentage to basis points (e.g., 2.5% -> 250)
      const royaltyBasisPoints = Math.floor(parseFloat(formData.royaltyFee || '0') * 100);
      
      // Create collection parameters
      const now = Math.floor(Date.now() / 1000);
      
      // Get the IPFS URI from the form's metadataUri field
      const baseURI = formData.metadataUri;
      if (!baseURI) {
        throw new Error('No metadata URL found. Please upload your metadata first.');
      }
      
      // Make sure the URI ends with a trailing slash
      const formattedBaseURI = baseURI.endsWith('/') ? baseURI : baseURI + '/';
      
      console.log('Using base URI:', formattedBaseURI);
      
      // Validate the IPFS URI format
      if (!validateIpfsUri(formattedBaseURI)) {
        throw new Error('Invalid IPFS URI format. Must start with ipfs:// and contain a valid CID.');
      }
      
     
      
      // Prepare deployment parameters with all required fields
      const deploymentParams = {
        name: formData.name,
        symbol: formData.symbol,
        baseURI: formattedBaseURI,
        collectionType: 'ERC721',
        maxSupply: BigInt(formData.maxSupply),
        mintPrice: ethers.parseEther(formData.mintPrice?.toString() || '0.005'),
        maxPerWallet: BigInt(formData.maxPerWallet || 1),
        releaseDate: BigInt(now),
        mintEndDate: BigInt(now + 7 * 24 * 60 * 60),  // 7 days from now
        infiniteMint: false,
        paymentToken: '0x0000000000000000000000000000000000000000',
        enableWhitelist: false,
        royaltyFee: BigInt(royaltyBasisPoints),
        royaltyRecipient: formData.royaltyRecipient || account,
        advancedConfig: {
          reservedMinter: account,
          reservedAmount: BigInt(0),
          isFreeMint: false,
          canClaimUnminted: false,
          whitelistEndTime: BigInt(0)
        },
        metadataConfig: {
          format: 0,  // MetadataFormat.ID_FIELD
          idField: formData.metadataConfig?.idField || '',
          isNested: formData.metadataConfig?.isNested || false,
          totalMetadata: BigInt(formData.metadataConfig?.totalMetadata || formData.maxSupply)
        }
      };
      
      // Log the complete parameters for debugging
      console.log('Full deployment parameters:', {
        ...deploymentParams,
        maxSupply: deploymentParams.maxSupply.toString(),
        mintPrice: ethers.formatEther(deploymentParams.mintPrice),
        maxPerWallet: deploymentParams.maxPerWallet.toString(),
        royaltyFee: deploymentParams.royaltyFee.toString(),
        advancedConfig: {
          ...deploymentParams.advancedConfig,
          reservedAmount: deploymentParams.advancedConfig.reservedAmount.toString(),
          whitelistEndTime: deploymentParams.advancedConfig.whitelistEndTime.toString()
        },
        metadataConfig: {
          ...deploymentParams.metadataConfig,
          format: deploymentParams.metadataConfig.format.toString(),
          totalMetadata: deploymentParams.metadataConfig.totalMetadata.toString()
        }
      });

      // Step 3: Deploy collection
      toast.loading('3/3 - Deploying collection...', { id: 'create' });
      console.log('Calling createRandomCollection...');

      // Use a fixed high gas limit for complex contract deployment
      const tx = await factory.createRandomCollection(
        {
          name: deploymentParams.name,
          symbol: deploymentParams.symbol,
          baseURI: deploymentParams.baseURI,
          collectionType: deploymentParams.collectionType,
          maxSupply: deploymentParams.maxSupply,
          mintPrice: deploymentParams.mintPrice,
          maxPerWallet: deploymentParams.maxPerWallet,
          releaseDate: deploymentParams.releaseDate,
          mintEndDate: deploymentParams.mintEndDate,
          infiniteMint: deploymentParams.infiniteMint,
          paymentToken: deploymentParams.paymentToken,
          enableWhitelist: deploymentParams.enableWhitelist,
          royaltyFee: deploymentParams.royaltyFee,
          royaltyRecipient: deploymentParams.royaltyRecipient,
          advancedConfig: {
            reservedMinter: deploymentParams.advancedConfig.reservedMinter,
            reservedAmount: deploymentParams.advancedConfig.reservedAmount,
            isFreeMint: deploymentParams.advancedConfig.isFreeMint,
            canClaimUnminted: deploymentParams.advancedConfig.canClaimUnminted,
            whitelistEndTime: deploymentParams.advancedConfig.whitelistEndTime
          },
          metadataConfig: deploymentParams.metadataConfig
        },
        { 
          value: networkFee,
          gasLimit: BigInt(5000000)  // Use a high gas limit for complex deployment
        }
      );
      
      // Add transaction debug log
      console.log('Transaction parameters:', {
        value: ethers.formatEther(networkFee),
        gasLimit: 5000000,
        from: account,
        to: factoryAddress
      });

      console.log('Transaction sent:', tx.hash);
      toast.loading('Waiting for confirmation...', { id: 'create' });
      const receipt = await tx.wait();

      console.log('Transaction receipt:', receipt);
      console.log('All logs:', receipt.logs);
      
      // Get collection address from events
      let collectionAddress;
      const creationEvent = receipt.logs.find((log) => {
        return log.topics?.[0] === '0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2';
      });

      if (creationEvent) {
        console.log('Found creation event with data:', creationEvent.data);
        try {
          // Try to decode the full event data which should contain all parameters
          const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
            ['address', 'address', 'string', 'string', 'string', 'uint256'],
            creationEvent.data
          );
          
          // The collection address should be the second parameter
          collectionAddress = decodedData[1];
          console.log('Full decoded data:', decodedData);
          console.log('Extracted collection address:', collectionAddress);
          
          // Verify it's a valid address
          if (!ethers.isAddress(collectionAddress)) {
            throw new Error('Decoded address is not valid');
          }
        } catch (decodeError) {
          console.error('Error decoding event data:', decodeError);
          // Try to get address from the event address field
          if (creationEvent.address && ethers.isAddress(creationEvent.address)) {
            collectionAddress = creationEvent.address;
            console.log('Using event address as collection address:', collectionAddress);
          }
        }
      }

      if (!collectionAddress) {
        console.error('Failed to extract collection address from event:', creationEvent);
        throw new Error('Failed to get collection address from transaction');
      }

      // Step 3: Set whitelist if enabled
      if (formData.enableWhitelist && formData.whitelistAddresses.length > 0) {
        toast.loading('3/3 - Setting whitelist...', { id: 'create' });
        const nftContract = new ethers.Contract(
          collectionAddress,
          NFTCollectionABI.ERC721,
          signer
        );
        
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
        network: networkChainId === 137 ? 'polygon' : 'sepolia',
        previewUrl: formData.previewUrl || '', // Use empty string if no preview URL
        imageIpfsUrl: formData.baseURI || '', // Use baseURI if no specific IPFS URL
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
        whitelistAddresses: formData.whitelistAddresses || [],
        createdAt: Date.now(),
        totalMinted: 0,
        creatorAddress: account.toLowerCase(),
        isRandomMint: true
      };

      console.log('Saving collection data:', collectionData);
      await saveCollection(collectionData);

      toast.success('Collection created successfully!', { id: 'create' });
      onClose();
      navigate(`/collection/${formData.symbol}`);

    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection. Please check the console for details.', { id: 'create' });
    }
  };

  // Whitelist management functions
  const handleAddressesChange = (addresses) => {
    updateFormData({ whitelistAddresses: addresses });
  };

  // Add the main modal structure
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
                    Create Random NFT Collection
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <BiX size={24} />
                  </button>
                </div>

                {!isConnected ? (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Connect Your Wallet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Please connect your wallet to create a random NFT collection
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
                      <div className="flex justify-between mt-2">
                        {STEPS.map((step) => (
                          <span
                            key={step.id}
                            className={clsx(
                              'text-xs font-medium',
                              currentStep === step.id
                                ? 'text-[#00ffbd]'
                                : 'text-gray-500 dark:text-gray-400'
                            )}
                          >
                            {step.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step Content - Add max height and scrolling */}
                    <div className="max-h-[calc(100vh-300px)] overflow-y-auto mb-6">
                      {renderStep()}
                    </div>

                    {/* Navigation Buttons - Keep outside scroll area */}
                    <div className="flex justify-between items-center gap-3">
                      {currentStep !== 'basics' && (
                        <button 
                          onClick={() => handleStepChange('back')}
                          className="px-6 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
                        >
                          Back
                        </button>
                      )}
                      {currentStep !== 'minting' ? (
                        <button
                          onClick={() => handleStepChange('next')}
                          className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors ml-auto"
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmit}
                          className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors ml-auto"
                        >
                          Create Collection
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Additional Modals */}
      <MetadataExampleModal
        isOpen={showMetadataExample}
        onClose={() => setShowMetadataExample(false)}
      />
      <PreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={previewData}
      />
      <AddressModal 
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        addresses={formData.whitelistAddresses}
        onRemoveAddress={handleRemoveAddress}
        onUpdateAddress={(updates) => updateFormData(updates)}
      />
      <GuidelinesModal 
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
      />
    </>
  );
} 