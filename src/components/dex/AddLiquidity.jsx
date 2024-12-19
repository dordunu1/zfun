import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { toast } from 'react-hot-toast';
import TokenSelectionModal from './TokenSelectionModal';
import PoolSelectionModal from './PoolSelectionModal';
import { ethers } from 'ethers';
import { useUniswap } from '../../hooks/useUniswap';
import { UNISWAP_ADDRESSES } from '../../services/uniswap';
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

const getTokenLogo = (token) => {
  // Check if it's a common token
  const commonToken = COMMON_TOKENS.find(t => t.address?.toLowerCase() === token?.address?.toLowerCase());
  if (commonToken) {
    return commonToken.logo;
  }

  // Check for IPFS or direct logo from token data
  if (token?.logo || token?.logoIpfs) {
    return token.logo || ipfsToHttp(token.logoIpfs);
  }

  // Default token logo
  return '/token-default.png';
};

// Add balance display component
const TokenBalance = ({ token }) => {
  const { address } = useAccount();
  const [contractError, setContractError] = React.useState(null);

  // Add contract verification
  React.useEffect(() => {
    const verifyContract = async () => {
      if (token.symbol === 'USDC') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(token.address, [
            'function balanceOf(address) view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)'
          ], provider);

          // Test contract calls
          const [decimals, symbol] = await Promise.all([
            contract.decimals(),
            contract.symbol()
          ]);

          console.log('USDC Contract Verification:', {
            address: token.address,
            decimals,
            symbol,
            isValid: decimals === 6 && symbol === 'USDC'
          });
        } catch (error) {
          console.error('USDC Contract Verification Error:', error);
          setContractError(error.message);
        }
      }
    };

    verifyContract();
  }, [token]);

  const { data: balance, isError, isLoading } = useBalance({
    address: address,
    token: token.address === 'ETH' ? undefined : token.address,
    watch: true,
    onError: (error) => {
      console.error('Error fetching balance:', error, {
        token: token.address,
        userAddress: address,
        tokenSymbol: token.symbol,
        tokenDecimals: token.decimals
      });
    },
    onSuccess: (data) => {
      console.log('Balance fetched successfully:', {
        token: token.address,
        symbol: token.symbol,
        balance: data.formatted,
        decimals: data.decimals,
        value: data.value.toString(),
        rawValue: data.value
      });
    }
  });

  // Add useEffect for debugging USDC specifically
  React.useEffect(() => {
    if (token.symbol === 'USDC') {
      console.log('USDC Token Details:', {
        address: token.address,
        decimals: token.decimals,
        userAddress: address,
        hasBalance: !!balance,
        balanceValue: balance?.value?.toString(),
        formattedBalance: balance?.formatted,
        contractError: contractError
      });

      // Try direct contract call for balance
      const getBalanceDirectly = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(token.address, [
            'function balanceOf(address) view returns (uint256)'
          ], provider);
          
          const rawBalance = await contract.balanceOf(address);
          console.log('USDC Direct Balance Check:', {
            rawBalance: rawBalance.toString(),
            formatted: ethers.formatUnits(rawBalance, 6)
          });
        } catch (error) {
          console.error('Direct USDC balance check failed:', error);
        }
      };
      
      getBalanceDirectly();
    }
  }, [token, balance, address, contractError]);

  if (contractError) {
    return (
      <div className="text-sm text-red-500 mt-1">
        Contract Error: {contractError}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Loading balance...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500 mt-1">
        Error loading balance
      </div>
    );
  }

  const formattedBalance = balance ? 
    Number(ethers.formatUnits(balance.value, balance.decimals))
      .toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6 
      })
    : '0';

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Balance: {formattedBalance} {token.symbol}
    </div>
  );
};

