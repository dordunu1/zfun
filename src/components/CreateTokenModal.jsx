import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { BiX, BiImageAdd } from 'react-icons/bi';
import { useWallet } from '../context/WalletContext';
import TokenFactoryABI from '../contracts/TokenFactory.json';
import { uploadTokenLogo } from '../services/storage';


const SUPPORTED_CHAINS = import.meta.env.VITE_SUPPORTED_CHAINS.split(',').map(Number);
const FACTORY_ADDRESSES = {
  11155111: import.meta.env.VITE_FACTORY_ADDRESS_11155111,
  137: import.meta.env.VITE_FACTORY_ADDRESS_137
};
const CHAIN_FEES = {
  11155111: "0.02",  // Sepolia fee in ETH
  137: "20"          // Polygon fee in MATIC
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

  const createToken = async (e) => {
    e.preventDefault();
    
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      let logoUrl = '';
      if (formData.logo) {
        toast.loading('Uploading logo...', { id: 'upload' });
        try {
          logoUrl = await uploadTokenLogo(formData.logo);
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
      
      toast.loading('Creating token...', { id: 'create' });
      const tx = await factory.createToken(
        formData.name,
        formData.symbol,
        18,
        ethers.parseUnits(formData.totalSupply, 18),
        logoUrl,
        { 
          value: fee,
          gasLimit: 3000000
        }
      );

      await tx.wait();
      toast.success('Token created successfully!', { id: 'create' });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.reason || error.message || 'Transaction failed', { id: 'create' });
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
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:outline-none"
                placeholder="My Token"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Token Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:outline-none"
                placeholder="MTK"
                required
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
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:outline-none"
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
                className="w-full bg-gray-50 dark:bg-[#1a1b1f] text-gray-900 dark:text-white rounded-lg p-3 border border-gray-300 dark:border-gray-700 focus:border-[#00ffbd] focus:outline-none resize-none"
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
  );
}