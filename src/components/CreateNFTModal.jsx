import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { BiX, BiImageAdd, BiChevronLeft, BiUpload, BiDownload, BiChevronDown } from 'react-icons/bi';
import { FaEthereum, FaFileExcel, FaFileCsv, FaFileCode, FaTelegram, FaTwitter, FaDiscord } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import clsx from 'clsx';
import { useWallet } from '../context/WalletContext';
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

const STEPS = [
  { id: 'type', title: 'Collection Type' },
  { id: 'basics', title: 'Basic Info' },
  { id: 'artwork', title: 'Artwork' },
  { id: 'properties', title: 'Properties' },
  { id: 'minting', title: 'Minting' },
];

export default function CreateNFTModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { account, provider, signer, connectWallet } = useWallet();
  const [currentStep, setCurrentStep] = useState('type');
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
    properties: [],
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
  });

  useEffect(() => {
    if (isOpen && !account) {
      connectWallet();
    } else if (isOpen && account) {
      setCurrentStep('type');
    }
  }, [isOpen, account, connectWallet]);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      const url = URL.createObjectURL(file);
      updateFormData({ artwork: file, previewUrl: url });
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
        addresses = result.data.map(row => row.address || row.wallet || Object.values(row)[0]);
      } 
      else if (file.name.endsWith('.xlsx')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        addresses = XLSX.utils.sheet_to_json(sheet).map(row => row.address || row.wallet || Object.values(row)[0]);
      }
      else if (file.name.endsWith('.json')) {
        const text = await file.text();
        const data = JSON.parse(text);
        addresses = Array.isArray(data) ? data : Object.values(data);
      }

      const validAddresses = addresses.filter(validateAddress);
      
      if (validAddresses.length !== addresses.length) {
        toast.warning('Some addresses were invalid and were removed');
      }

      updateFormData({ whitelistAddresses: validAddresses });
    } catch (error) {
      toast.error('Error importing whitelist');
      console.error('Import error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!account) {
        connectWallet();
        return;
      }

      // Validate form data
      if (!formData.type || !formData.name || !formData.symbol || !formData.artwork) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Initialize provider and signer first
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer2 = await provider.getSigner();
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkChainId = parseInt(currentChainId, 16);
      
      const factoryAddress = NFT_CONTRACTS[networkChainId]?.NFT_FACTORY;
      if (!factoryAddress) {
        toast.error('Unsupported network');
        return;
      }

      toast.loading('Uploading metadata...', { id: 'metadata' });
      const metadataUrl = await prepareAndUploadMetadata(formData, formData.artwork);
      toast.success('Metadata uploaded successfully!', { id: 'metadata' });

      // Use signer2 for contract instance
      const factory = new ethers.Contract(factoryAddress, NFTFactoryABI, signer2);
      const fee = ethers.parseEther(networkChainId === 137 ? '20' : '0.015');

      toast.loading('Creating collection...', { id: 'create' });

      const tx = await factory.createNFTCollection(
        formData.type,
        formData.name,
        formData.symbol,
        metadataUrl,
        BigInt(formData.maxSupply || 1000),
        formData.mintPrice ? ethers.parseEther(formData.mintPrice.toString()) : BigInt(0),
        BigInt(formData.maxPerWallet || 1),
        BigInt(Math.floor(Date.now() / 1000)),
        BigInt(formData.infiniteMint ? 0 : Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60),
        Boolean(formData.infiniteMint),
        getPaymentToken(networkChainId),
        Boolean(formData.enableWhitelist),
        { value: fee }
      );

      toast.loading('Waiting for confirmation...', { id: 'create' });
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Full transaction receipt:', receipt);

      // Find the collection address from the CollectionCreated event data
      let collectionAddress;
      const creationEvent = receipt.logs.find(log => 
        log.topics[0] === '0xaf1866185e64615f1cfc5b81e7bf1ff8beafdc402920eb36641743d8fe5f7757'  // CollectionCreated event
      );

      if (creationEvent) {
        try {
          // Parse the event data to get the collection address
          const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
            ['tuple(address creator, address collection, string collectionType, string name, string symbol, uint256 maxSupply, uint256 mintPrice, uint256 maxPerWallet, uint256 releaseDate, uint256 mintEndDate, bool infiniteMint)'],
            creationEvent.data
          );
          collectionAddress = decodedData[0].collection;
        } catch (error) {
          console.error('Failed to decode event:', error);
        }
      }

      if (!collectionAddress) {
        // Fallback to checking for Initialized event
        const initializedEvent = receipt.logs.find(log => 
          log.topics[0] === '0x82dfd53401a55bb491abcb3e7a97c99da1ed7eaffd89721d3e96e8e8ad4a692d'  // Initialized event
        );
        collectionAddress = initializedEvent?.address;
      }

      if (!collectionAddress) {
        throw new Error('Collection address not found');
      }

      console.log('Collection created at:', collectionAddress);

      // Store collection data
      const collectionData = {
        ...formData,
        contractAddress: collectionAddress,
        network: networkChainId === 137 ? 'polygon' : 'sepolia',
        mintToken: {
          type: formData.mintingToken || 'native',
          symbol: formData.mintingToken === 'usdc' ? 'USDC' : 
                  formData.mintingToken === 'usdt' ? 'USDT' : 
                  networkChainId === 137 ? 'MATIC' : 'ETH',
          address: getPaymentToken(networkChainId)
        },
        createdAt: Date.now(),
        totalMinted: 0
      };

      console.log('Storing collection data:', collectionData);
      // Store in both places to maintain existing functionality
      localStorage.setItem(`collection_${formData.symbol}`, JSON.stringify(collectionData));
      await saveCollection(collectionData);

      // Also store in collections array for the list view
      const collections = JSON.parse(localStorage.getItem('collections') || '[]');
      collections.push({
        ...collectionData,
        type: formData.type // Ensure type is stored
      });
      localStorage.setItem('collections', JSON.stringify(collections));
      
      toast.success('Collection created successfully!', { id: 'create' });
      onClose();
      navigate(`/collection/${formData.symbol}`);

      console.log('Collection Creation Debug:', {
        receipt: receipt,
        collectionAddress: collectionAddress,
        collectionData: collectionData
      });

    } catch (error) {
      console.error('Creation error:', error);
      
      let errorMessage = 'Failed to create collection. Please try again.';
      
      if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds to pay the creation fee';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected';
      } else if (error.message.includes('network error')) {
        errorMessage = 'Network error. Please check your connection and try again';
      }
      
      toast.error(errorMessage, { id: 'create' });
    }
  };

  const handleFileUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = type === 'csv' ? '.csv' : type === 'excel' ? '.xlsx,.xls' : '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        let addresses = [];
        
        if (type === 'csv') {
          const text = await file.text();
          // Simple CSV parsing - one address per line
          addresses = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(address => ({
              address,
              maxMint: 1
            }));
        } 
        else if (type === 'excel') {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          addresses = jsonData.map(row => ({
            address: row.address || row.wallet || row.Address || Object.values(row)[0],
            maxMint: 1
          }));
        } 
        else if (type === 'json') {
          const text = await file.text();
          let jsonData = JSON.parse(text);
          
          // Handle different possible JSON structures
          let addressArray = [];
          
          // If it's a direct array of addresses
          if (Array.isArray(jsonData)) {
            addressArray = jsonData;
          }
          // If addresses are in a property
          else if (typeof jsonData === 'object') {
            if (jsonData.addresses) {
              addressArray = jsonData.addresses;
            } else if (jsonData.whitelist) {
              addressArray = jsonData.whitelist;
            } else {
              // Try to extract addresses from object values
              addressArray = Object.values(jsonData).flat();
            }
          }

          // Convert all formats to standard address objects
          addresses = addressArray.map(item => {
            // If item is a string (direct address)
            if (typeof item === 'string') {
              return {
                address: item.trim(),
                maxMint: 1
              };
            }
            // If item is an object with address property
            else if (typeof item === 'object') {
              const addr = item.address || item.wallet || '';
              return {
                address: addr.trim(),
                maxMint: 1
              };
            }
            return null;
          }).filter(item => item !== null); // Remove any invalid entries
        }

        // Filter valid addresses
        const validAddresses = addresses
          .filter(item => item.address && validateAddress(item.address))
          .map(item => ({
            address: item.address,
            maxMint: 1
          }));

        if (validAddresses.length === 0) {
          toast.error('No valid addresses found in file');
          return;
        }

        updateFormData({ whitelistAddresses: validAddresses });
        toast.success(`Imported ${validAddresses.length} addresses`);

      } catch (error) {
        console.error('Error importing file:', error);
        toast.error(`Failed to import ${type} file. Please check the format.`);
      }
    };

    input.click();
  };

  const renderStep = () => {
    const commonLayout = (content) => (
      <div className="space-y-6">
        {content}
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
          <button
            onClick={handleButtonClick}
            className="px-6 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg transition-colors ml-auto"
          >
            {currentStep === 'minting' ? 'Create Collection' : 'Continue'}
          </button>
        </div>
      </div>
    );

    switch (currentStep) {
      case 'type':
        return commonLayout(renderTypeSelection());
      case 'basics':
        return commonLayout(renderBasicInfo());
      case 'artwork':
        return commonLayout(renderArtworkUpload());
      case 'properties':
        return commonLayout(renderPropertiesSection());
      case 'minting':
        return commonLayout(renderTokenSelection());
    }
  };

  const renderTypeSelection = () => {
    return (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Choose your NFT collection type
        </p>
        <div className="grid grid-cols-1 gap-4">
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
      </div>
    );
  };

  const renderBasicInfo = () => (
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
    </div>
  );

  const renderArtworkUpload = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-64 h-64 relative">
          <div 
            className={clsx(
              'w-full h-full rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden',
              formData.previewUrl ? 'border-[#00ffbd]' : 'border-gray-300 dark:border-gray-700'
            )}
          >
            {formData.previewUrl ? (
              <img 
                src={formData.previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <BiImageAdd size={48} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Drop your image here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max size: 2MB
                </p>
              </div>
            )}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {formData.previewUrl && (
        <div className="text-center">
          <button
            onClick={() => updateFormData({ artwork: null, previewUrl: null })}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );

  const renderPropertiesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Properties
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add traits that make your NFTs unique
          </p>
        </div>
        <button
          onClick={() => updateFormData({
            properties: [...formData.properties, { trait_type: '', value: '' }]
          })}
          className="px-3 py-1.5 text-sm bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg"
        >
          Add Property
        </button>
      </div>

      {formData.properties.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-sm text-gray-500">
            No properties added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {formData.properties.map((prop, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  placeholder="Property name"
                  value={prop.trait_type}
                  onChange={(e) => {
                    const newProps = [...formData.properties];
                    newProps[index].trait_type = e.target.value;
                    updateFormData({ properties: newProps });
                  }}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm"
                />
              </div>
              <div className="flex-1">
                <input
                  placeholder="Value"
                  value={prop.value}
                  onChange={(e) => {
                    const newProps = [...formData.properties];
                    newProps[index].value = e.target.value;
                    updateFormData({ properties: newProps });
                  }}
                  className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm"
                />
              </div>
              <button
                onClick={() => {
                  const newProps = formData.properties.filter((_, i) => i !== index);
                  updateFormData({ properties: newProps });
                }}
                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <BiX size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTokenSelection = () => (
    <div className="space-y-6">
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
            <option value="native">Native Token (ETH/MATIC)</option>
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
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Token Contract Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={formData.customTokenAddress}
              onChange={(e) => updateFormData({ customTokenAddress: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Token Symbol
            </label>
            <input
              type="text"
              placeholder="Enter token symbol"
              value={formData.customTokenSymbol}
              onChange={(e) => updateFormData({ customTokenSymbol: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mint Price
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.000000000000000001"
              value={formData.mintPrice}
              onChange={(e) => updateFormData({ mintPrice: e.target.value })}
              className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg pl-16 p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Supply
          </label>
          <input
            type="number"
            value={formData.maxSupply}
            onChange={(e) => updateFormData({ maxSupply: e.target.value })}
            className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
            placeholder="Enter max supply"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Per Wallet
          </label>
          <input
            type="number"
            value={formData.maxPerWallet}
            onChange={(e) => updateFormData({ maxPerWallet: e.target.value })}
            className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none"
            placeholder="Enter max per wallet"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Release Date
          </label>
          <input
            type="datetime-local"
            value={formData.releaseDate}
            onChange={(e) => updateFormData({ releaseDate: e.target.value })}
            className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none appearance-auto"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.enableWhitelist}
            onChange={(e) => updateFormData({ enableWhitelist: e.target.checked })}
            className="w-4 h-4 text-[#00ffbd] border-gray-300 rounded focus:ring-[#00ffbd]"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Enable whitelist for early minting
          </span>
        </label>

        {formData.enableWhitelist && renderWhitelistSection()}
      </div>

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
    </div>
  );

  const renderWhitelistSection = () => (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-[#1a1b1f] rounded-lg">
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        <div className="sticky top-0 bg-gray-50 dark:bg-[#1a1b1f] z-10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Import Whitelist
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add wallet addresses for whitelist access
              </p>
            </div>
            <button
              onClick={() => updateFormData({
                whitelistAddresses: [...formData.whitelistAddresses, { address: '', maxMint: 1 }]
              })}
              className="px-3 py-1.5 text-sm bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-medium rounded-lg"
            >
              Add Address
            </button>
          </div>

          {/* File import buttons */}
          <div className="flex gap-2 mt-4">
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
              Import Excel
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

        {/* Address input and list section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                placeholder="Enter addresses (one per line)"
                value={formData.whitelistAddresses.map(addr => addr.address).join('\n')}
                onChange={(e) => {
                  const addresses = e.target.value
                    .split('\n')
                    .map(addr => addr.trim())
                    .filter(addr => addr)
                    .map(address => ({
                      address,
                      maxMint: formData.defaultMaxMint || 1
                    }));
                  updateFormData({ whitelistAddresses: addresses });
                }}
                className="w-full h-24 bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm font-mono"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                You can paste multiple addresses, each on a new line
              </p>
            </div>
            <div className="w-24">
              <input
                type="number"
                placeholder="Max mint"
                value={formData.defaultMaxMint || 1}
                onChange={(e) => {
                  const maxMint = parseInt(e.target.value) || 1;
                  updateFormData({ defaultMaxMint: maxMint });
                }}
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-2.5 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:ring-2 focus:ring-[#00ffbd]/20 focus:outline-none text-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Max per wallet
              </p>
            </div>
          </div>

          {formData.whitelistAddresses.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Added Addresses ({formData.whitelistAddresses.length})
              </h4>
              <div className="max-h-[150px] overflow-y-auto">
                <div className="space-y-2">
                  {formData.whitelistAddresses.map((addr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-[#0d0e12] rounded-lg"
                    >
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate">
                        {addr.address}
                      </span>
                      <button
                        onClick={() => {
                          const newAddresses = formData.whitelistAddresses.filter((_, i) => i !== index);
                          updateFormData({ whitelistAddresses: newAddresses });
                        }}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        <BiX size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-[#0d0e12] rounded-xl p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              {currentStep !== 'type' && (
                <button 
                  onClick={() => {
                    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
                    setCurrentStep(STEPS[currentIndex - 1].id);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1b1f] rounded-lg transition-colors"
                >
                  <BiChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              )}
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Create NFT Collection
              </Dialog.Title>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <BiX size={24} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between">
              {STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={clsx(
                    'flex items-center',
                    index !== STEPS.length - 1 && 'flex-1'
                  )}
                >
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

          {renderStep()}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 