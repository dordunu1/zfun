import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useBalance, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { UNISWAP_ADDRESSES } from '../../../services/unichain/uniswap.js';
import { useUnichain } from '../../../hooks/useUnichain';
import { FaSearch } from 'react-icons/fa';
import { getTokenDeploymentByAddress, getAllTokenDeployments } from '../../../services/firebase';
import { ipfsToHttp } from '../../../utils/ipfs';

// Add RPC URL constant at the top
const UNICHAIN_RPC_URL = 'https://sepolia.unichain.org';

// Add chain ID constant at the top
const UNICHAIN_CHAIN_ID = 1301; // Unichain Sepolia chain ID

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
    address: UNISWAP_ADDRESSES.USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: '/usdc.png'
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
  const [balance, setBalance] = useState('0');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!userAddress || !token || !window.ethereum) return;

      try {
        setIsLoadingBalance(true);
        // Use the connected wallet provider
        const provider = window.ethereum;
        let rawBalance, decimals;

        if (token.address === 'ETH') {
          // Get ETH balance
          rawBalance = await provider.request({
            method: 'eth_getBalance',
            params: [userAddress, 'latest']
          });
          decimals = 18;
        } else {
          try {
            // Get token balance using the wallet's provider
            const data = ethers.AbiCoder.defaultAbiCoder().encode(
              ['address'],
              [userAddress]
            ).slice(2);

            const balanceHex = await provider.request({
              method: 'eth_call',
              params: [{
                to: token.address,
                data: '0x70a08231' + data // balanceOf(address)
              }, 'latest']
            });

            rawBalance = balanceHex;
            decimals = token.decimals || 18;
          } catch (error) {
            console.log(`Balance check failed for token ${token.symbol}:`, error);
            // Don't return, let it show 0 balance
            rawBalance = '0x0';
            decimals = token.decimals || 18;
          }
        }

        // Convert the hex balance to a number
        const balance = ethers.getBigInt(rawBalance || '0x0');
        const formatted = Number(ethers.formatUnits(balance, decimals));
        const displayBalance = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6
        }).format(formatted);

        setBalance(displayBalance);
      } catch (error) {
        console.error(`Error fetching balance for ${token.symbol}:`, error);
        setBalance('0');
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [token, userAddress]);

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
        {balance}
      </div>
    </button>
  );
}

const getWalletTokens = async (provider, userAddress) => {
  try {
    // Get tokens directly from the wallet
    const tokens = await provider.request({
      method: 'eth_accounts'
    }).then(async (accounts) => {
      if (accounts.length === 0) return [];

      // Get token balances
      const tokenBalances = await provider.request({
        method: 'wallet_getPermissions'
      }).then(permissions => {
        const tokenPermission = permissions.find(p => p.parentCapability === 'eth_accounts');
        return tokenPermission?.caveats?.[0]?.value || [];
      });

      // Format tokens properly
      return (tokenBalances || [])
        .filter(token => token && typeof token === 'object')
        .map(token => ({
          address: token.address || '',
          symbol: token.symbol || 'Unknown',
          name: token.name || 'Unknown Token',
          decimals: token.decimals || 18,
          logo: token.logo || '/token-default.png',
          verified: true
        }));
    });

    return tokens.filter(token => token && token.address);
  } catch (error) {
    console.error('Error getting wallet tokens:', error);
    return [];
  }
};

