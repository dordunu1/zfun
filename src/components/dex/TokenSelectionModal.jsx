import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { useUniswap } from '../../hooks/useUniswap';
import { FaSearch } from 'react-icons/fa';
import { getTokenDeploymentByAddress, getAllTokenDeployments } from '../../services/firebase';
import { ipfsToHttp } from '../../utils/ipfs';

// Common tokens with metadata
const COMMON_TOKENS = [
  {
    address: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '/eth.png'
  },
  {
    address: UNISWAP_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Test USDT',
    decimals: 6,
    logo: '/usdt.png'
  }
];

// Add CSS for custom scrollbar
const scrollbarStyles = `
  .token-list-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .token-list-scrollbar::-webkit-scrollbar-track {
    background: #2d2f36;
    border-radius: 3px;
  }
  .token-list-scrollbar::-webkit-scrollbar-thumb {
    background: #00ffbd;
    border-radius: 3px;
  }
  .token-list-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #00ffbd #2d2f36;
  }
`;

function TokenRow({ token, userAddress, onSelect, isSelected }) {
  const { data: balance } = useBalance({
    address: userAddress,
    token: token.address === 'ETH' ? undefined : token.address,
    watch: true,
  });

  const formatBalance = (value, decimals) => {
    const num = Number(ethers.formatUnits(value, decimals));
    
    // If the number is greater than 1, show commas and up to 4 decimal places
    if (num >= 1) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      }).format(num);
    }
    
    // For small numbers (< 1), show up to 6 decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6
    }).format(num);
  };

  const displayBalance = balance 
    ? formatBalance(balance.value, balance.decimals)
    : Number(token.formattedBalance || '0').toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4
      });

  const renderTokenLogo = () => {
    // For common tokens, use their predefined logos
    const commonToken = COMMON_TOKENS.find(t => t.address === token.address);
    if (commonToken) {
      return <img src={commonToken.logo} alt={commonToken.symbol} className="w-8 h-8 rounded-full" />;
    }

    // For tokens with IPFS logo or direct logo
    const logoUrl = token.logo || (token.logoIpfs ? ipfsToHttp(token.logoIpfs) : null);
    if (logoUrl) {
      return (
        <img 
          src={logoUrl}
          alt={token.symbol}
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/token-default.png';
          }}
        />
      );
    }

    // Default token logo
    return (
      <img 
        src="/token-default.png"
        alt={token.symbol || 'Unknown'}
        className="w-8 h-8 rounded-full"
      />
    );
  };

  return (
    <button
      onClick={() => onSelect(token)}
      className={`w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-[#2d2f36] rounded-xl transition-colors ${
        isSelected ? 'bg-[#00ffbd]/10 border-[#00ffbd] border' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {renderTokenLogo()}
        <div className="text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {token.symbol || 'Unknown'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {token.name || 'Unknown Token'}
          </div>
        </div>
      </div>
      <div className="text-right text-sm text-gray-900 dark:text-white">
        {displayBalance}
      </div>
    </button>
  );
}

export default function TokenSelectionModal({ isOpen, onClose, onSelect, selectedTokenAddress }) {
  const { address: userAddress } = useAccount();
  const uniswap = useUniswap();
  const [searchQuery, setSearchQuery] = useState('');
  const [customToken, setCustomToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [tokensWithBalance, setTokensWithBalance] = useState([]);

  // Fetch all deployed tokens when modal opens
  useEffect(() => {
    const fetchDeployedTokens = async () => {
      if (!isOpen || !userAddress) return;
      
      try {
        setIsLoading(true);
        const tokens = await getAllTokenDeployments();
        console.log('Fetched deployed tokens:', tokens);
        
        const formattedTokens = tokens.map(token => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals || 18,
          logo: token.logo,
          logoIpfs: token.logoIpfs,
          artworkType: token.artworkType,
          verified: true
        }));
        
        setDeployedTokens(formattedTokens);

        // Check balances for all tokens
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // First check if the contract is valid ERC20 before checking balance
        const checkTokenBalance = async (token) => {
          try {
            if (token.address === 'ETH') {
              const balance = await provider.getBalance(userAddress);
              return balance > 0n ? token : null;
            }

            // First verify if the contract exists and has the required methods
            const code = await provider.getCode(token.address);
            if (code === '0x') return null; // Contract doesn't exist

            const contract = new ethers.Contract(
              token.address,
              [
                'function balanceOf(address) view returns (uint256)',
                'function decimals() view returns (uint8)',
                'function symbol() view returns (string)',
                'function name() view returns (string)'
              ],
              provider
            );

            // Try to call balanceOf
            try {
              const balance = await contract.balanceOf(userAddress);
              if (balance > 0n) {
                // Verify other token information
                try {
                  await Promise.all([
                    contract.symbol(),
                    contract.name(),
                    contract.decimals()
                  ]);
                  return token;
                } catch {
                  // If any of the token info calls fail, still return the token but with basic info
                  return token;
                }
              }
              return null;
            } catch {
              return null;
            }
          } catch (error) {
            // Silently fail and return null for any errors
            return null;
          }
        };

        const tokensWithBalances = await Promise.all(
          [...COMMON_TOKENS, ...formattedTokens].map(checkTokenBalance)
        );

        const validTokens = tokensWithBalances.filter(token => token !== null);
        console.log('Tokens with balance:', validTokens);
        setTokensWithBalance(validTokens);
      } catch (error) {
        console.error('Error fetching deployed tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployedTokens();
  }, [isOpen, userAddress]);

  // Reset search and force refresh when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomToken(null);
      setError('');
      setRefreshTrigger(prev => prev + 1);
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
        if (searchQuery.startsWith('0x')) {
          setError('Invalid token address');
        }
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // First try to get token info from Firestore deployments
        const tokenDeployment = await getTokenDeploymentByAddress(searchQuery);
        
        if (tokenDeployment) {
          console.log('Found custom token in Firebase:', tokenDeployment);
          setCustomToken({
            address: searchQuery,
            symbol: tokenDeployment.symbol,
            name: tokenDeployment.name,
            decimals: tokenDeployment.decimals || 18,
            logo: tokenDeployment.logo,
            logoIpfs: tokenDeployment.logoIpfs,
            artworkType: tokenDeployment.artworkType,
            verified: true
          });
          setError('');
          setIsLoading(false);
          return;
        }

        // If not in Firebase, try direct contract call
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

        const [symbol, name, decimals] = await Promise.all([
          tokenContract.symbol(),
          tokenContract.name(),
          tokenContract.decimals()
        ]);

        setCustomToken({
          address: searchQuery,
          symbol: symbol,
          name: name,
          decimals: decimals,
          logo: null,
          logoIpfs: null,
          artworkType: null,
          verified: true
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

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return tokensWithBalance.filter(token => 
      token.symbol?.toLowerCase().includes(searchLower) ||
      token.name?.toLowerCase().includes(searchLower) ||
      token.address?.toLowerCase().includes(searchLower)
    );
  }, [searchQuery, tokensWithBalance]);

  const handleTokenSelect = async (token) => {
    try {
      let finalToken;
      if (token.symbol === 'ETH') {
        finalToken = {
          ...token,
          address: UNISWAP_ADDRESSES.WETH
        };
      } else {
        // Try to get token info from Firebase
        const tokenDeployment = await getTokenDeploymentByAddress(token.address);
        if (tokenDeployment) {
          finalToken = {
            ...token,
            symbol: tokenDeployment.symbol,
            name: tokenDeployment.name,
            decimals: tokenDeployment.decimals || token.decimals,
            logo: tokenDeployment.logo,
            logoIpfs: tokenDeployment.logoIpfs,
            artworkType: tokenDeployment.artworkType,
            verified: true
          };
        } else {
          finalToken = token;
        }
      }

      onSelect(finalToken);
      onClose();
    } catch (error) {
      console.error('Error in handleTokenSelect:', error);
      setError('Failed to process token selection');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <style>{scrollbarStyles}</style>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 shadow-xl border border-gray-200 dark:border-gray-800">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select Token
          </Dialog.Title>

          {/* Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or paste address"
              className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Token List Container */}
          <div className="token-list-scrollbar overflow-y-auto max-h-[60vh] pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]"></div>
              </div>
            ) : (
              <>
                {/* Common Tokens Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Your Tokens
                  </h3>
                  <div className="space-y-2">
                    {filteredTokens.map((token) => (
                      <TokenRow
                        key={`${token.address}-${refreshTrigger}`}
                        token={token}
                        userAddress={userAddress}
                        onSelect={handleTokenSelect}
                        isSelected={selectedTokenAddress === (token.symbol === 'ETH' ? UNISWAP_ADDRESSES.WETH : token.address)}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Token Section */}
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

                {/* No Results Message */}
                {filteredTokens.length === 0 && !customToken && !error && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No tokens found with balance
                  </div>
                )}
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 