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
    address: '0x31d0220469e10c4E71834a79b1f276d740d3768F',
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
        const provider = new ethers.BrowserProvider(window.ethereum);
        let rawBalance, decimals;

        if (token.address === 'ETH') {
          // Get ETH balance
          rawBalance = await provider.getBalance(userAddress);
          decimals = 18;
        } else {
          // Create contract instance
          const contract = new ethers.Contract(
            token.address,
            [
              'function balanceOf(address) view returns (uint256)',
              'function decimals() view returns (uint8)'
            ],
            provider
          );

          try {
            // Get both balance and decimals in parallel
            [rawBalance, decimals] = await Promise.all([
              contract.balanceOf(userAddress),
              contract.decimals().catch(() => token.decimals || 18)
            ]);
          } catch (error) {
            console.error(`Contract call failed for ${token.symbol}:`, error);
            // Fallback to direct RPC calls if contract calls fail
            const balanceData = ethers.AbiCoder.defaultAbiCoder().encode(
              ['address'],
              [userAddress]
            ).slice(2);

            const balanceHex = await provider.call({
              to: token.address,
              data: '0x70a08231' + balanceData // balanceOf(address)
            });

            rawBalance = ethers.getBigInt(balanceHex);
            decimals = token.decimals || 18;
          }
        }

        // Format the balance with proper decimals
        const formatted = Number(ethers.formatUnits(rawBalance, decimals));
        const displayBalance = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6,
          useGrouping: true
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

const scanForTokens = async (provider, userAddress) => {
  try {
    // Create a list of known token addresses to scan
    const knownTokens = [
      '0x31d0220469e10c4E71834a79b1f276d740d3768F', // USDC
      UNISWAP_ADDRESSES.WETH,
      UNISWAP_ADDRESSES.USDT,
      // Add any other known token addresses here
    ];

    // Fetch tokens from Blockscout API
    const apiTokens = await fetch(`https://unichain-sepolia.blockscout.com/api/v2/addresses/${userAddress}/token-balances`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(async (tokens) => {
        // Filter out non-ERC20 tokens, LP tokens, and map to our format
        const erc20Tokens = tokens
          .filter(item => {
            // Check if it's an ERC-20 token and has required fields
            const isERC20 = item.token?.type === 'ERC-20' && item.value && item.token.address;
            
            // Check if it's not a LP token (exclude UNI-V2 tokens)
            const isNotLPToken = item.token?.symbol !== 'UNI-V2' && 
                               !item.token?.name?.includes('Uniswap V2') &&
                               !item.token?.symbol?.includes('UNI-V2') &&
                               !item.token?.symbol?.includes('LP');
            
            return isERC20 && isNotLPToken;
          })
          .map(item => ({
            address: item.token.address,
            symbol: item.token.symbol || 'Unknown',
            name: item.token.name || 'Unknown Token',
            decimals: parseInt(item.token.decimals || '18'),
            balance: item.value,
            verified: true,
            totalSupply: item.token.total_supply,
            holders: item.token.holders
          }));

        console.log('Blockscout API tokens (excluding LP tokens):', erc20Tokens);
        return erc20Tokens;
      })
      .catch(error => {
        console.error('Error fetching tokens from Blockscout API:', error);
        return [];
      });

    // Also scan known tokens in case they're not in the API response
    const contractScannedTokens = await Promise.all(
      knownTokens
        .filter(addr => !apiTokens.some(t => t.address?.toLowerCase() === addr.toLowerCase()))
        .map(async (tokenAddress) => {
          try {
            const contract = new ethers.Contract(
              tokenAddress,
              [
                'function balanceOf(address) view returns (uint256)',
                'function symbol() view returns (string)',
                'function name() view returns (string)',
                'function decimals() view returns (uint8)',
                'function totalSupply() view returns (uint256)'
              ],
              provider
            );

            const [balance, symbol, name, decimals, totalSupply] = await Promise.all([
              contract.balanceOf(userAddress),
              contract.symbol().catch(() => 'Unknown'),
              contract.name().catch(() => 'Unknown Token'),
              contract.decimals().catch(() => 18),
              contract.totalSupply().catch(() => '0')
            ]);

            // Only include tokens with non-zero balance and exclude LP tokens
            const isNotLPToken = 
              symbol !== 'UNI-V2' && 
              !name?.includes('Uniswap V2') &&
              !symbol?.includes('UNI-V2') &&
              !symbol?.includes('LP');

            if (balance > 0n && isNotLPToken) {
              return {
                address: tokenAddress,
                symbol,
                name,
                decimals,
                balance: balance.toString(),
                totalSupply: totalSupply.toString(),
                verified: true
              };
            }
            return null;
          } catch (error) {
            console.error(`Error scanning token ${tokenAddress}:`, error);
            return null;
          }
        })
    );

    // Combine both sources of tokens and remove duplicates
    const allTokens = [...apiTokens, ...contractScannedTokens.filter(t => t !== null)];
    
    // Log the tokens found for debugging
    console.log('API Tokens found:', apiTokens);
    console.log('Contract scanned tokens found:', contractScannedTokens);
    
    const uniqueTokens = Array.from(
      new Map(allTokens.map(token => [token.address?.toLowerCase(), token]))
        .values()
    ).filter(token => token && token.address);

    console.log('Final unique tokens:', uniqueTokens);
    
    return uniqueTokens;
  } catch (error) {
    console.error('Error scanning for tokens:', error);
    return [];
  }
};

const getWalletTokens = async (provider, userAddress) => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    
    // Get tokens from wallet and from scanning
    const [walletTokens, scannedTokens] = await Promise.all([
      provider.request({
        method: 'wallet_getPermissions'
      }).then(permissions => {
        const tokenPermission = permissions.find(p => p.parentCapability === 'eth_accounts');
        return tokenPermission?.caveats?.[0]?.value || [];
      }).catch(() => []),
      scanForTokens(ethersProvider, userAddress)
    ]);

    // Combine and format tokens
    const formattedWalletTokens = (walletTokens || [])
      .filter(token => token && typeof token === 'object')
      .map(token => ({
        address: token.address || '',
        symbol: token.symbol || 'Unknown',
        name: token.name || 'Unknown Token',
        decimals: token.decimals || 18,
        logo: token.logo || '/token-default.png',
        verified: true
      }));

    // Combine tokens and remove duplicates
    const allTokens = [...formattedWalletTokens, ...scannedTokens];
    const uniqueTokens = Array.from(new Map(
      allTokens.map(token => [token.address.toLowerCase(), token])
    ).values());

    return uniqueTokens.filter(token => token && token.address);
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