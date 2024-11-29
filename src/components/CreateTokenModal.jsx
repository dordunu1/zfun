import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { BiX, BiImageAdd } from 'react-icons/bi';
import { useWallet } from '../context/WalletContext';
import TokenFactoryABI from '../contracts/TokenFactory.json';
import { uploadTokenLogo } from '../services/storage';
import { useDeployments } from '../context/DeploymentsContext';
import { ipfsToHttp } from '../utils/ipfs';


const SUPPORTED_CHAINS = import.meta.env.VITE_SUPPORTED_CHAINS.split(',').map(Number);
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137
};
const CHAIN_FEES = {
  11155111: "0.01",  // Sepolia fee in ETH
  137: "20"          // Polygon fee in MATIC
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

  const getFactoryAddress = () => {
    return FACTORY_ADDRESSES[currentChainId];
  };

  const getFee = () => {
    return CHAIN_FEES[currentChainId];
  };

  // Update the handleSuccess function
  const handleSuccess = async (deployedAddress, eventData, logoUrls) => {
    try {
      await addDeployment({
        name: eventData.name,
        symbol: eventData.symbol,
        address: deployedAddress,
        chainId: currentChainId,
        chainName: currentChainId === 137 ? 'Polygon' : 'Sepolia',
        logo: logoUrls.httpUrl,
        logoIpfs: logoUrls.ipfsUrl,
        description: formData.description,
        totalSupply: ethers.formatUnits(eventData.supply, eventData.decimals),
        timestamp: Date.now()
      });

      // Clear any existing toasts
      toast.dismiss();
      
      // Delay the success toast slightly to let confetti start
      setTimeout(() => {
        const dexes = DEX_CONFIGS[currentChainId] || [];
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-[#1a1b1f] shadow-lg rounded-lg pointer-events-auto flex flex-col`}>
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 pt-0.5">
                  <img src="/success-icon.png" alt="Success" className="h-10 w-10" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-lg font-medium text-[#00ffbd]">
                    Token created successfully! 🎉
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Add liquidity to make your token tradeable:
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {dexes.map((dex) => (
                  <a
                    key={dex.name}
                    href={dex.addLiquidityUrl(deployedAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-[#2d2f36] hover:bg-gray-100 dark:hover:bg-[#3d3f46] transition-colors"
                  >
                    <img src={dex.logo} alt={dex.name} className="w-6 h-6" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Add liquidity on {dex.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ), {
          duration: 15000,
          position: 'top-center',
        });
      }, 100);

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

    try {
      let logoUrls = { ipfsUrl: '', httpUrl: '' };
      if (formData.logo) {
        toast.loading('Uploading logo...', { id: 'upload' });
        try {
          logoUrls = await uploadTokenLogo(formData.logo);
          toast.success('Logo uploaded!', { id: 'upload' });
        } catch (uploadError) {
          toast.error(`Logo upload failed: ${uploadError.message}`, { id: 'upload' });
          return;
        }
      } else {
        toast.error('Please upload a logo');
        return;
      }

      if (!SUPPORTED_CHAINS.includes(currentChainId)) {
        toast.error('Please switch to a supported network');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const factory = new ethers.Contract(getFactoryAddress(), TokenFactoryABI.abi, signer);

      const fee = ethers.parseEther(CHAIN_FEES[currentChainId].toString());
      
      toast.loading('Creating token...', { 
        id: 'create',
        style: {
          background: '#1a1b1f',
          color: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #2d2f36'
        }
      });

      const tx = await factory.createToken(
        formData.name,
        formData.symbol,
        18,
        ethers.parseUnits(formData.totalSupply, 18),
        logoUrls.ipfsUrl, // Use IPFS URL for blockchain storage
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

      handleSuccess(deployedAddress, eventData, logoUrls);

    } catch (error) {
      console.error('Token Creation error:', error);
      toast.error(
        error.message.includes('chain') 
          ? 'Please switch to a supported network'
          : `Failed to create token: ${error.message}`,
        { id: 'create' }
      );
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const formatWithDecimals = (value) => {
    if (!value) return '';
    return `${value}${'0'.repeat(18)}`;
  };

  const handleSupplyChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ 
      ...formData, 
      totalSupply: value,
      totalSupplyWithDecimals: formatWithDecimals(value)
    });
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-[#0d0e12] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Token
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <BiX size={24} />
              </button>
            </div>
            
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
                  onChange={handleSupplyChange}
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
    </>
  );
}