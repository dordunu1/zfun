import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';
import TokenSelectionModal from './TokenSelectionModal';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
import { ERC20_ABI } from '../../services/erc20';
import { BiWallet } from 'react-icons/bi';
import { getTokenDeploymentByAddress } from '../../services/firebase';

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
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
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
  const [priceInfo, setPriceInfo] = useState(null);

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
      // Try to get token info from Firebase first
      const tokenDeployment = await getTokenDeploymentByAddress(token.address);
      if (tokenDeployment) {
        setToken0({
          ...token,
          name: tokenDeployment.name,
          symbol: tokenDeployment.symbol,
          decimals: tokenDeployment.decimals || 18,
          logo: tokenDeployment.logo,
          logoIpfs: tokenDeployment.logoIpfs
        });
      } else {
        // Fallback to contract info
        const tokenInfo = await uniswap.getTokenInfo(token.address);
        setToken0({ 
          ...token,
          ...tokenInfo,
          name: token.name || tokenInfo.name,
          symbol: token.symbol || tokenInfo.symbol
        });
      }
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
      // Try to get token info from Firebase first
      const tokenDeployment = await getTokenDeploymentByAddress(token.address);
      if (tokenDeployment) {
        setToken1({
          ...token,
          name: tokenDeployment.name,
          symbol: tokenDeployment.symbol,
          decimals: tokenDeployment.decimals || 18,
          logo: tokenDeployment.logo,
          logoIpfs: tokenDeployment.logoIpfs
        });
      } else {
        // Fallback to contract info
        const tokenInfo = await uniswap.getTokenInfo(token.address);
        setToken1({ 
          ...token,
          ...tokenInfo,
          name: token.name || tokenInfo.name,
          symbol: token.symbol || tokenInfo.symbol
        });
      }
    }
    setShowToken1Modal(false);
  };

  // Handle amount changes
  const handleAmount0Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount0(value);
    }
  };

  const handleAmount1Change = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount1(value);
    }
  };

  // Modify handleCreatePool
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

      // Create pool and add liquidity
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
          : error.message.includes('approve')
          ? error.message
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

  // Add useEffect to calculate and update price info
  useEffect(() => {
    async function updatePriceInfo() {
      if (!token0 || !token1 || !amount0 || !amount1) {
        setPriceInfo(null);
        return;
      }

      try {
        const parsedAmount0 = ethers.parseUnits(amount0, token0.decimals);
        const parsedAmount1 = ethers.parseUnits(amount1, token1.decimals);

        const prices = uniswap.calculateInitialPoolPrice(
          parsedAmount0,
          parsedAmount1,
          token0.decimals,
          token1.decimals
        );

        setPriceInfo({
          token0Price: prices.token0Price,
          token1Price: prices.token1Price
        });
      } catch (error) {
        console.error('Error calculating price:', error);
        setPriceInfo(null);
      }
    }

    updatePriceInfo();
  }, [token0, token1, amount0, amount1]);

  // Add TokenBalance component
  const TokenBalance = ({ token }) => {
    const [balance, setBalance] = useState('0');
    const { address } = useAccount();

    useEffect(() => {
      async function getBalance() {
        if (!token || !address) return;

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const rawBalance = await tokenContract.balanceOf(address);
          const formattedBalance = ethers.formatUnits(rawBalance, token.decimals);
          setBalance(formattedBalance);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance('0');
        }
      }

      getBalance();
    }, [token, address]);

    if (!token) return null;

    return (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Balance: {Number(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })}
      </span>
    );
  };

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

            {/* Price Information */}
            {priceInfo && token0 && token1 && (
              <div className="mt-6 p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Initial Pool Price
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      1 {token0.symbol} =
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Number(priceInfo.token0Price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token1.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      1 {token1.symbol} =
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {Number(priceInfo.token1Price).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token0.symbol}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                The ratio of tokens you add will set the initial price. Make sure to add sufficient liquidity to minimize price impact from trades.
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