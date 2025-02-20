import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF";

// Add method ID constants
const METHOD_IDS = {
  TOKEN_CREATE: "0x6962f49e",
  NFT_CREATE: "0x54a9c682"
};

const CHAIN_INFO = {
  137: {
    name: "Polygon",
    currency: "POL",
    factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS_137,
    nftFactoryAddress: import.meta.env.VITE_NFT_FACTORY_POLYGON,
    rpc: "https://polygon-rpc.com",
    chainId: "0x89" // 137 in hex
  },
  130: {
    name: "Unichain Mainnet",
    currency: "ETH",
    factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS_130,
    nftFactoryAddress: import.meta.env.VITE_NFT_FACTORY_UNICHAIN_MAINNET,
    rpc: "https://mainnet.unichain.org",
    chainId: "0x82" // 130 in hex
  },
  1301: {
    name: "Unichain",
    currency: "ETH",
    factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS_1301,
    nftFactoryAddress: import.meta.env.VITE_NFT_FACTORY_UNICHAIN,
    rpc: "https://sepolia.unichain.org",
    chainId: "0x515" // 1301 in hex
  },
  1828369849: {
    name: "Moonwalker",
    currency: "ZERO",
    factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS_1828369849,
    nftFactoryAddress: import.meta.env.VITE_NFT_FACTORY_MOONWALKER,
    rpc: "https://moonwalker-rpc.eu-north-2.gateway.fm",
    chainId: "0x6CFF49C9" // 1828369849 in hex
  },
  10143: {
    name: "Monad Testnet",
    currency: "MON",
    factoryAddress: import.meta.env.VITE_FACTORY_ADDRESS_10143,
    nftFactoryAddress: import.meta.env.VITE_NFT_FACTORY_MONAD_TESTNET,
    rpc: "https://testnet-rpc.monad.xyz/",
    chainId: "0x279F" // 10143 in hex
  }
};

const FACTORY_ABI = [
  "function chainFees(uint256) view returns (uint256)",
  "function setChainFee(uint256,uint256)",
  "function getChainFee() view returns (uint256)",
  "function withdrawFees() external",
  "function withdraw() external",
  "event TokenCreated(address indexed creator, address indexed tokenAddress, string name, string symbol, uint8 decimals, uint256 initialSupply, string logoURI)",
  "event NFTCollectionCreated(address indexed creator, address collectionAddress)"
];