export default function AddLiquidity() {
  const { address } = useAccount();
  const uniswap = useUniswap();
  const [pool, setPool] = useState(null);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPoolModal, setShowPoolModal] = useState(false);

  // Add new useEffect for automatic amount calculation
  React.useEffect(() => {
    const calculateOtherAmount = async () => {
      if (!pool || (!token0Amount && !token1Amount)) return;

      try {
        const poolInfo = await uniswap.getPoolInfo(pool.token0.address, pool.token1.address);
        if (!poolInfo || !poolInfo.reserve0 || !poolInfo.reserve1) return;

        if (token0Amount && !token1Amount) {
          const amount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
          const amount1 = (amount0 * poolInfo.reserve1) / poolInfo.reserve0;
          setToken1Amount(ethers.formatUnits(amount1, pool.token1.decimals));
        } else if (token1Amount && !token0Amount) {
          const amount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);
          const amount0 = (amount1 * poolInfo.reserve0) / poolInfo.reserve1;
          setToken0Amount(ethers.formatUnits(amount0, pool.token0.decimals));
        }
      } catch (error) {
        console.error('Error calculating amounts:', error);
      }
    };

    calculateOtherAmount();
  }, [pool, token0Amount, token1Amount, uniswap]);

  const handleAddLiquidity = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!pool || !token0Amount || !token1Amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Parse amounts with proper decimals
      const parsedAmount0 = ethers.parseUnits(token0Amount, pool.token0.decimals);
      const parsedAmount1 = ethers.parseUnits(token1Amount, pool.token1.decimals);

      // First ensure approvals are completed
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const token0Contract = new ethers.Contract(pool.token0.address, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ], signer);
      
      const token1Contract = new ethers.Contract(pool.token1.address, [
        'function allowance(address,address) view returns (uint256)',
        'function approve(address,uint256) returns (bool)'
      ], signer);

      // Check allowances
      const allowance0 = await token0Contract.allowance(address, uniswap.router.address);
      const allowance1 = await token1Contract.allowance(address, uniswap.router.address);

      // Handle token0 approval first if needed
      if (allowance0 < parsedAmount0) {
        try {
          toast.loading('Approving ' + pool.token0.symbol + '...', { id: 'approve0' });
          const approve0Tx = await token0Contract.approve(uniswap.router.address, ethers.MaxUint256);
          await approve0Tx.wait();
          toast.success(pool.token0.symbol + ' approved successfully', { id: 'approve0' });
        } catch (error) {
          toast.error('Failed to approve ' + pool.token0.symbol, { id: 'approve0' });
          setLoading(false);
          return; // Exit if approval fails
        }
      }

      // Handle token1 approval after token0 is approved
      if (allowance1 < parsedAmount1) {
        try {
          toast.loading('Approving ' + pool.token1.symbol + '...', { id: 'approve1' });
          const approve1Tx = await token1Contract.approve(uniswap.router.address, ethers.MaxUint256);
          await approve1Tx.wait();
          toast.success(pool.token1.symbol + ' approved successfully', { id: 'approve1' });
        } catch (error) {
          toast.error('Failed to approve ' + pool.token1.symbol, { id: 'approve1' });
          setLoading(false);
          return; // Exit if approval fails
        }
      }

      // Double-check allowances after approvals
      const finalAllowance0 = await token0Contract.allowance(address, uniswap.router.address);
      const finalAllowance1 = await token1Contract.allowance(address, uniswap.router.address);

      if (finalAllowance0 < parsedAmount0 || finalAllowance1 < parsedAmount1) {
        toast.error('Approval process incomplete. Please try again.');
        setLoading(false);
        return;
      }

      // Wait a moment after approvals are confirmed
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate minimum amounts (1% slippage tolerance)
      const amount0Min = parsedAmount0 * 99n / 100n;
      const amount1Min = parsedAmount1 * 99n / 100n;

      toast.loading('Adding liquidity...', { id: 'add-liquidity' });

      // Add liquidity only after approvals are confirmed
      const receipt = await uniswap.addLiquidity(
        pool.token0.address,
        pool.token1.address,
        parsedAmount0,
        parsedAmount1,
        amount0Min,
        amount1Min,
        address
      );

      console.log('Liquidity added:', receipt);
      toast.success('Liquidity added successfully!', { id: 'add-liquidity' });
      
      // Reset form
      setToken0Amount('');
      setToken1Amount('');
      setPool(null);
    } catch (error) {
      console.error('Add liquidity error:', error);
      toast.error(
        error.message.includes('insufficient')
          ? 'Insufficient balance for transaction'
          : error.message.includes('chain')
          ? 'Please switch to a supported network'
          : `Failed to add liquidity: ${error.message}`,
        { id: 'add-liquidity' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePoolSelect = (selectedPool) => {
    setPool({
      ...selectedPool,
      token0: {
        ...selectedPool.token0,
        name: selectedPool.token0.name || selectedPool.token0.symbol,
        symbol: selectedPool.token0.symbol,
        logo: selectedPool.token0.logo || selectedPool.token0.logoIpfs,
      },
      token1: {
        ...selectedPool.token1,
        name: selectedPool.token1.name || selectedPool.token1.symbol,
        symbol: selectedPool.token1.symbol,
        logo: selectedPool.token1.logo || selectedPool.token1.logoIpfs,
      }
    });
    setShowPoolModal(false);
  };

  return (
    <>
      <div className="space-y-6 max-w-lg mx-auto">
        {/* Card Container */}
        <div className="bg-white/5 dark:bg-[#1a1b1f] backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          {/* Pool Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Select Pool
            </label>
            <div className="relative">
              <button
                onClick={() => setShowPoolModal(true)}
                className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl text-left text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-[#2d2f36]/80 transition-colors"
              >
                {pool ? (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <img
                        src={getTokenLogo(pool.token0)}
                        alt={pool.token0.symbol}
                        className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                      <img
                        src={getTokenLogo(pool.token1)}
                        alt={pool.token1.symbol}
                        className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-[#1a1b1f]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/token-default.png';
                        }}
                      />
                    </div>
                    <span>
                      {pool.token0.symbol}/{pool.token1.symbol}
                    </span>
                  </div>
                ) : (
                  'Select Pool'
                )}
              </button>
            </div>
          </div>

          {pool && (
            <>
              {/* Token 0 Amount */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {pool.token0.symbol} Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token0Amount}
                    onChange={(e) => setToken0Amount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#00ffbd] hover:bg-[#00ffbd]/10 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <TokenBalance token={pool.token0} />
              </div>

              {/* Token 1 Amount */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {pool.token1.symbol} Amount
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={token1Amount}
                    onChange={(e) => setToken1Amount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-3 bg-white/10 dark:bg-[#2d2f36] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-[#00ffbd] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-[#00ffbd] hover:bg-[#00ffbd]/10 rounded-lg transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <TokenBalance token={pool.token1} />
              </div>

              {/* Pool Stats */}
              <div className="mt-6 p-4 bg-white/5 dark:bg-[#2d2f36] rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Pool Share</span>
                    <span className="text-gray-900 dark:text-gray-100">--</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                    <span className="text-gray-900 dark:text-gray-100">--</span>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  About Adding Liquidity
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  By adding liquidity you'll earn fees from trades in this pool.
                  The ratio of tokens you add will determine the price impact on the pool.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Add Liquidity Button */}
        <button
          onClick={handleAddLiquidity}
          disabled={loading || !pool || !token0Amount || !token1Amount}
          className={`
            w-full px-4 py-4 rounded-xl font-medium text-black text-lg
            ${loading || !pool || !token0Amount || !token1Amount
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] transition-colors'
            }
          `}
        >
          {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
        </button>
      </div>

      {/* Pool Selection Modal */}
      <PoolSelectionModal
        isOpen={showPoolModal}
        onClose={() => setShowPoolModal(false)}
        onSelect={handlePoolSelect}
      />
    </>
  );
} 