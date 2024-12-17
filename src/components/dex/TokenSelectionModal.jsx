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

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomToken(null);
      setError('');
    }
  }, [isOpen]);

  // Handle search for custom token
  useEffect(() => {
    const searchCustomToken = async () => {
      if (!searchQuery || searchQuery.length < 42) {
        setCustomToken(null);
        setError('');
        return;
      }

      if (!ethers.utils.isAddress(searchQuery)) {
        setCustomToken(null);
        setError('Invalid token address');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const tokenInfo = await uniswap.getTokenInfo(searchQuery);
        setCustomToken({
          address: searchQuery,
          ...tokenInfo,
          logo: '/placeholder.png'
        });
      } catch (error) {
        console.error('Error loading token:', error);
        setError('Invalid token contract');
        setCustomToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    searchCustomToken();
  }, [searchQuery, uniswap]);

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
                  key={token.address}
                  token={token}
                  userAddress={userAddress}
                  onSelect={handleTokenSelect}
                  isSelected={selectedTokenAddress === (token.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : token.address)}
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
              />
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function TokenRow({ token, userAddress, onSelect, isSelected }) {
  const [directBalance, setDirectBalance] = useState(null);
  
  // Use useBalance hook for ETH
  const { data: balance, isError, isLoading } = useBalance({
    address: userAddress,
    token: token.symbol === 'ETH' ? undefined : token.address,
    chainId: 11155111,
    enabled: Boolean(userAddress) && token.symbol === 'ETH',
    watch: true,
  });

  // Fetch balance directly for tokens using contract call
  useEffect(() => {
    async function fetchTokenBalance() {
      if (!userAddress || token.symbol === 'ETH' || !window.ethereum) return;
      
      try {
        // Use ethers v6 syntax
        const provider = new ethers.BrowserProvider(window.ethereum);
        const tokenContract = new ethers.Contract(
          token.address,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );

        const [rawBalance, decimals] = await Promise.all([
          tokenContract.balanceOf(userAddress),
          tokenContract.decimals()
        ]);

        const formatted = ethers.formatUnits(rawBalance, decimals);
        setDirectBalance(formatted);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        setDirectBalance(null);
      }
    }

    fetchTokenBalance();
    const interval = setInterval(fetchTokenBalance, 10000);
    return () => clearInterval(interval);
  }, [userAddress, token.address, token.symbol]);

  const displayBalance = React.useMemo(() => {
    if (!userAddress) return '0.0000';
    
    // For ETH, use wagmi's useBalance hook result
    if (token.symbol === 'ETH') {
      if (isLoading) return 'Loading...';
      if (isError || !balance) return '0.0000';
      return Number(balance.formatted).toFixed(4);
    }
    
    // For other tokens, use direct contract call result
    if (directBalance === null) return 'Loading...';
    return Number(directBalance).toFixed(4);
  }, [balance, isError, isLoading, userAddress, token.symbol, directBalance]);

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