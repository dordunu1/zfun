import React, { useEffect, useState } from 'react';
import { BiRocket, BiShield, BiCoin, BiPalette, BiLineChart, BiCog, BiStore, BiTransfer, BiWater, BiCollection } from 'react-icons/bi';
import { useDeployments } from '../context/DeploymentsContext';
import { formatDistanceToNow } from 'date-fns';
import { getExplorerUrl } from '../utils/explorer';
import { ipfsToHttp } from '../utils/ipfs';
import { Link } from 'react-router-dom';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { useUniswap } from '../hooks/useUniswap';

// Animated Cat Component
const AnimatedCat = ({ onAnimationComplete }) => {
  const [position, setPosition] = useState(-100);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPosition(75);
      setTimeout(() => {
        setIsDone(true);
        onAnimationComplete();
      }, 1000);
    }, 500);
  }, []);

  return (
    <div 
      className={`absolute ${isDone ? 'top-4' : '-top-4'} transition-all duration-1000 ease-out`}
      style={{ 
        left: `${position}%`,
        transform: 'translate(-50%, 0)',
      }}
    >
      <div className="relative w-40 h-40">
        {/* Main Body */}
        <div className={`absolute w-40 h-24 bg-[#00ffbd]/20 rounded-[100px] animate-[float_3s_ease-in-out_infinite]`} style={{top: '40%'}}>
          {/* Head */}
          <div className="absolute w-28 h-24 bg-[#00ffbd]/20 rounded-[50%] -left-4 -top-10">
            {/* Inner Ears */}
            <div className="absolute -top-7 left-5 w-5 h-7 bg-[#00ffbd]/30 rounded-tl-[120%] rounded-tr-[120%] -rotate-[15deg] transform origin-bottom" />
            <div className="absolute -top-7 right-5 w-5 h-7 bg-[#00ffbd]/30 rounded-tl-[120%] rounded-tr-[120%] rotate-[15deg] transform origin-bottom" />
            {/* Outer Ears */}
            <div className="absolute -top-8 left-4 w-7 h-9 bg-[#00ffbd]/20 rounded-tl-[120%] rounded-tr-[120%] -rotate-[15deg] animate-[earTwitch_5s_ease-in-out_infinite]" />
            <div className="absolute -top-8 right-4 w-7 h-9 bg-[#00ffbd]/20 rounded-tl-[120%] rounded-tr-[120%] rotate-[15deg] animate-[earTwitch_5s_ease-in-out_infinite_0.5s]" />
            {/* Eyes */}
            <div className="absolute top-7 left-5 w-5 h-[16px] overflow-hidden">
              <div className="w-5 h-5 bg-[#00ffbd] rounded-full animate-[blink_4s_ease-in-out_infinite]" />
            </div>
            <div className="absolute top-7 right-5 w-5 h-[16px] overflow-hidden">
              <div className="w-5 h-5 bg-[#00ffbd] rounded-full animate-[blink_4s_ease-in-out_infinite]" />
            </div>
            {/* Nose */}
            <div className="absolute top-11 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-[#00ffbd] rounded-[40%]" />
            {/* Whiskers */}
            <div className="absolute top-11 left-2 w-8 h-0.5 bg-[#00ffbd]/60 rotate-[15deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
            <div className="absolute top-13 left-2 w-8 h-0.5 bg-[#00ffbd]/60 rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
            <div className="absolute top-15 left-2 w-8 h-0.5 bg-[#00ffbd]/60 -rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
            <div className="absolute top-11 right-2 w-8 h-0.5 bg-[#00ffbd]/60 -rotate-[15deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
            <div className="absolute top-13 right-2 w-8 h-0.5 bg-[#00ffbd]/60 -rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
            <div className="absolute top-15 right-2 w-8 h-0.5 bg-[#00ffbd]/60 rotate-[5deg] animate-[whiskerMove_4s_ease-in-out_infinite]" />
          </div>
          {/* Front Legs */}
          <div className="absolute bottom-0 left-5 w-5 h-10 bg-[#00ffbd]/20 rounded-b-[50%] animate-[legSwing_2s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 left-14 w-5 h-10 bg-[#00ffbd]/20 rounded-b-[50%] animate-[legSwing_2s_ease-in-out_infinite_0.5s]" />
          {/* Back Legs */}
          <div className="absolute bottom-0 right-14 w-5 h-12 bg-[#00ffbd]/20 rounded-b-[50%] animate-[legSwing_2s_ease-in-out_infinite_1s]" />
          <div className="absolute bottom-0 right-5 w-5 h-12 bg-[#00ffbd]/20 rounded-b-[50%] animate-[legSwing_2s_ease-in-out_infinite_1.5s]" />
          {/* Tail */}
          <div className="absolute -right-10 top-1/3 w-14 h-3.5 bg-[#00ffbd]/20 rounded-full origin-left animate-[tailWag_3s_ease-in-out_infinite]" 
               style={{
                 borderRadius: '4px 14px 14px 4px',
                 transform: 'rotate(-5deg)'
               }}
          />
        </div>
      </div>
    </div>
  );
};

