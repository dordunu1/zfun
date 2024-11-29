import React, { useState, useEffect, useMemo } from 'react';
import { FaEthereum, FaDiscord, FaTwitter, FaTelegram } from 'react-icons/fa';
import { BiMinus, BiPlus, BiCopy, BiCheck, BiX, BiWorld } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import TokenIcon from './TokenIcon';
import { NFTCollectionABI } from '../abi/NFTCollection';
import { ethers } from 'ethers';
import { getCollection, updateCollectionMinted, subscribeToCollection } from '../services/firebase';
import FuturisticCard from './FuturisticCard';
import { ipfsToHttp } from '../utils/ipfs';

const validateAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
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
        <div key={key} className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-2 border border-gray-200 dark:border-gray-800">
          <div className="text-xl font-bold text-[#00ffbd]">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
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
  const [account, setAccount] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [userMintedAmount, setUserMintedAmount] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0);
  const [provider, setProvider] = useState(null);
  const [whitelistChecked, setWhitelistChecked] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  // Load on-chain data when wallet connects
  useEffect(() => {
    if (collection?.contractAddress && account) {
      const loadContractData = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            collection.contractAddress,
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155 : NFTCollectionABI.ERC721,
            provider
          );

          // Get contract data based on type
          if (collection.type === 'ERC1155') {
            const [totalMinted, userMinted] = await Promise.all([
              contract.totalSupply(),
              contract.mintedPerWallet(account)
            ]);
            setTotalMinted(Number(totalMinted));
            setUserMintedAmount(Number(userMinted));
          } else {
            const [totalMinted, userMinted] = await Promise.all([
              contract.totalSupply(),
              contract.mintedPerWallet(account)
            ]);
            setTotalMinted(Number(totalMinted));
            setUserMintedAmount(Number(userMinted));
          }
        } catch (error) {
          console.error('Error loading contract data:', error);
          // Reset user minted amount when there's an error or wallet disconnects
          setUserMintedAmount(0);
        }
      };

      loadContractData();
    } else {
      // Reset states when no wallet is connected
      setUserMintedAmount(0);
    }
  }, [account, collection?.contractAddress]); // Add account to dependencies

  // Add this effect to reset states on disconnect
  useEffect(() => {
    if (!account) {
      setUserMintedAmount(0);
    }
  }, [account]);

  // Calculate progress based on maxSupply from contract
  const progress = maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0;

  // Load collection data
  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        const data = await getCollection(symbol);
        if (!data) {
          toast.error('Collection not found');
          navigate('/');
          return;
        }
        setCollection(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading collection:', error);
        toast.error('Error loading collection data');
      }
    };

    loadCollectionData();
  }, [symbol, navigate]);

  // Check account
  useEffect(() => {
    const checkAccount = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      }
    };

    checkAccount();
  }, []);

  // Add this effect to subscribe to real-time updates
  useEffect(() => {
    if (!symbol) return;
    
    const unsubscribe = subscribeToCollection(symbol, (data) => {
      setCollection(data);
      setTotalMinted(data.totalMinted || 0);
    });

    return () => unsubscribe();
  }, [symbol]);

  // Add this effect specifically for getting maxSupply
  useEffect(() => {
    if (collection?.contractAddress) {
      const getMaxSupply = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            collection.contractAddress,
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155 : NFTCollectionABI.ERC721,
            provider
          );

          // Get maxSupply from contract config
          const config = await contract.config();
          setMaxSupply(Number(config.maxSupply));
        } catch (error) {
          console.error('Error getting max supply:', error);
          // Fallback to collection data
          setMaxSupply(Number(collection.maxSupply));
        }
      };

      getMaxSupply();
    }
  }, [collection?.contractAddress]);

  // Add this useEffect to initialize provider
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
    }
  }, []);

  if (loading || !collection) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const handleMint = async () => {
    try {
      if (!account) {
        toast.error('Please connect your wallet');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // ERC1155 specific minimal ABI
      const minimalABI = collection.type === 'ERC1155' ? [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
          "name": "mintedPerWallet",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        }
      ] : [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "quantity",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
          "name": "mintedPerWallet",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
          "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
          "stateMutability": "view",
          "type": "function"
        }
      ];

      const nftContract = new ethers.Contract(
        collection.contractAddress,
        minimalABI,
        signer
      );

      const mintPriceWei = ethers.parseEther(collection.mintPrice.toString());
      const totalCost = mintPriceWei * BigInt(mintAmount);

      toast.loading('Minting in progress...', { id: 'mint' });

      if (collection.type === 'ERC1155') {
        const tx = await nftContract.mint(0, mintAmount, { 
          value: totalCost,
          gasLimit: 300000
        });

        await tx.wait();

        // Update states immediately after mint confirmation
        try {
          // Get updated values using the same contract instance
          const [newTotal, newUserMinted] = await Promise.all([
            nftContract.totalSupply(),
            nftContract.mintedPerWallet(account)
          ]);

          const updatedTotal = Number(newTotal);
          const updatedUserMinted = Number(newUserMinted);

          // Update all states
          setTotalMinted(updatedTotal);
          setUserMintedAmount(updatedUserMinted);

          // Update Firebase
          await updateCollectionMinted(symbol, updatedTotal);

          // Update local collection data
          setCollection(prev => ({
            ...prev,
            totalMinted: updatedTotal
          }));

          toast.success(`Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}!`, { id: 'mint' });
        } catch (error) {
          console.error('Error updating states:', error);
          // Force a page refresh if state updates fail
          window.location.reload();
        }
      } else {
        // ERC721 mint
        const tx = await nftContract.mint(mintAmount, { 
          value: totalCost,
          gasLimit: 300000
        });

        await tx.wait();

        // Update states immediately after mint confirmation
        try {
          // Get updated values using the same contract instance
          const [newTotal, newUserMinted] = await Promise.all([
            nftContract.totalSupply(),
            nftContract.mintedPerWallet(account)
          ]);

          const updatedTotal = Number(newTotal);
          const updatedUserMinted = Number(newUserMinted);

          // Update all states
          setTotalMinted(updatedTotal);
          setUserMintedAmount(updatedUserMinted);

          // Update Firebase
          await updateCollectionMinted(symbol, updatedTotal);

          // Update local collection data
          setCollection(prev => ({
            ...prev,
            totalMinted: updatedTotal
          }));

          toast.success(`Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}!`, { id: 'mint' });
        } catch (error) {
          console.error('Error updating states:', error);
          // Force a page refresh if state updates fail
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Mint error:', error);
      if (error.message.includes('execution reverted')) {
        const errorMessage = error.message.split('execution reverted:')[1]?.trim() || 'Minting failed';
        toast.error(errorMessage, { id: 'mint' });
      } else {
        toast.error('Failed to mint NFT', { id: 'mint' });
      }
    }
  };

  // Calculate remaining time until release
  const now = Date.now();
  const releaseDate = new Date(collection.releaseDate);
  const isLive = now >= releaseDate;
  
  const checkEligibility = async () => {
    if (!validateAddress(checkingAddress)) {
      toast.error('Invalid wallet address');
      return;
    }

    try {
      // First check local whitelist
      const whitelistAddresses = collection.whitelistAddresses || [];
      const checkAddress = checkingAddress.toLowerCase();
      
      const isWhitelisted = whitelistAddresses.some(addr => {
        if (!addr) return false;
        const addressToCheck = typeof addr === 'object' ? addr.address : addr;
        return addressToCheck && addressToCheck.toLowerCase() === checkAddress;
      });

      setWhitelistChecked(true);
      setIsWhitelisted(isWhitelisted);

      if (isWhitelisted) {
        toast.success('Address is whitelisted! 🎉');
      } else {
        toast.error('Address is not whitelisted');
      }

      // Also check contract if available
      if (collection.contractAddress && provider) {
        const contract = new ethers.Contract(
          collection.contractAddress, 
          collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155 : NFTCollectionABI.ERC721,
          provider
        );
        
        try {
          const onChainStatus = await contract.isWhitelisted(checkingAddress);
          if (onChainStatus !== isWhitelisted) {
            console.warn('Whitelist status mismatch between local and contract');
          }
        } catch (error) {
          console.warn('Contract whitelist check failed:', error);
        }
      }
    } catch (error) {
      console.error('Error checking whitelist:', error);
      toast.error('Error checking whitelist status');
    }
  };

  // Add this check when loading collection data
  const verifyCollectionData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const nftContract = new ethers.Contract(collection.contractAddress, abi, provider);
    const config = await nftContract.config();
    
    console.log('On-chain config:', config);
    console.log('Local collection data:', collection);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] bg-gradient-to-br from-[#00ffbd]/5 to-[#00e6a9]/5 dark:from-[#00ffbd]/10 dark:to-[#00e6a9]/10">
        {collection.artworkType === 'video' ? (
          <video 
            src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img 
            src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
            alt={collection.name}
            className="w-full h-full object-cover opacity-20 dark:opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0a0b0f] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Info */}
          <FuturisticCard>
            <div className="overflow-y-auto">
              <div className="flex items-center gap-6 mb-6">
                {collection.artworkType === 'video' ? (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-[#00ffbd]">
                    <video 
                      src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  <img 
                    src={collection.previewUrl || ipfsToHttp(collection.imageIpfsUrl)}
                    alt={collection.name}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-[#00ffbd]"
                  />
                )}
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

              {/* Social Links */}
              <div className="flex gap-4 mt-6 mb-6">
                {collection.website && (
                  <a 
                    href={collection.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <BiWorld size={20} />
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
                {collection.socials?.telegram && (
                  <a 
                    href={collection.socials.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ffbd] transition-colors"
                  >
                    <FaTelegram size={20} />
                  </a>
                )}
              </div>
            </div>
          </FuturisticCard>

          {/* Minting Section */}
          <FuturisticCard>
            <div className="overflow-y-auto">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Price</span>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0d0e12] px-3 py-2 rounded-lg">
                    <TokenIcon 
                      type={collection.mintingToken} 
                      size="large" 
                      network={collection.network} 
                    />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {collection.mintPrice} {collection.mintToken?.symbol}
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
                      disabled={!checkingAddress || !validateAddress(checkingAddress)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        checkingAddress && validateAddress(checkingAddress)
                          ? 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black' 
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Check
                    </button>
                  </div>
                  {isEligible !== null && (
                    <div className={`mt-2 text-sm ${isEligible ? 'text-[#00ffbd]' : 'text-red-500'}`}>
                      {isEligible ? '✓ Address is whitelisted' : '✗ Address is not whitelisted'}
                    </div>
                  )}
                </div>
              )}

              {/* Mint Controls */}
              <div className="space-y-6">
                {/* Minting Status */}
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {userMintedAmount >= collection.maxPerWallet ? (
                    <span className="text-red-500">Maximum mint limit reached</span>
                  ) : (
                    `You have minted ${userMintedAmount} out of ${collection.maxPerWallet} NFTs`
                  )}
                </div>

                {/* Mint Controls */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
                    className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isLive || userMintedAmount >= collection.maxPerWallet}
                  >
                    <BiMinus size={24} />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
                    {mintAmount}
                  </span>
                  <button
                    onClick={() => {
                      const remaining = collection.maxPerWallet - userMintedAmount;
                      setMintAmount(Math.min(remaining, mintAmount + 1));
                    }}
                    className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isLive || userMintedAmount >= collection.maxPerWallet}
                  >
                    <BiPlus size={24} />
                  </button>
                </div>

                {/* Updated Mint Button */}
                <div className="flex justify-center px-4">
                  <button
                    onClick={handleMint}
                    disabled={
                      !isLive || 
                      userMintedAmount >= collection.maxPerWallet || 
                      mintAmount === 0 ||
                      (collection.enableWhitelist && (!whitelistChecked || !isWhitelisted))
                    }
                    className={`w-full py-3 ${
                      collection.enableWhitelist && (!whitelistChecked || !isWhitelisted)
                        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                        : 'bg-[#00ffbd] hover:bg-[#00e6a9]'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-lg transition-colors`}
                  >
                    {!isLive ? 'Not Live Yet' : 
                     userMintedAmount >= collection.maxPerWallet ? 'Max Limit Reached' :
                     collection.enableWhitelist && !whitelistChecked ? 'Check Whitelist Status First' :
                     collection.enableWhitelist && !isWhitelisted ? 'Address Not Whitelisted' :
                     'Mint Now'}
                  </button>
                </div>

                {/* Contract Address */}
                <div className="text-center">
                  <a
                    href={`${collection.network === 'polygon' ? 'https://polygonscan.com' : 'https://sepolia.etherscan.io'}/address/${collection.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00ffbd] transition-colors"
                  >
                    <span>Contract:</span>
                    <span className="font-mono">{collection.contractAddress.slice(0, 6)}...{collection.contractAddress.slice(-4)}</span>
                    <BiX className="transform rotate-45" />
                  </a>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{totalMinted}/{maxSupply} Minted</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-[#0d0e12] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00ffbd] transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
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
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{maxSupply}</div>
                  </div>
                </div>
              </div>
            </div>
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
} 