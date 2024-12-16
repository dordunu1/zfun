import React, { useState, useEffect, useMemo } from 'react';
import { FaEthereum, FaDiscord, FaTwitter, FaTelegram } from 'react-icons/fa';
import { BiMinus, BiPlus, BiCopy, BiCheck, BiX, BiWorld } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import TokenIcon from './TokenIcon';
import { NFTCollectionABI } from '../abi/NFTCollection';
import { ethers } from 'ethers';
import { getCollection, updateCollectionMinted, subscribeToCollection, saveMintData, getTokenDeploymentByAddress } from '../services/firebase';
import FuturisticCard from './FuturisticCard';
import { ipfsToHttp } from '../utils/ipfs';
import AnalyticsTabs from './analytics/AnalyticsTabs';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { prepareAndUploadMetadata } from '../services/metadata';


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

// Add this new countdown component for mint end
function MintEndCountdown({ endDate, infiniteMint }) {
  if (infiniteMint) {
    return null; // Don't show countdown for infinite mint
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
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
  }, [endDate]);

  const isMintEnded = Object.keys(timeLeft).length === 0;

  return (
    <div className="text-center">
      {!isMintEnded ? (
        <div className="text-sm text-gray-500">
          Mint ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      ) : (
        <div className="text-sm text-red-500">Mint Ended</div>
      )}
    </div>
  );
}

