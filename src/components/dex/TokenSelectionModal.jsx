import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { useUniswap } from '../../hooks/useUniswap';

// Common tokens with metadata - IMPORTANT: Include all necessary info to avoid fetching
const COMMON_TOKENS = [
  {
    address: 'ETH', // Special case for ETH
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH, // WETH contract address
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/eth.png' // Using same logo as ETH
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'tUSDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

export default function TokenSelectionModal({ isOpen, onClose, onSelect, selectedTokenAddress }) {
  const { address: userAddress } = useAccount();
  const uniswap = useUniswap();
  const [searchQuery, setSearchQuery] = useState('');
  const [customToken, setCustomToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Reset search and force refresh when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomToken(null);
      setError('');
      setRefreshTrigger(prev => prev + 1); // Force refresh of balances
    }
  }, [isOpen]);

  // Handle search for custom token
  useEffect(() => {
    const searchCustomToken = async () => {
      // Clear custom token if search is empty or too short
      if (!searchQuery || searchQuery.length < 42) {
        setCustomToken(null);
        setError('');
        return;
      }

      // Check if the search query looks like an address
      if (!ethers.isAddress(searchQuery)) {
        setCustomToken(null);
        // Only show error if it looks like they're trying to paste an address
        if (searchQuery.startsWith('0x')) {
          setError('Invalid token address');
        }
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          searchQuery,
          [
            'function symbol() view returns (string)',
            'function name() view returns (string)',
            'function decimals() view returns (uint8)'
          ],
          provider
        );

        // Fetch token details in parallel
        const [symbol, name, decimals] = await Promise.all([
          tokenContract.symbol().catch(() => 'Unknown'),
          tokenContract.name().catch(() => 'Unknown Token'),
          tokenContract.decimals().catch(() => 18)
        ]);

        setCustomToken({
          address: searchQuery,
          symbol,
          name,
          decimals,
          logo: '/placeholder-token.png'
        });
        setError('');
      } catch (error) {
        console.error('Error loading token:', error);
        setError('Could not load token information. Make sure this is a valid ERC20 token.');
        setCustomToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search to avoid too many requests
    const timeoutId = setTimeout(searchCustomToken, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleTokenSelect = (token) => {
    console.log('Token being selected:', token);
    console.log('Token type:', typeof token);
    console.log('Token properties:', Object.keys(token));

    // Validate token structure before proceeding
    if (!token || typeof token !== 'object') {
      console.error('Invalid token object:', token);
      setError('Invalid token selection');
      return;
    }

    try {
      let finalToken;
      if (token.symbol === 'ETH') {
        console.log('Processing ETH token');
        finalToken = {
          ...token,
          address: UNISWAP_ADDRESSES.WETH
        };
      } else {
        console.log('Processing non-ETH token');
        finalToken = token;
      }

      console.log('Final token to be selected:', finalToken);
      onSelect(finalToken);
      onClose();
    } catch (error) {
      console.error('Error in handleTokenSelect:', error);
      setError('Failed to process token selection');
    }
  };

  const filteredTokens = COMMON_TOKENS.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl border border-gray-200 dark:border-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Token
          </Dialog.Title>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or paste address"
              className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Common Tokens Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Common Tokens
            </h3>
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <TokenRow
                  key={`${token.address}-${refreshTrigger}`}
                  token={token}
                  userAddress={userAddress}
                  onSelect={handleTokenSelect}
                  isSelected={selectedTokenAddress === (token.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : token.address)}
                  forceRefresh={refreshTrigger}
                />
              ))}
            </div>
          </div>

          {/* Custom Token Section */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#00ffbd] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {customToken && !error && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Custom Token
              </h3>
              <TokenRow
                token={customToken}
                userAddress={userAddress}
                onSelect={handleTokenSelect}
                isSelected={selectedTokenAddress === customToken.address}
                forceRefresh={refreshTrigger}
              />
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function TokenRow({ token, userAddress, onSelect, isSelected, forceRefresh }) {
  const [walletBalance, setWalletBalance] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Direct wallet balance reading for ETH
  const updateWalletBalance = async () => {
    if (!userAddress || !window.ethereum) return;
    
    try {
      setIsUpdating(true);
      const provider = new ethers.BrowserProvider(window.ethereum);

      if (token.symbol === 'ETH') {
        // For ETH, directly read from wallet
        const balance = await provider.getBalance(userAddress);
        const formatted = ethers.formatEther(balance);
        setWalletBalance(formatted);
      } else {
        // For WETH and other tokens
        const tokenContract = new ethers.Contract(
          token.address,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );

        try {
          const [rawBalance, decimals] = await Promise.all([
            tokenContract.balanceOf(userAddress),
            tokenContract.decimals()
          ]);

          const formatted = ethers.formatUnits(rawBalance, decimals);
          setWalletBalance(formatted);
        } catch (error) {
          console.error('Error fetching token balance:', error);
          setWalletBalance('0');
        }
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance('0');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update balance immediately when component mounts or modal opens
  useEffect(() => {
    updateWalletBalance();
  }, [userAddress, token.address, token.symbol, forceRefresh]);

  // Set up blockchain event listeners for real-time updates
  useEffect(() => {
    if (!window.ethereum) return;

    const handleNewBlock = () => {
      updateWalletBalance();
    };

    const handleAccountsChanged = () => {
      updateWalletBalance();
    };

    window.ethereum.on('block', handleNewBlock);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Poll every second as backup
    const interval = setInterval(updateWalletBalance, 1000);

    return () => {
      window.ethereum.removeListener('block', handleNewBlock);
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      clearInterval(interval);
    };
  }, [userAddress, token.address, token.symbol]);

  const displayBalance = React.useMemo(() => {
    if (!userAddress || walletBalance === null) return '0.0000';
    return Number(walletBalance).toFixed(4);
  }, [walletBalance, userAddress]);

  const handleClick = () => {
    if (token.symbol === 'ETH') {
      onSelect({
        ...token,
        address: UNISWAP_ADDRESSES.WETH
      });
    } else {
      onSelect({
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logo: token.logo
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#2d2f36] rounded-xl transition-colors ${
        isSelected ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
        <div className="text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {token.symbol}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {token.name}
          </div>
        </div>
      </div>
      <div className="text-right text-sm text-gray-900 dark:text-white">
        {displayBalance}
      </div>
    </button>
  );
} 