function FeesTracker() {
  const { address } = useAccount();
  const [selectedChain, setSelectedChain] = useState("1301"); // Default to Unichain
  const [fees, setFees] = useState({});
  const [earnedFees, setEarnedFees] = useState({});
  const [loading, setLoading] = useState(true);
  const [newFees, setNewFees] = useState({});
  const [error, setError] = useState(null);
  const [creatorStats, setCreatorStats] = useState({});
  const [transactions, setTransactions] = useState({ tokens: [], nfts: [] });

  const isAdmin = address?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  const getProvider = (chainId) => {
    const network = CHAIN_INFO[chainId];
    return new ethers.JsonRpcProvider(
      network.rpc,
      {
        chainId: Number(chainId),
        name: network.name,
      }
    );
  };

  const fetchCreatorStats = async () => {
    try {
      const uniqueTokenCreators = new Set();
      const uniqueNFTCreators = new Set();
      const uniqueRecentTokenCreators = new Set();
      const uniqueRecentNFTCreators = new Set();
      let totalTokenCreations = 0;
      let totalNFTCreations = 0;
      let recent24hTokenCreations = 0;
      let recent24hNFTCreations = 0;
      const tokenTxs = [];
      const nftTxs = [];
      
      const oneDayAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
      const info = CHAIN_INFO[selectedChain];

      try {
        const baseUrl = selectedChain === "1301" 
          ? "https://unichain-sepolia.blockscout.com"
          : selectedChain === "130"
          ? "https://unichain.blockscout.com"
          : selectedChain === "137"
          ? "https://api.polygonscan.com/api"
          : "https://moonwalker-blockscout.eu-north-2.gateway.fm";

        // For Polygon, use Polygonscan API
        if (selectedChain === "137") {
          const apiKey = import.meta.env.VITE_POLYGONSCAN_API_KEY;
          const tokenCreationsUrl = `${baseUrl}?module=account&action=txlist&address=${info.factoryAddress}&apikey=${apiKey}`;
          const nftCreationsUrl = `${baseUrl}?module=account&action=txlist&address=${info.nftFactoryAddress}&apikey=${apiKey}`;
          
          const [tokenResponse, nftResponse] = await Promise.all([
            fetch(tokenCreationsUrl),
            fetch(nftCreationsUrl)
          ]);

          if (!tokenResponse.ok || !nftResponse.ok) {
            throw new Error(`Polygonscan API request failed`);
          }

          const [tokenData, nftData] = await Promise.all([
            tokenResponse.json(),
            nftResponse.json()
          ]);

          // Process NFT creations from Polygonscan
          if (nftData.result && Array.isArray(nftData.result)) {
            for (const tx of nftData.result) {
              if (tx.to?.toLowerCase() === info.nftFactoryAddress?.toLowerCase() && 
                  tx.isError === "0" &&
                  tx.input?.startsWith(METHOD_IDS.NFT_CREATE)) {
                totalNFTCreations++;
                const creator = tx.from?.toLowerCase();
                if (creator) {
                  uniqueNFTCreators.add(creator);
                  
                  const txTimestamp = parseInt(tx.timeStamp);
                  if (txTimestamp >= oneDayAgo) {
                    uniqueRecentNFTCreators.add(creator);
                    recent24hNFTCreations++;
                  }

                  nftTxs.push({
                    hash: tx.hash,
                    creator: tx.from,
                    timestamp: new Date(txTimestamp * 1000).toISOString(),
                    blockNumber: tx.blockNumber
                  });
                }
              }
            }
          }

          // Process token creations from Polygonscan
          if (tokenData.result && Array.isArray(tokenData.result)) {
            for (const tx of tokenData.result) {
              if (tx.to?.toLowerCase() === info.factoryAddress?.toLowerCase() && 
                  tx.isError === "0" &&
                  tx.input?.startsWith(METHOD_IDS.TOKEN_CREATE)) {
                totalTokenCreations++;
                const creator = tx.from?.toLowerCase();
                if (creator) {
                  uniqueTokenCreators.add(creator);
                  
                  const txTimestamp = parseInt(tx.timeStamp);
                  if (txTimestamp >= oneDayAgo) {
                    uniqueRecentTokenCreators.add(creator);
                    recent24hTokenCreations++;
                  }

                  tokenTxs.push({
                    hash: tx.hash,
                    creator: tx.from,
                    timestamp: new Date(txTimestamp * 1000).toISOString(),
                    blockNumber: tx.blockNumber
                  });
                }
              }
            }
          }
        } else {
          // Original Blockscout API handling for other networks
          const tokenCreationsUrl = `${baseUrl}/api/v2/addresses/${info.factoryAddress}/transactions?filter=to|from`;
          const nftCreationsUrl = `${baseUrl}/api/v2/addresses/${info.nftFactoryAddress}/transactions?filter=to|from`;
          
          const [tokenResponse, nftResponse] = await Promise.all([
            fetch(tokenCreationsUrl),
            fetch(nftCreationsUrl)
          ]);

          if (!tokenResponse.ok || !nftResponse.ok) {
            throw new Error(`Blockscout API request failed`);
          }

          const [tokenData, nftData] = await Promise.all([
            tokenResponse.json(),
            nftResponse.json()
          ]);
          
          // Process NFT creations
          if (nftData.items && Array.isArray(nftData.items)) {
            for (const tx of nftData.items) {
              // Check for NFT creation method calls using method ID
              if (tx.to?.hash?.toLowerCase() === info.nftFactoryAddress?.toLowerCase() && 
                  tx.status === "ok" &&
                  (tx.method === METHOD_IDS.NFT_CREATE || tx.decoded_input?.method_id === METHOD_IDS.NFT_CREATE.slice(2))) {
                console.log("Found NFT creation:", tx.hash, tx.method, tx.decoded_input?.method_id);
                totalNFTCreations++;
                const creator = tx.from?.hash?.toLowerCase();
                if (creator) {
                  uniqueNFTCreators.add(creator);
                  
                  const txTimestamp = new Date(tx.timestamp).getTime() / 1000;
                  if (txTimestamp >= oneDayAgo) {
                    uniqueRecentNFTCreators.add(creator);
                    recent24hNFTCreations++;
                  }

                  // Store transaction details
                  nftTxs.push({
                    hash: tx.hash,
                    creator: tx.from.hash,
                    timestamp: tx.timestamp,
                    blockNumber: tx.block_number
                  });
                }
              }
            }
          }

          // Process token creations
          if (tokenData.items && Array.isArray(tokenData.items)) {
            for (const tx of tokenData.items) {
              // Check for token creation method calls using method ID
              if (tx.to?.hash?.toLowerCase() === info.factoryAddress?.toLowerCase() && 
                  tx.status === "ok" &&
                  (tx.method === METHOD_IDS.TOKEN_CREATE || tx.decoded_input?.method_id === METHOD_IDS.TOKEN_CREATE.slice(2))) {
                console.log("Found token creation:", tx.hash, tx.method, tx.decoded_input?.method_id);
                totalTokenCreations++;
                const creator = tx.from?.hash?.toLowerCase();
                if (creator) {
                  uniqueTokenCreators.add(creator);
                  
                  const txTimestamp = new Date(tx.timestamp).getTime() / 1000;
                  if (txTimestamp >= oneDayAgo) {
                    uniqueRecentTokenCreators.add(creator);
                    recent24hTokenCreations++;
                  }

                  // Store transaction details
                  tokenTxs.push({
                    hash: tx.hash,
                    creator: tx.from.hash,
                    timestamp: tx.timestamp,
                    blockNumber: tx.block_number
                  });
                }
              }
            }
          }
        }

        setCreatorStats({
          totalTokenCreators: totalTokenCreations,
          totalNFTCreators: totalNFTCreations,
          last24hTokenCreators: recent24hTokenCreations,
          last24hNFTCreators: recent24hNFTCreations,
          uniqueTokenCreators: uniqueTokenCreators.size,
          uniqueNFTCreators: uniqueNFTCreators.size
        });

        // Set transaction details
        setTransactions({
          tokens: tokenTxs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
          nfts: nftTxs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        });

      } catch (error) {
        // Fallback to on-chain fetching if Blockscout fails
        await fetchTokenEventsFromChain(uniqueTokenCreators, uniqueRecentTokenCreators, oneDayAgo);
        await fetchNFTEventsFromChain(uniqueNFTCreators, uniqueRecentNFTCreators, oneDayAgo);
      }

    } catch (error) {
      toast.error('Error fetching creator statistics');
    }
  };

  // Helper function for fallback chain fetching
  const fetchTokenEventsFromChain = async (uniqueTokenCreators, uniqueRecentTokenCreators, oneDayAgo) => {
    const info = CHAIN_INFO[selectedChain];
    const provider = getProvider(selectedChain);
    await provider.ready;
    const tokenFactory = new ethers.Contract(info.factoryAddress, FACTORY_ABI, provider);
    
    const latestBlock = await provider.getBlockNumber();
    const CHUNK_SIZE = 2000;
    const startBlock = Math.max(0, latestBlock - 50000);

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
      const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock);
      try {
        const tokenFilter = {
          address: info.factoryAddress,
          topics: [
            ethers.id("TokenCreated(address,address,string,string,uint8,uint256,string)")
          ],
          fromBlock,
          toBlock
        };
        
        const tokenEvents = await provider.getLogs(tokenFilter);
        
        for (const event of tokenEvents) {
          const creator = ethers.dataSlice(event.topics[1], 12).toLowerCase();
          uniqueTokenCreators.add(creator);
          
          const block = await provider.getBlock(event.blockNumber);
          if (block && block.timestamp >= oneDayAgo) {
            uniqueRecentTokenCreators.add(creator);
          }
        }
      } catch (error) {
        // Silent fail for individual chunk errors
      }
    }
  };

  // Helper function for fallback NFT chain fetching
  const fetchNFTEventsFromChain = async (uniqueNFTCreators, uniqueRecentNFTCreators, oneDayAgo) => {
    const info = CHAIN_INFO[selectedChain];
    const provider = getProvider(selectedChain);
    await provider.ready;
    const nftFactory = new ethers.Contract(info.nftFactoryAddress, FACTORY_ABI, provider);
    
    const latestBlock = await provider.getBlockNumber();
    const CHUNK_SIZE = 2000;
    const startBlock = Math.max(0, latestBlock - 50000);

    for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += CHUNK_SIZE) {
      const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock);
      try {
        const nftFilter = nftFactory.filters.NFTCollectionCreated();
        const nftEvents = await nftFactory.queryFilter(nftFilter, fromBlock, toBlock);
        
        for (const event of nftEvents) {
          const creator = event.args.creator.toLowerCase();
          uniqueNFTCreators.add(creator);
          
          const block = await provider.getBlock(event.blockNumber);
          if (block && block.timestamp >= oneDayAgo) {
            uniqueRecentNFTCreators.add(creator);
          }
        }
      } catch (error) {
        // Silent fail for individual chunk errors
      }
    }
  };

  const withdrawFees = async (chainId, type) => {
    if (!isAdmin) {
      toast.error('Only admin can withdraw fees');
      return;
    }

    const toastId = toast.loading('Preparing withdrawal...');

    try {
      // Get current chain ID from MetaMask
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetChainId = CHAIN_INFO[chainId].chainId;

      // Switch network if needed
      if (currentChainId !== targetChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
          // Wait for network switch
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          toast.error('Failed to switch network', { id: toastId });
          return;
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const factoryAddress = type === 'token' 
        ? CHAIN_INFO[chainId].factoryAddress 
        : CHAIN_INFO[chainId].nftFactoryAddress;
      
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);

      // Check if there are fees to withdraw
      const amountToWithdraw = type === 'token' 
        ? earnedFees[chainId]?.token 
        : earnedFees[chainId]?.nft;

      if (!amountToWithdraw || amountToWithdraw === "0") {
        toast.error('No fees available to withdraw', { id: toastId });
        return;
      }

      toast.loading('Please confirm the transaction...', { id: toastId });
      
      // Call the appropriate withdraw function based on the type - no parameters needed
      const tx = await (type === 'token' ? factory.withdraw() : factory.withdrawFees());
      
      toast.loading('Processing withdrawal...', { id: toastId });
      
      await tx.wait();
      toast.success('Fees withdrawn successfully', { id: toastId });
      
      // Refresh earned fees
      await fetchEarnedFees();
    } catch (error) {
      console.error('Error withdrawing fees:', error);
      toast.error(`Error withdrawing fees: ${error.message}`, { id: toastId });
    }
  };

  const fetchEarnedFees = async () => {
    const earned = {};

    try {
      const info = CHAIN_INFO[selectedChain];
      try {
        const provider = getProvider(selectedChain);
        await provider.ready;

        const tokenFactory = new ethers.Contract(info.factoryAddress, FACTORY_ABI, provider);
        const nftFactory = new ethers.Contract(info.nftFactoryAddress, FACTORY_ABI, provider);

        const [tokenBalance, nftBalance] = await Promise.all([
          provider.getBalance(info.factoryAddress),
          provider.getBalance(info.nftFactoryAddress)
        ]);

        earned[selectedChain] = {
          token: ethers.formatEther(tokenBalance || "0"),
          nft: ethers.formatEther(nftBalance || "0"),
          currency: info.currency
        };
      } catch (chainError) {
        earned[selectedChain] = {
          token: "0",
          nft: "0",
          currency: info.currency,
          error: true
        };
      }

      setEarnedFees(earned);
    } catch (error) {
      toast.error('Error fetching earned fees');
    }
  };

  const fetchFees = async () => {
    setLoading(true);
    setError(null);
    const newFees = {};

    try {
      const info = CHAIN_INFO[selectedChain];
      try {
        const provider = getProvider(selectedChain);
        await provider.ready;

        const tokenFactory = new ethers.Contract(info.factoryAddress, FACTORY_ABI, provider);
        const nftFactory = new ethers.Contract(info.nftFactoryAddress, FACTORY_ABI, provider);

        const [tokenFee, nftFee] = await Promise.all([
          tokenFactory.chainFees(selectedChain),
          nftFactory.chainFees(selectedChain)
        ]);

        newFees[selectedChain] = {
          token: ethers.formatEther(tokenFee || "0"),
          nft: ethers.formatEther(nftFee || "0"),
          currency: info.currency
        };
      } catch (chainError) {
        newFees[selectedChain] = {
          token: "0",
          nft: "0",
          currency: info.currency,
          error: true
        };
        setError(`Error fetching fees for ${info.name}. Please try again.`);
      }

      setFees(newFees);
    } catch (error) {
      setError('Failed to fetch fees. Please try again.');
      toast.error('Error fetching fees');
    } finally {
      setLoading(false);
    }
  };

  const updateFee = async (chainId, type, newFee) => {
    if (!isAdmin) {
      toast.error('Only admin can update fees');
      return;
    }

    if (!newFee || isNaN(newFee)) {
      toast.error('Please enter a valid fee amount');
      return;
    }

    const toastId = toast.loading('Updating fee...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const factoryAddress = type === 'token' 
        ? CHAIN_INFO[chainId].factoryAddress 
        : CHAIN_INFO[chainId].nftFactoryAddress;
      
      const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);

      const tx = await factory.setChainFee(
        chainId,
        ethers.parseEther(newFee.toString())
      );

      await tx.wait();
      toast.success('Fee updated successfully', { id: toastId });
      
      await fetchFees();
    } catch (error) {
      toast.error('Error updating fee. Please try again.', { id: toastId });
    }
  };

  useEffect(() => {
    fetchFees();
    fetchEarnedFees();
    fetchCreatorStats();
  }, [selectedChain]); // Refetch when chain changes

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
        <h1 className="text-xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-400 mt-2">Only admin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Fees Dashboard</h1>
            <button 
              onClick={() => {
                fetchFees();
                fetchEarnedFees();
                fetchCreatorStats();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
          
          {/* Network Selector */}
          <div className="flex gap-4">
            {Object.entries(CHAIN_INFO).map(([chainId, info]) => (
              <button
                key={chainId}
                onClick={() => setSelectedChain(chainId)}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
                  selectedChain === chainId
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222222]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  selectedChain === chainId ? 'bg-white' : 'bg-gray-600'
                }`}></span>
                <span className="font-medium">{info.name}</span>
                <span className="text-xs px-2 py-1 rounded bg-black/30">
                  {info.currency}
                </span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/30 rounded-xl text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">Loading dashboard data...</span>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-xl border border-blue-900/20 p-6">
                <h3 className="text-blue-400 font-medium mb-2">Token Creations</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{creatorStats.totalTokenCreators || 0}</p>
                    <p className="text-sm text-blue-400 mt-1">
                      <span className="text-green-400">+{creatorStats.last24hTokenCreators || 0}</span> in last 24h
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {creatorStats.uniqueTokenCreators || 0} unique creators
                    </p>
                  </div>
                  <svg className="w-12 h-12 text-blue-500/20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 1h6v2H7V5zm8 5.5a.5.5 0 01-.5.5h-7a.5.5 0 010-1h7a.5.5 0 01.5.5zm0 2a.5.5 0 01-.5.5h-7a.5.5 0 010-1h7a.5.5 0 01.5.5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 rounded-xl border border-purple-900/20 p-6">
                <h3 className="text-purple-400 font-medium mb-2">NFT Creations</h3>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{creatorStats.totalNFTCreators || 0}</p>
                    <p className="text-sm text-purple-400 mt-1">
                      <span className="text-green-400">+{creatorStats.last24hNFTCreators || 0}</span> in last 24h
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {creatorStats.uniqueNFTCreators || 0} unique creators
                    </p>
                  </div>
                  <svg className="w-12 h-12 text-purple-500/20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Fees Management */}
            <div className="grid grid-cols-2 gap-6">
              {/* Token Factory Fees */}
              <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-[#0f0f0f] border-b border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">Token Factory Fee</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Earned:</span>
                      <span className="text-green-400 font-medium">
                        {earnedFees[selectedChain]?.token ?? '0'} {CHAIN_INFO[selectedChain].currency}
                      </span>
                      {earnedFees[selectedChain]?.token > 0 && (
                        <button
                          onClick={() => withdrawFees(selectedChain, 'token')}
                          className="ml-2 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.000000000000000001"
                      className="flex-1 bg-[#0a0a0a] border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-900/50 focus:ring-1 focus:ring-blue-900/50 transition-all"
                      value={newFees[`${selectedChain}-token`] ?? fees[selectedChain]?.token ?? ''}
                      onChange={(e) => setNewFees({
                        ...newFees,
                        [`${selectedChain}-token`]: e.target.value
                      })}
                      placeholder={`Current: ${fees[selectedChain]?.token ?? '0'} ${fees[selectedChain]?.currency}`}
                    />
                    <button
                      onClick={() => updateFee(selectedChain, 'token', newFees[`${selectedChain}-token`] ?? fees[selectedChain]?.token)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Fee
                    </button>
                  </div>
                </div>
              </div>

              {/* NFT Factory Fees */}
              <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-[#0f0f0f] border-b border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-white">NFT Factory Fee</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Earned:</span>
                      <span className="text-green-400 font-medium">
                        {earnedFees[selectedChain]?.nft ?? '0'} {CHAIN_INFO[selectedChain].currency}
                      </span>
                      {earnedFees[selectedChain]?.nft > 0 && (
                        <button
                          onClick={() => withdrawFees(selectedChain, 'nft')}
                          className="ml-2 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.000000000000000001"
                      className="flex-1 bg-[#0a0a0a] border border-gray-800/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-900/50 focus:ring-1 focus:ring-blue-900/50 transition-all"
                      value={newFees[`${selectedChain}-nft`] ?? fees[selectedChain]?.nft ?? ''}
                      onChange={(e) => setNewFees({
                        ...newFees,
                        [`${selectedChain}-nft`]: e.target.value
                      })}
                      placeholder={`Current: ${fees[selectedChain]?.nft ?? '0'} ${fees[selectedChain]?.currency}`}
                    />
                    <button
                      onClick={() => updateFee(selectedChain, 'nft', newFees[`${selectedChain}-nft`] ?? fees[selectedChain]?.nft)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Fee
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Lists */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* Token Transactions */}
              <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-[#0f0f0f] border-b border-gray-800/50">
                  <h2 className="text-lg font-medium text-white">Recent Token Creations</h2>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400">
                          <th className="px-4 py-2">Creator</th>
                          <th className="px-4 py-2">Time</th>
                          <th className="px-4 py-2">Tx Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.tokens.map((tx) => (
                          <tr key={tx.hash} className="border-t border-gray-800/50 text-sm">
                            <td className="px-4 py-3">
                              <a 
                                href={`${selectedChain === "1301" 
                                  ? "https://unichain-sepolia.blockscout.com/address/" 
                                  : "https://moonwalker-blockscout.eu-north-2.gateway.fm/address/"}${tx.creator}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {tx.creator.slice(0, 6)}...{tx.creator.slice(-4)}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {new Date(tx.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <a 
                                href={`${selectedChain === "1301" 
                                  ? "https://unichain-sepolia.blockscout.com/tx/" 
                                  : "https://moonwalker-blockscout.eu-north-2.gateway.fm/tx/"}${tx.hash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* NFT Transactions */}
              <div className="bg-[#111111] rounded-xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-[#0f0f0f] border-b border-gray-800/50">
                  <h2 className="text-lg font-medium text-white">Recent NFT Creations</h2>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-400">
                          <th className="px-4 py-2">Creator</th>
                          <th className="px-4 py-2">Time</th>
                          <th className="px-4 py-2">Tx Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.nfts.map((tx) => (
                          <tr key={tx.hash} className="border-t border-gray-800/50 text-sm">
                            <td className="px-4 py-3">
                              <a 
                                href={`${selectedChain === "1301" 
                                  ? "https://unichain-sepolia.blockscout.com/address/" 
                                  : "https://moonwalker-blockscout.eu-north-2.gateway.fm/address/"}${tx.creator}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {tx.creator.slice(0, 6)}...{tx.creator.slice(-4)}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-gray-400">
                              {new Date(tx.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <a 
                                href={`${selectedChain === "1301" 
                                  ? "https://unichain-sepolia.blockscout.com/tx/" 
                                  : "https://moonwalker-blockscout.eu-north-2.gateway.fm/tx/"}${tx.hash}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                              >
                                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeesTracker; 