function RemainingMintAmount({ userMintedAmount, maxPerWallet }) {
  const remaining = maxPerWallet - userMintedAmount;
  
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
      You can mint {remaining} more NFT{remaining !== 1 ? 's' : ''}
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
  const [whitelistEntry, setWhitelistEntry] = useState(null);
  const [paymentTokenInfo, setPaymentTokenInfo] = useState(null);
  const [tokenLogos, setTokenLogos] = useState({});

  // Load on-chain data when wallet connects
  useEffect(() => {
    if (collection?.contractAddress && account) {
      const loadContractData = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(
            collection.contractAddress,
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
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
            collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
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

  // Add new useEffect to fetch payment token info
  useEffect(() => {
    const fetchPaymentTokenInfo = async () => {
      if (collection?.contractAddress && window.ethereum) {
        try {
          // Use the payment token info directly from collection data
          const paymentToken = collection.mintToken;
          
          console.log('Collection payment token:', {
            mintToken: paymentToken,
            customTokenAddress: collection.customTokenAddress
          });

          if (paymentToken && paymentToken.type === 'custom') {
            setPaymentTokenInfo({
              address: paymentToken.address,
              symbol: paymentToken.symbol || collection.customTokenSymbol || 'TOKEN',
              decimals: 18,
              isNative: false
            });
          } else {
            // Native token case
            setPaymentTokenInfo({
              address: ethers.ZeroAddress,
              symbol: collection.network === 'polygon' ? 'MATIC' : 'ETH',
              decimals: 18,
              isNative: true
            });
          }
        } catch (error) {
          console.error('Error setting payment token info:', error);
        }
      }
    };

    fetchPaymentTokenInfo();
  }, [collection?.contractAddress, collection?.network]);

  useEffect(() => {
    const fetchTokenLogo = async () => {
      if (collection?.mintToken?.address) {
        try {
          const tokenDeployment = await getTokenDeploymentByAddress(collection.mintToken.address);
          console.log('Token Deployment Result:', tokenDeployment);
          
          if (tokenDeployment?.logo) {
            setTokenLogos(prev => ({
              ...prev,
              [collection.mintToken.address.toLowerCase()]: tokenDeployment.logo
            }));
          }
        } catch (error) {
          console.error('Error fetching token logo:', error);
        }
      }
    };

    fetchTokenLogo();
  }, [collection?.mintToken?.address]);

  const renderCurrencyLogo = () => {
    // For custom token mints
    if (collection?.mintToken?.type === 'custom') {
      const tokenAddress = collection.mintToken.address?.toLowerCase();
      const logoUrl = tokenLogos[tokenAddress];
      
      if (logoUrl) {
        return (
          <img 
            src={logoUrl}
            alt={collection.mintToken.symbol || 'Token'}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/token-default.png';
            }}
          />
        );
      }
    }
    
    // For ETH mints, use the green ETH logo
    return <FaEthereum className="w-5 h-5 text-[#00ffbd]" />;
  };

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
      
      toast.loading('Preparing metadata...', { id: 'mint' });

      // Create a File object from the image URL
      const imageResponse = await fetch(collection.previewUrl);
      const imageBlob = await imageResponse.blob();
      const artworkFile = new File([imageBlob], 'artwork.png', { type: 'image/png' });
      
      // Prepare metadata before minting
      const { metadataUrl } = await prepareAndUploadMetadata(
        {
          ...collection,
          name: collection.name,
          description: collection.description,
          attributes: collection.attributes || [],
          website: collection.website,
          background_color: collection.background_color
        },
        artworkFile
      );

      // Extract IPFS hash without the protocol prefix
      const ipfsHash = metadataUrl.replace('ipfs://', '').trim();
      
      toast.loading('Minting in progress...', { id: 'mint' });

      const nftContract = new ethers.Contract(
        collection.contractAddress,
        collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
        signer
      );

      // Use the payment token from collection data
      const paymentToken = collection.mintToken?.address;
      let mintPriceWei;
      try {
        mintPriceWei = collection.mintPrice ? ethers.parseEther(collection.mintPrice.toString()) : BigInt(0);
      } catch (error) {
        console.error('Error parsing mint price:', error);
        mintPriceWei = BigInt(0);
      }
      const totalCost = mintPriceWei * BigInt(mintAmount);

      // Handle token approvals if needed
      if (paymentToken && paymentToken !== '0x0000000000000000000000000000000000000000') {
        const tokenContract = new ethers.Contract(
          paymentToken,
          [
            'function approve(address spender, uint256 amount) public returns (bool)',
            'function allowance(address owner, address spender) view returns (uint256)',
            'function balanceOf(address account) view returns (uint256)'
          ],
          signer
        );

        try {
          // Check token balance first
          const balance = await tokenContract.balanceOf(account);
          if (balance < totalCost) {
            toast.error('Insufficient token balance', { id: 'mint' });
            return;
          }

          // Check and approve if needed
          const currentAllowance = await tokenContract.allowance(account, collection.contractAddress);
          if (currentAllowance < totalCost) {
            toast.loading('Approving token spend...', { id: 'approve' });
            const approveTx = await tokenContract.approve(collection.contractAddress, totalCost);
            await approveTx.wait();
            toast.success('Token approved!', { id: 'approve' });
          }
        } catch (error) {
          console.error('Token approval error:', error);
          toast.error('Failed to approve token', { id: 'mint' });
          return;
        }
      }

      // Mint with metadata in a single transaction
      const mintOptions = {
        value: paymentToken === '0x0000000000000000000000000000000000000000' ? totalCost : BigInt(0),
        gasLimit: 1000000
      };

      let tx;
      if (collection.type === 'ERC1155') {
        const tokenId = 0;
        tx = await nftContract.mint(tokenId, mintAmount, ipfsHash, mintOptions);
      } else {
        tx = await nftContract.mint(mintAmount, ipfsHash, mintOptions);
      }

      console.log('Mint transaction sent:', tx);
      const receipt = await tx.wait();
      console.log('Mint receipt:', receipt);

      // Update states
      const [newTotal, newUserMinted] = await Promise.all([
        nftContract.totalSupply(),
        nftContract.mintedPerWallet(account)
      ]);

      setTotalMinted(Number(newTotal));
      setUserMintedAmount(Number(newUserMinted));
      await updateCollectionMinted(symbol, Number(newTotal));

      // Format values for Firebase
      let formattedValue = '0';
      let formattedMintPrice = '0';
      
      try {
        if (collection.mintPrice) {
          formattedMintPrice = parseFloat(collection.mintPrice).toFixed(6);
          const ethValue = ethers.formatEther(totalCost);
          formattedValue = parseFloat(ethValue).toFixed(6);
        }
      } catch (error) {
        console.error('Error formatting values:', error);
      }

      // Save mint data to Firebase with proper ETH value formatting
      await saveMintData({
        collectionAddress: collection.contractAddress,
        minterAddress: account,
        tokenId: collection.type === 'ERC1155' ? '0' : String(newTotal),
        quantity: String(mintAmount),
        hash: receipt.hash,
        image: collection.previewUrl,
        value: formattedValue,
        type: collection.type,
        name: collection.name,
        symbol: collection.symbol,
        artworkType: collection.artworkType || 'image',
        network: collection.network || 'sepolia',
        mintPrice: formattedMintPrice,
        paymentToken: collection.mintToken || null
      });

      toast.success(`Successfully minted ${mintAmount} NFT${mintAmount > 1 ? 's' : ''}!`, { id: 'mint' });

    } catch (error) {
      console.error('Mint error:', error);
      toast.error('Failed to mint NFT: ' + error.message);
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
      
      const foundEntry = whitelistAddresses.find(addr => {
        if (!addr) return false;
        const addressToCheck = typeof addr === 'object' ? addr.address : addr;
        return addressToCheck && addressToCheck.toLowerCase() === checkAddress;
      });

      const isWhitelisted = !!foundEntry;
      const mintLimit = foundEntry && typeof foundEntry === 'object' ? foundEntry.maxMint : 1;

      setWhitelistChecked(true);
      setIsWhitelisted(isWhitelisted);
      setWhitelistEntry(foundEntry);

      if (isWhitelisted) {
        toast.success(`Address is whitelisted! Can mint up to ${mintLimit} NFTs 🎉`);
      } else {
        toast.error('Address is not whitelisted');
      }

      // Also check contract if available
      if (collection.contractAddress && provider) {
        const contract = new ethers.Contract(
          collection.contractAddress, 
          collection.type === 'ERC1155' ? NFTCollectionABI.ERC1155Royalty : NFTCollectionABI.ERC721Royalty,
          provider
        );
        
        try {
          // Use whitelist mapping and whitelistMintLimit mapping directly
          const [onChainWhitelist, onChainLimit] = await Promise.all([
            contract.whitelist(checkingAddress),
            contract.whitelistMintLimit(checkingAddress)
          ]);

          console.log('On-chain whitelist status:', {
            isWhitelisted: onChainWhitelist,
            mintLimit: onChainLimit.toString()
          });

          if (onChainWhitelist !== isWhitelisted) {
            console.warn('Whitelist status mismatch between local and contract');
          }
          if (onChainLimit.toString() !== mintLimit.toString()) {
            console.warn('Whitelist mint limit mismatch between local and contract');
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

  // Update the price display section to show correct price
  const renderPrice = () => {
    if (!collection?.mintPrice) return null;

    return (
      <div className="flex items-center justify-between mb-6">
        <span className="text-gray-700 dark:text-gray-300">Price</span>
        <div className="flex items-center gap-1">
          {renderCurrencyLogo()}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {collection.mintPrice}
          </span>
        </div>
      </div>
    );
  };

  // Update the mint button section to include end time check
  const renderMintButton = () => {
    const now = Date.now();
    const mintEndDate = collection.mintEndDate ? new Date(collection.mintEndDate) : null;
    const isMintEnded = !collection.infiniteMint && mintEndDate && now >= mintEndDate;

    return (
      <div className="flex flex-col gap-2">
        {!collection.infiniteMint && (
          <MintEndCountdown 
            endDate={collection.mintEndDate} 
            infiniteMint={collection.infiniteMint}
          />
        )}

        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setMintAmount(Math.max(1, mintAmount - 1))}
            className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isLive || mintAmount <= 1 || (
              collection.enableWhitelist && (!whitelistChecked || !isWhitelisted)
            )}
          >
            <BiMinus size={24} />
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[60px] text-center">
            {mintAmount}
          </span>
          <button
            onClick={() => {
              const maxAllowed = collection.enableWhitelist && whitelistEntry
                ? (whitelistEntry.maxMint || 1)
                : collection.maxPerWallet;
              const remaining = maxAllowed - userMintedAmount;
              setMintAmount(Math.min(remaining, mintAmount + 1));
            }}
            className="p-2 rounded-lg bg-white dark:bg-[#1a1b1f] text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isLive || (
              collection.enableWhitelist ? (
                !whitelistChecked || 
                !isWhitelisted || 
                userMintedAmount >= (whitelistEntry?.maxMint || 1) ||
                mintAmount >= (whitelistEntry?.maxMint || 1) - userMintedAmount
              ) : (
                userMintedAmount >= collection.maxPerWallet ||
                mintAmount >= collection.maxPerWallet - userMintedAmount
              )
            )}
          >
            <BiPlus size={24} />
          </button>
        </div>

        {account && (
          <RemainingMintAmount 
            userMintedAmount={userMintedAmount} 
            maxPerWallet={collection.enableWhitelist ? (whitelistEntry?.maxMint || 1) : collection.maxPerWallet}
          />
        )}

        <button
          onClick={handleMint}
          disabled={
            !isLive || 
            isMintEnded ||
            (collection.enableWhitelist ? (
              !whitelistChecked || 
              !isWhitelisted || 
              userMintedAmount >= (whitelistEntry?.maxMint || 1)
            ) : (
              userMintedAmount >= collection.maxPerWallet
            )) || 
            mintAmount === 0
          }
          className={`w-full py-3 ${
            isMintEnded ? 'bg-gray-400 cursor-not-allowed' :
            collection.enableWhitelist && (!whitelistChecked || !isWhitelisted)
              ? 'bg-gray-200 dark:bg-[#1a1b1f] text-gray-900 dark:text-white'
              : 'bg-[#00ffbd] hover:bg-[#00e6a9] text-black'
          } disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg text-lg transition-colors`}
        >
          {isMintEnded ? 'Mint Ended' :
           !isLive ? 'Not Live Yet' : 
           collection.enableWhitelist ? (
             !whitelistChecked ? 'Check Whitelist Status First' :
             !isWhitelisted ? 'Address Not Whitelisted' :
             userMintedAmount >= (whitelistEntry?.maxMint || 1) ? 'Whitelist Limit Reached' :
             'Mint Now (Whitelist)'
           ) : (
             userMintedAmount >= collection.maxPerWallet ? 'Max Limit Reached' :
             'Mint Now'
           )
          }
        </button>
      </div>
    );
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
          {/* Collection Info Card */}
          <div className="relative">
            {/* L-shaped corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>

            {/* Glowing dots in corners */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

            {/* Three dots in top right */}
            <div className="absolute top-3 right-3 flex gap-1 z-20">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Main Content - Update background */}
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6">
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
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
                {collection.attributes?.map((attr, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                  >
                    <p className="text-sm text-gray-500 mb-1">{attr.trait_type}</p>
                    <p className="text-lg font-medium text-[#00ffbd]">
                      {typeof attr.value === 'number' ? attr.value.toString() : attr.value}
                    </p>
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
          </div>

          {/* Minting Section Card */}
          <div className="relative">
            {/* L-shaped corners */}
            <div className="absolute -top-[2px] -left-[2px] w-8 h-8">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -top-[2px] -right-[2px] w-8 h-8">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute top-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -left-[2px] w-8 h-8">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 left-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>
            <div className="absolute -bottom-[2px] -right-[2px] w-8 h-8">
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-[#00ffbd]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-full bg-[#00ffbd]" />
            </div>

            {/* Glowing dots */}
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#00ffbd] shadow-[0_0_10px_#00ffbd]" />

            {/* Three dots */}
            <div className="absolute top-3 right-3 flex gap-1 z-20">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#00ffbd] rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Main Content - Update background */}
            <div className="relative z-10 bg-white dark:bg-[#0a0b0f] p-6">
              {renderPrice()}

              {/* Whitelist Checker */}
              {collection.enableWhitelist && (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-[#0d0e12] rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 dark:text-white font-semibold">Whitelist Checker</h3>
                    {whitelistChecked && isWhitelisted && (
                      <span className="text-xs bg-[#00ffbd]/10 text-[#00ffbd] px-2 py-1 rounded-full">
                        Whitelisted ✓
                      </span>
                    )}
                  </div>
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
                  {whitelistChecked && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      isWhitelisted 
                        ? 'bg-[#00ffbd]/10 border border-[#00ffbd]/20' 
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      {isWhitelisted ? (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-[#00ffbd]">
                            <span className="mr-2">✓</span>
                            Address is whitelisted
                          </div>
                          {whitelistEntry && typeof whitelistEntry === 'object' && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              You can mint up to {whitelistEntry.maxMint} NFTs during the whitelist phase
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-red-500">
                          <span className="mr-2">✗</span>
                          Address is not whitelisted
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {renderMintButton()}

              {/* Contract and Creator Addresses */}
              <div className="flex items-center justify-between text-center mt-4">
                {collection.creatorAddress && (
                  <div className="group relative">
                    <a
                      href={`${collection.network === 'polygon' ? 'https://polygonscan.com' : 'https://sepolia.etherscan.io'}/address/${collection.creatorAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[#00ffbd] dark:text-gray-400 dark:hover:text-[#00ffbd] transition-colors"
                    >
                      Creator Address
                    </a>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {collection.creatorAddress}
                    </div>
                  </div>
                )}

                <div className="group relative">
                  <a
                    href={`${collection.network === 'polygon' ? 'https://polygonscan.com' : 'https://sepolia.etherscan.io'}/address/${collection.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-[#00ffbd] dark:text-gray-400 dark:hover:text-[#00ffbd] transition-colors"
                  >
                    Contract Address
                  </a>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {collection.contractAddress}
                  </div>
                </div>
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
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {collection.enableWhitelist ? (
                      <span className="text-sm text-gray-600 dark:text-gray-400">Check your mint cap in whitelist checker above</span>
                    ) : (
                      collection.maxPerWallet
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-[#0d0e12] rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Supply</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{maxSupply}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Collection Analytics
          </h2>
          <FuturisticCard>
            <AnalyticsTabs />
          </FuturisticCard>
        </div>
      </div>
    </div>
  );
} 