export default function TokenSelectionModal({ isOpen, onClose, onSelect, selectedTokenAddress }) {
  const { address: userAddress } = useAccount();
  const unichain = useUnichain();
  const [searchQuery, setSearchQuery] = useState('');
  const [customToken, setCustomToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deployedTokens, setDeployedTokens] = useState([]);
  const [tokensWithBalance, setTokensWithBalance] = useState([]);
  const [currentChainId, setCurrentChainId] = useState(null);

  // Get current chain ID
  useEffect(() => {
    const getChainId = async () => {
      if (!window.ethereum) return;
      try {
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const decimalChainId = parseInt(hexChainId, 16);
        console.log('Chain ID from MetaMask:', { hexChainId, decimalChainId });
        console.log('Expected Chain ID:', UNICHAIN_CHAIN_ID);
        setCurrentChainId(decimalChainId);
      } catch (error) {
        console.error('Error getting chain ID:', error);
      }
    };
    getChainId();
  }, []);

  // Fetch all deployed tokens when modal opens
  useEffect(() => {
    const fetchDeployedTokens = async () => {
      if (!isOpen || !userAddress || !window.ethereum) return;
      
      try {
        setIsLoading(true);
        
        // Get current chain ID and convert to decimal
        const hexChainId = await window.ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(hexChainId, 16);
        console.log('Fetching tokens - Chain ID:', { hexChainId, chainId, expected: UNICHAIN_CHAIN_ID });
        
        // Only proceed if we're on Unichain Sepolia
        if (chainId !== UNICHAIN_CHAIN_ID) {
          console.log('Not on Unichain Sepolia:', { current: chainId, expected: UNICHAIN_CHAIN_ID });
          setError('Please switch to Unichain Sepolia network');
          setDeployedTokens([]);
          setTokensWithBalance(COMMON_TOKENS);
          return;
        }
        
        setError(''); // Clear any network error if we're on the right network
        
        // Get tokens from different sources
        const [deployedTokens, walletTokens] = await Promise.all([
          getAllTokenDeployments(),
          getWalletTokens(window.ethereum, userAddress)
        ]);
        
        console.log('Fetched deployed tokens:', deployedTokens);
        console.log('Fetched wallet tokens:', walletTokens);
        
        // Filter tokens by chain ID
        const chainTokens = deployedTokens.filter(token => {
          if (!token || typeof token !== 'object') return false;
          
          // Convert chain IDs to strings for comparison
          const tokenChainId = token.chainId?.toString() || '';
          const expectedChainId = UNICHAIN_CHAIN_ID.toString();
          
          const isValidToken = 
            tokenChainId === expectedChainId || 
            tokenChainId === '' || // Include tokens without chainId for backward compatibility
            !token.chainId; // Also include if chainId is undefined
          
          console.log('Token chain check:', {
            address: token.address || 'unknown',
            symbol: token.symbol || 'unknown',
            tokenChainId: token.chainId || 'none',
            expectedChainId: UNICHAIN_CHAIN_ID,
            isValid: isValidToken
          });
          
          return isValidToken;
        });
        
        console.log('Filtered chain tokens:', chainTokens);
        
        // Format deployed tokens - add null checks
        const formattedDeployedTokens = chainTokens
          .filter(token => token && token.address) // Filter out invalid tokens
          .map(token => ({
            address: token.address,
            symbol: token.symbol || 'Unknown',
            name: token.name || 'Unknown Token',
            decimals: token.decimals || 18,
            logo: token.logo || null,
            logoIpfs: token.logoIpfs || null,
            artworkType: token.artworkType || null,
            verified: true,
            chainId: token.chainId || UNICHAIN_CHAIN_ID
          }));

        // Add COMMON_TOKENS first to ensure they always appear
        const allTokens = [
          ...COMMON_TOKENS,
          ...formattedDeployedTokens.filter(token => 
            token && token.address && 
            !COMMON_TOKENS.some(common => 
              common.address?.toLowerCase() === token.address?.toLowerCase()
            )
          ),
          ...walletTokens.filter(token => 
            token && token.address && 
            !COMMON_TOKENS.some(common => 
              common.address?.toLowerCase() === token.address?.toLowerCase()
            )
          )
        ].filter(token => token && token.address);

        // Remove duplicates while preserving order
        const seenAddresses = new Set();
        const uniqueTokens = allTokens.filter(token => {
          if (!token || !token.address) return false;
          const address = token.address.toLowerCase();
          if (seenAddresses.has(address)) return false;
          seenAddresses.add(address);
          return true;
        }).map(token => ({
          ...token,
          symbol: token.symbol || 'Unknown',
          name: token.name || 'Unknown Token',
          decimals: token.decimals || 18,
          chainId: token.chainId || UNICHAIN_CHAIN_ID
        }));

        console.log('Final token list:', uniqueTokens);
        
        setDeployedTokens(uniqueTokens);
        setTokensWithBalance(uniqueTokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployedTokens();
  }, [isOpen, userAddress, refreshTrigger]);

  // Handle custom token search
  useEffect(() => {
    const searchCustomToken = async () => {
      // Only proceed if we're on Unichain Sepolia
      if (!currentChainId) return;
      
      console.log('Custom token search - Chain ID:', { current: currentChainId, expected: UNICHAIN_CHAIN_ID });
      
      if (currentChainId !== UNICHAIN_CHAIN_ID) {
        console.log('Wrong network for custom token search');
        setError('Please switch to Unichain Sepolia network');
        return;
      }

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

        // If not in Firebase, try direct contract call with Unichain provider
        const provider = new ethers.JsonRpcProvider(UNICHAIN_RPC_URL);
        const contract = new ethers.Contract(
          searchQuery,
          [
            'function symbol() view returns (string)',
            'function name() view returns (string)',
            'function decimals() view returns (uint8)'
          ],
          provider
        );

        let symbol, name, decimals;
        try {
          [symbol, name, decimals] = await Promise.all([
            contract.symbol(),
            contract.name(),
            contract.decimals()
          ]);
        } catch (error) {
          console.error('Error getting token info:', error);
          symbol = 'Unknown';
          name = 'Unknown Token';
          decimals = 18;
        }

        setCustomToken({
          address: searchQuery,
          symbol,
          name,
          decimals,
          verified: false
        });
        setError('');
      } catch (error) {
        console.error('Error searching for custom token:', error);
        setCustomToken(null);
        setError('Could not find token');
      } finally {
        setIsLoading(false);
      }
    };

    searchCustomToken();
  }, [searchQuery]);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!tokensWithBalance) return [];
    
    const searchLower = (searchQuery || '').toLowerCase();

    // Filter tokens based on search
    const filtered = tokensWithBalance.filter(token => {
      if (!token) return false;
      
      return (
        (token.symbol || '').toLowerCase().includes(searchLower) ||
        (token.name || '').toLowerCase().includes(searchLower) ||
        (token.address || '').toLowerCase().includes(searchLower)
      );
    });

    // Sort tokens: first by balance (descending), then by symbol
    return filtered.sort((a, b) => {
      // Get numeric balances (default to 0 if undefined)
      const balanceA = Number(a.balance || '0');
      const balanceB = Number(b.balance || '0');

      // Sort by balance first (descending)
      if (balanceB !== balanceA) {
        return balanceB - balanceA;
      }

      // If balances are equal, sort by symbol
      return (a.symbol || '').localeCompare(b.symbol || '');
    });
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
            symbol: token.symbol || tokenDeployment.symbol, // Preserve original symbol if exists
            name: token.name || tokenDeployment.name, // Preserve original name if exists
            decimals: token.decimals || tokenDeployment.decimals || 18,
            logo: token.logo || tokenDeployment.logo,
            logoIpfs: token.logoIpfs || tokenDeployment.logoIpfs,
            artworkType: token.artworkType || tokenDeployment.artworkType,
            verified: true
          };
        } else {
          // If not in Firebase, keep all original token information
          finalToken = {
            ...token,
            decimals: token.decimals || 18,
            verified: true
          };
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
              </>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 