// Add keyframes for the animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-8px) rotate(2deg); }
  }
  @keyframes blink {
    0%, 95%, 100% { transform: scaleY(1); }
    97.5% { transform: scaleY(0.1); }
  }
  @keyframes tailWag {
    0%, 100% { transform: rotate(-5deg); }
    25% { transform: rotate(15deg); }
    75% { transform: rotate(-25deg); }
  }
  @keyframes legSwing {
    0%, 100% { transform: rotate(-2deg) scaleY(1); }
    50% { transform: rotate(8deg) scaleY(0.95); }
  }
  @keyframes whiskerMove {
    0%, 100% { transform: rotate(var(--rotate, 0deg)); }
    50% { transform: rotate(calc(var(--rotate, 0deg) + 3deg)); }
  }
  @keyframes earTwitch {
    0%, 90%, 100% { transform: rotate(var(--rotate, 0deg)); }
    95% { transform: rotate(calc(var(--rotate, 0deg) + 3deg)); }
  }
`;
document.head.appendChild(style);

export default function Dashboard() {
  const { deployments } = useDeployments();
  const { prices } = useTokenPrices();
  const uniswap = useUniswap();
  const [poolStats, setPoolStats] = useState({
    volume24h: 369,
    liquidity: 639,
    holders: 420,
  });
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const loadPoolStats = async () => {
      if (!uniswap) return;
      
      try {
        setLoading(true);
        
        // Get all pools
        const pools = await uniswap.getAllPools();
        
        // Calculate total liquidity and volume
        let totalLiquidity = 0;
        let totalVolume24h = 0;
        let uniqueHolders = new Set();

        for (const poolAddress of pools) {
          const poolInfo = await uniswap.getPoolInfoByAddress(poolAddress);
          if (!poolInfo) continue;

          // Calculate liquidity in USD
          const reserve0USD = poolInfo.reserves?.reserve0 && prices.ETH
            ? Number(ethers.formatUnits(poolInfo.reserves.reserve0, poolInfo.token0.decimals)) * prices.ETH
            : 0;
          const reserve1USD = poolInfo.reserves?.reserve1 && prices.ETH
            ? Number(ethers.formatUnits(poolInfo.reserves.reserve1, poolInfo.token1.decimals)) * prices.ETH
            : 0;

          totalLiquidity += reserve0USD + reserve1USD;

          // Get 24h volume
          const volume = await uniswap.getPoolVolume(poolAddress, '24h');
          if (volume) {
            totalVolume24h += volume * prices.ETH;
          }

          // Add holders to set
          const holders = await uniswap.getPoolHolders(poolAddress);
          holders.forEach(holder => uniqueHolders.add(holder));
        }

        setPoolStats({
          volume24h: totalVolume24h,
          liquidity: totalLiquidity,
          holders: uniqueHolders.size
        });
      } catch (error) {
        console.error('Error loading pool stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uniswap && prices.ETH) {
      loadPoolStats();
    }
  }, [uniswap, prices.ETH]);

  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const features = [
    {
      icon: BiShield,
      title: "Security First",
      description: "Built with battle-tested OpenZeppelin and Uniswap V2 contracts.",
      gradient: "from-[#00ffbd] to-[#00e6a9]"
    },
    {
      icon: BiCoin,
      title: "Token Types",
      description: "Create immutable ERC20 tokens with fixed supply for enhanced security and trust.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: BiRocket,
      title: "Launch in Minutes",
      description: "Create your own ERC20 tokens with just a few clicks. No coding required.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: BiCog,
      title: "Full Control",
      description: "Transfer tokens, manage allowances, and track balances with standard ERC20 features.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: BiWater,
      title: "Liquidity Tools",
      description: "Easily add liquidity and create trading pairs on DEXes.",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      icon: BiPalette,
      title: "NFT Collections",
      description: "Launch your NFT collection with customizable traits and rarity.",
      gradient: "from-green-500 to-green-600"
    }
  ];

  function TokenCard({ deployment }) {
    const isNFT = deployment.type === 'nft';
    const collectionUrl = `/collection/${deployment.symbol}`;

    const getExplorerUrl = (chainName, address) => {
      switch (chainName.toLowerCase()) {
        case 'sepolia':
          return `https://sepolia.etherscan.io/token/${address}`;
        case 'polygon':
          return `https://polygonscan.com/token/${address}`;
        case 'unichain':
          return `https://unichain-sepolia.blockscout.com/token/${address}`;
        default:
          return '#';
      }
    };

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-center gap-3">
          {deployment.artworkType === 'video' ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800">
              <video 
                src={deployment.logo || ipfsToHttp(deployment.logoIpfs)}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          ) : (
            <img 
              src={deployment.logo || ipfsToHttp(deployment.logoIpfs)} 
              alt={deployment.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/token-default.png';
              }}
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {deployment.name} ({deployment.symbol})
              </span>
              {isNFT ? (
                <BiCollection 
                  className="text-[#00ffbd]" 
                  size={16} 
                  title="NFT Collection"
                />
              ) : (
                <BiShield 
                  className="text-[#00ffbd]" 
                  size={16} 
                  title="Non-Mintable Token"
                />
              )}
            </div>
            <div className="text-xs text-gray-500">
              on {deployment.chainName}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(deployment.timestamp, { addSuffix: true })}
          </div>
          {isNFT ? (
            <Link 
              to={collectionUrl}
              className="text-xs text-[#00ffbd] hover:text-[#00e6a9] transition-colors group relative"
            >
              Supply: {Number(deployment.totalSupply).toLocaleString()}
              <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                View Collection
              </span>
            </Link>
          ) : (
            <a 
              href={getExplorerUrl(deployment.chainName, deployment.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#00ffbd] hover:text-[#00e6a9] transition-colors"
            >
              Supply: {Number(deployment.totalSupply).toLocaleString()}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="mt-16 p-8">
      <div className="text-center mb-12 relative h-32">
        <div 
          className={`transition-all duration-1000 ${showWelcome ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-10'}`}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to Token Factory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Launch your own tokens and NFTs on Unichain and other EVM chains (coming soon). 
            Create, trade, and manage your crypto assets with our powerful platform.
          </p>
        </div>
        <AnimatedCat onAnimationComplete={() => setShowWelcome(true)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="relative group overflow-hidden rounded-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="relative p-6 bg-white dark:bg-[#1a1b1f] rounded-2xl border border-gray-200 dark:border-gray-800 group-hover:border-transparent transition-colors duration-300">
              <feature.icon className="w-12 h-12 mb-4 text-[#00ffbd]" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Ecosystem Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BiWater className="w-8 h-8 text-[#00ffbd]" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Liquidity & Trade
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              List your token on popular DEXes and create trading pairs
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://token-factory.xyz/trading" target="_blank" rel="noopener noreferrer" 
                 className="text-[#00ffbd] bg-[#00ffbd]/10 px-3 py-1 rounded-full text-sm hover:bg-[#00ffbd]/20 transition-colors">
                Token Factory Swap
              </a>
              <a href="https://app.uniswap.org/#/pools" target="_blank" rel="noopener noreferrer"
                 className="text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20 px-3 py-1 rounded-full text-sm hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors">
                Uniswap
              </a>
              <span className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                More coming soon
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BiStore className="w-8 h-8 text-[#00ffbd]" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                NFT Marketplaces
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              List your NFTs on popular marketplaces instantly
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                OpenSea
              </a>
              <a href="https://market.wilderworld.com/" target="_blank" rel="noopener noreferrer"
                 className="text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 px-3 py-1 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors">
                WWMarket
              </a>
              <a href="https://rarible.com/" target="_blank" rel="noopener noreferrer"
                 className="text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors">
                Rarible
              </a>
              <span className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
                More coming soon
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BiTransfer className="w-8 h-8 text-[#00ffbd]" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Deployments
              </h3>
            </div>
            <div className="space-y-3">
              {deployments.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tokens deployed yet
                </p>
              ) : (
                <div className="space-y-2">
                  {deployments.slice(0, 5).map((deployment) => (
                    <TokenCard key={deployment.timestamp} deployment={deployment} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <BiLineChart className="w-8 h-8 text-[#00ffbd]" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Token Analytics
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your token's performance and trading activity
            </p>
            
            <div className="mt-4 h-[200px] bg-gray-50 dark:bg-[#1a1b1f] rounded-lg p-4 relative overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ZFUN/POL</span>
                  <span className="text-xs text-[#00ffbd]">+2.45%</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3d3f46]">1H</button>
                  <button className="px-2 py-1 text-xs rounded bg-[#00ffbd] text-black">24H</button>
                  <button className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-[#2d2f36] text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3d3f46]">7D</button>
                </div>
              </div>
              
              <div className="relative h-[120px]">
                <div className="absolute inset-0">
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#00ffbd" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#00ffbd" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,100 C50,80 100,120 150,60 C200,0 250,40 300,20 L300,150 L0,150 Z" 
                      fill="url(#gradient)"
                      className="transition-all duration-300"
                    />
                    <path 
                      d="M0,100 C50,80 100,120 150,60 C200,0 250,40 300,20" 
                      fill="none"
                      stroke="#00ffbd"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
                
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 py-2">
                  <span>$1.24</span>
                  <span>$1.12</span>
                  <span>$1.00</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Volume 24h</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {loading ? 'Loading...' : formatUSD(poolStats.volume24h)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Liquidity</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {loading ? 'Loading...' : formatUSD(poolStats.liquidity)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Holders</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  {loading ? 'Loading...' : poolStats.holders.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 