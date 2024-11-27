import React, { useState, useEffect } from 'react';
import { FaEthereum, FaDiscord, FaTwitter, FaGlobe } from 'react-icons/fa';
import { BiMinus, BiPlus, BiCopy, BiCheck, BiX } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';

const TokenIcon = ({ type, size = "small" }) => {
  const sizeClasses = size === "large" ? "w-6 h-6" : "w-4 h-4";
  
  switch (type) {
    case 'native':
      return <FaEthereum className="text-gray-600 dark:text-gray-400" size={size === "large" ? 24 : 16} />;
    case 'usdc':
      return (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-full p-0.5">
          <img src="/usdc.png" alt="USDC" className={sizeClasses} />
        </div>
      );
    case 'usdt':
      return (
        <div className="bg-white dark:bg-[#1a1b1f] rounded-full p-0.5">
          <img src="/usdt.png" alt="USDT" className={sizeClasses} />
        </div>
      );
    default:
      return <FaEthereum className="text-gray-600 dark:text-gray-400" size={size === "large" ? 24 : 16} />;
  }
};

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (Object.keys(timeLeft).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="bg-[#0d0e12] rounded-lg p-2 border border-gray-800">
          <div className="text-xl font-bold text-[#00ffbd]">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 capitalize">{key}</div>
        </div>
      ))}
    </div>
  );
}

export default function CollectionPage() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [mintAmount, setMintAmount] = useState(1);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAddress, setCheckingAddress] = useState('');
  const [isEligible, setIsEligible] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem(`collection_${symbol}`);
    if (!storedData) {
      toast.error('Collection not found');
      navigate('/');
      return;
    }

    const collectionData = JSON.parse(storedData);
    setCollection(collectionData);
    setLoading(false);
  }, [symbol, navigate]);

  if (loading || !collection) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleMint = async () => {
    try {
      const newTotalMinted = (collection.totalMinted || 0) + mintAmount;
      const updatedCollection = {
        ...collection,
        totalMinted: newTotalMinted
      };
      
      localStorage.setItem(`collection_${symbol}`, JSON.stringify(updatedCollection));
      setCollection(updatedCollection);
      
      toast.success(`Minted ${mintAmount} NFTs!`);
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint');
    }
  };

  // Calculate remaining time until release
  const now = Date.now();
  const releaseDate = new Date(collection.releaseDate);
  const isLive = now >= releaseDate;
  
  // Calculate minting progress
  const progress = ((collection.totalMinted || 0) / collection.maxSupply) * 100;

  const checkEligibility = () => {
    if (!checkingAddress) {
      toast.error('Please enter an address');
      return;
    }

    const isWhitelisted = collection.whitelistAddresses?.some(
      addr => addr.address.toLowerCase() === checkingAddress.toLowerCase()
    );

    setIsEligible(isWhitelisted);
    if (isWhitelisted) {
      toast.success('Congratulations! You are eligible to mint');
    } else {
      toast.error('Sorry, this address is not whitelisted');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f]">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-br from-[#00ffbd]/5 to-[#00e6a9]/5 dark:from-[#00ffbd]/10 dark:to-[#00e6a9]/10">
        <img 
          src={collection.previewUrl} 
          alt={collection.name}
          className="w-full h-full object-cover opacity-20 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0a0b0f] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Info */}
          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-8 shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-6 mb-6">
              <img 
                src={collection.previewUrl} 
                alt={collection.name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-[#00ffbd]"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {collection.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span>{collection.symbol}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(collection.symbol);
                      toast.success('Symbol copied!');
                    }}
                    className="hover:text-[#00ffbd] transition-colors"
                  >
                    <BiCopy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {collection.description}
            </p>

            {/* Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {collection.properties?.map((prop, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                >
                  <p className="text-sm text-gray-500 mb-1">{prop.trait_type}</p>
                  <p className="text-lg font-medium text-[#00ffbd]">{prop.value}</p>
                </div>
              ))}
            </div>

            {/* Add Social Links */}
            <div className="flex gap-4 mt-6 mb-6">
              {collection.website && (
                <a 
                  href={collection.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                >
                  <FaGlobe size={20} />
                </a>
              )}
              {collection.socials?.twitter && (
                <a 
                  href={`https://twitter.com/${collection.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                >
                  <FaTwitter size={20} />
                </a>
              )}
              {collection.socials?.discord && (
                <a 
                  href={collection.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                >
                  <FaDiscord size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Minting Section */}
          <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-8 shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Price</span>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0d0e12] px-3 py-2 rounded-lg">
                  <TokenIcon type={collection.mintToken?.type || 'native'} size="large" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {collection.mintPrice} {collection.mintToken?.symbol || 'ETH'}
                  </span>
                </div>
              </div>
              
              {!isLive && (
                <>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-3 border border-gray-200 dark:border-gray-800 mb-4">
                    Starts {releaseDate.toLocaleDateString()} at {releaseDate.toLocaleTimeString()}
                  </div>
                  <CountdownTimer targetDate={releaseDate} />
                </>
              )}
            </div>

            {/* Whitelist Checker */}
            {collection.enableWhitelist && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-[#0d0e12] rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Whitelist Checker</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your wallet address"
                    value={checkingAddress}
                    onChange={(e) => setCheckingAddress(e.target.value)}
                    className="flex-1 bg-white dark:bg-[#1a1b1f] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-[#00ffbd]"
                  />
                  <button
                    onClick={checkEligibility}
                    className="px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black rounded-lg text-sm font-semibold transition-colors"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}

            {/* Mint Controls */}
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                  className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  disabled={!isLive}
                >
                  <BiMinus size={24} />
                </button>
                <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
                  {mintAmount}
                </span>
                <button
                  onClick={() => setMintAmount(Math.min(collection.maxPerWallet, mintAmount + 1))}
                  className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  disabled={!isLive}
                >
                  <BiPlus size={24} />
                </button>
              </div>

              <button
                onClick={handleMint}
                disabled={!isLive}
                className="w-full py-4 bg-[#00ffbd] hover:bg-[#00e6a9] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-lg transition-colors"
              >
                {isLive ? 'Mint Now' : 'Not Live Yet'}
              </button>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{collection.totalMinted || 0}/{collection.maxSupply} Minted</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-[#0d0e12] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00ffbd] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Max Per Wallet</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{collection.maxPerWallet}</div>
                </div>
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{collection.maxSupply}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 