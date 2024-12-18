import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import TokenSelectionModal from './TokenSelectionModal';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ERC20_ABI } from '../../services/erc20';
import { useWeb3Modal } from '@web3modal/react';
import { BiWallet } from 'react-icons/bi';

export default function PoolCreation() {
  const { address: account, isConnected } = useAccount();
  const { open: openConnectModal } = useWeb3Modal();
  const [currentChainId, setCurrentChainId] = useState(null);
  const uniswap = useUniswap();
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [fee, setFee] = useState('0.3');
  const [loading, setLoading] = useState(false);
  const [showToken0Modal, setShowToken0Modal] = useState(false);
  const [showToken1Modal, setShowToken1Modal] = useState(false);
  const [priceRatio, setPriceRatio] = useState(null);
  const [useAutoPrice, setUseAutoPrice] = useState(true);

  // Add useEffect to get chain ID and listen for changes
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

  // Add function to validate Ethereum address
  const isValidAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Handle token selection
  const handleToken0Select = async (token) => {
    if (token.symbol === 'ETH') {
      setToken0({
        ...token,
        address: UNISWAP_ADDRESSES.WETH,
        decimals: 18
      });
    } else {
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setToken0({ ...token, ...tokenInfo });
    }
    setShowToken0Modal(false);
  };

  const handleToken1Select = async (token) => {
    if (token.symbol === 'ETH') {
      setToken1({
        ...token,
        address: UNISWAP_ADDRESSES.WETH,
        decimals: 18
      });
    } else {
      const tokenInfo = await uniswap.getTokenInfo(token.address);
      setToken1({ ...token, ...tokenInfo });
    }
    setShowToken1Modal(false);
  };

  // Handle amount changes
  const handleAmount0Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount0(value);
      if (useAutoPrice && priceRatio) {
        setAmount1(calculateOtherAmount(value, true));
      }
    }
  };

  const handleAmount1Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount1(value);
      if (useAutoPrice && priceRatio) {
        setAmount0(calculateOtherAmount(value, false));
      }
    }
  };

  // Calculate other amount based on price ratio
  const calculateOtherAmount = (amount, isToken0) => {
    if (!amount) return '';
    if (!priceRatio) return '';
    
    try {
      return isToken0 
        ? (Number(amount) * priceRatio).toFixed(6)
        : (Number(amount) / priceRatio).toFixed(6);
    } catch (error) {
      console.error('Error calculating amount:', error);
      return '';
    }
  };

  // Modify handleCreatePool to check pool existence first
  const handleCreatePool = async () => {
    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (!token0 || !token1) {
      toast.error('Please select both tokens');
      return;
    }

    if (!amount0 || !amount1) {
      toast.error('Please enter both amounts');
      return;
    }

    setLoading(true);
    try {
      // Check if pool exists first
      const poolExists = await uniswap.checkPoolExists(token0.address, token1.address);
      
      if (poolExists) {
        toast.error('This pool already exists. Please use the Add Liquidity feature instead.');
        setLoading(false);
        return;
      }

      // Parse amounts
      const parsedAmount0 = ethers.parseUnits(amount0, token0.decimals);
      const parsedAmount1 = ethers.parseUnits(amount1, token1.decimals);

      toast.loading('Creating pool and adding liquidity...', { id: 'pool-create' });

      const result = await uniswap.createPool(
        token0.address,
        token1.address,
        parsedAmount0,
        parsedAmount1
      );

      console.log('Pool created at:', result.pairAddress);
      toast.success('Pool created and liquidity added successfully!', { id: 'pool-create' });
      
      // Reset form
      setAmount0('');
      setAmount1('');
      setToken0(null);
      setToken1(null);
    } catch (error) {
      console.error('Error creating pool:', error);
      toast.error(
        error.message.includes('insufficient')
          ? 'Insufficient balance for transaction'
          : error.message.includes('chain')
          ? 'Please switch to a supported network'
          : `Failed to create pool: ${error.message}`,
        { id: 'pool-create' }
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch price ratio when tokens are selected
  useEffect(() => {
    async function fetchPriceRatio() {
      if (!token0 || !token1) return;

      try {
        // For demo purposes, using a simple 1:1 ratio
        setPriceRatio(1);
        
        // If amounts exist and auto-price is enabled, update them
        if (useAutoPrice) {
          if (amount0) {
            setAmount1(calculateOtherAmount(amount0, true));
          } else if (amount1) {
            setAmount0(calculateOtherAmount(amount1, false));
          }
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        setPriceRatio(1);
      }
    }

    fetchPriceRatio();
  }, [token0, token1]);

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        {!isConnected ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <BiWallet size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Please connect your wallet to create a liquidity pool
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
            {/* Auto-price toggle */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useAutoPrice}
                  onChange={(e) => setUseAutoPrice(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#00ffbd]"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">Auto-calculate prices</span>
              </label>
            </div>

            {/* Token 0 Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Token 1
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setShowToken0Modal(true)}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
                >
                  {token0 ? (
                    <div className="flex items-center gap-2">
                      <img src={token0.logo} alt={token0.symbol} className="w-5 h-5" />
                      <span>{token0.symbol}</span>
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {token0 && (
                <input
                  type="text"
                  value={amount0}
                  onChange={(e) => handleAmount0Change(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                />
              )}
            </div>

            {/* Token 1 Selection */}
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Token 2
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setShowToken1Modal(true)}
                  className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
                >
                  {token1 ? (
                    <div className="flex items-center gap-2">
                      <img src={token1.logo} alt={token1.symbol} className="w-5 h-5" />
                      <span>{token1.symbol}</span>
                    </div>
                  ) : (
                    'Select Token'
                  )}
                </button>
              </div>
              {token1 && (
                <input
                  type="text"
                  value={amount1}
                  onChange={(e) => handleAmount1Change(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 mt-2 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white"
                />
              )}
            </div>

            {/* Fee Tier Selection */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Fee Tier
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['0.01', '0.05', '0.3', '1'].map((feeTier) => (
                  <button
                    key={feeTier}
                    onClick={() => setFee(feeTier)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium
                      ${fee === feeTier
                        ? 'bg-[#00ffbd] text-black'
                        : 'bg-white/10 dark:bg-[#2d2f36] text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80'
                      }
                      transition-colors
                    `}
                  >
                    {feeTier}%
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                About Pool Creation
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Creating a new liquidity pool allows you to be the first liquidity provider.
                You'll need to deposit both tokens in the ratio you want to set the initial price.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Pool Button */}
      <button
        onClick={handleCreatePool}
        disabled={loading || !token0 || !token1 || !amount0 || !amount1}
        className={`
          w-full px-4 py-4 rounded-xl font-medium text-black text-lg
          ${loading || !token0 || !token1 || !amount0 || !amount1
            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
          }
        `}
      >
        {loading ? 'Creating Pool...' : 'Create Pool'}
      </button>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showToken0Modal}
        onClose={() => setShowToken0Modal(false)}
        onSelect={handleToken0Select}
        selectedTokenAddress={token0?.address}
      />
      <TokenSelectionModal
        isOpen={showToken1Modal}
        onClose={() => setShowToken1Modal(false)}
        onSelect={handleToken1Select}
        selectedTokenAddress={token1?.address}
      />
    </div>
  );
} 