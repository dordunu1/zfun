import { ethers } from 'ethers';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const tokenTransfersRef = collection(db, 'tokenTransfers');

// ERC20 Transfer event interface
const ERC20_TRANSFER_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// NFT Transfer event interfaces
const ERC721_TRANSFER_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

const ERC1155_TRANSFER_SINGLE_ABI = [
  "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)"
];

const ERC1155_TRANSFER_BATCH_ABI = [
  "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)"
];

// Keep track of active listeners to avoid duplicates
const activeListeners = new Map();

export const trackTokenTransfers = async (tokenAddress, provider) => {
  try {
    // If already tracking this token, don't create another listener
    if (activeListeners.has(tokenAddress)) {
      console.log('Already tracking transfers for token:', tokenAddress);
      return;
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_TRANSFER_ABI, provider);
    console.log('Setting up transfer tracking for token:', tokenAddress);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log('Current block number:', latestBlock);

    // Check for any recent transfers (last 10000 blocks)
    const filter = contract.filters.Transfer();
    const startBlock = Math.max(0, latestBlock - 10000);
    console.log('Checking historical transfers from block:', startBlock);
    
    const events = await contract.queryFilter(filter, startBlock, latestBlock);
    console.log('Found historical transfers:', events.length);

    // Save historical transfers
    for (const event of events) {
      // Get the block to get the timestamp
      const block = await provider.getBlock(event.blockNumber);

      const transfer = {
        tokenAddress,
        fromAddress: event.args[0].toLowerCase(),
        toAddress: event.args[1].toLowerCase(),
        amount: event.args[2].toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000 // Store Etherscan timestamp in milliseconds
      };

      // Check if this transfer is already recorded
      const existingQuery = query(
        tokenTransfersRef,
        where('transactionHash', '==', transfer.transactionHash)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        await addDoc(tokenTransfersRef, transfer);
        console.log('Saved historical transfer:', transfer);
      }
    }

    // Set up listener for new transfers
    const listener = contract.on("Transfer", async (from, to, value, event) => {
      // Get the block to get the timestamp
      const block = await provider.getBlock(event.blockNumber);

      const transfer = {
        tokenAddress,
        fromAddress: from.toLowerCase(),
        toAddress: to.toLowerCase(),
        amount: value.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000 // Store Etherscan timestamp in milliseconds
      };

      // Check if this transfer is already recorded
      const existingQuery = query(
        tokenTransfersRef,
        where('transactionHash', '==', transfer.transactionHash)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        await addDoc(tokenTransfersRef, transfer);
        console.log('Saved new transfer:', transfer);
      }
    });

    activeListeners.set(tokenAddress, listener);
    console.log('Transfer tracking initialized for token:', tokenAddress);

  } catch (error) {
    console.error('Error tracking token transfers:', error);
  }
};

export const trackNFTTransfers = async (contractAddress, nftType, provider) => {
  try {
    // If already tracking this NFT contract, don't create another listener
    if (activeListeners.has(contractAddress)) {
      console.log('Already tracking transfers for NFT:', contractAddress);
      return;
    }

    const abi = nftType === 'ERC1155' ? 
      [...ERC1155_TRANSFER_SINGLE_ABI, ...ERC1155_TRANSFER_BATCH_ABI] : 
      ERC721_TRANSFER_ABI;

    const contract = new ethers.Contract(contractAddress, abi, provider);
    console.log('Setting up transfer tracking for NFT:', contractAddress);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log('Current block number:', latestBlock);

    // Check for any recent transfers (last 10000 blocks)
    const startBlock = Math.max(0, latestBlock - 10000);
    console.log('Checking historical transfers from block:', startBlock);
    
    if (nftType === 'ERC1155') {
      // Handle ERC1155 historical transfers
      const singleFilter = contract.filters.TransferSingle();
      const batchFilter = contract.filters.TransferBatch();
      
      const [singleEvents, batchEvents] = await Promise.all([
        contract.queryFilter(singleFilter, startBlock, latestBlock),
        contract.queryFilter(batchFilter, startBlock, latestBlock)
      ]);

      // Process single transfers
      for (const event of singleEvents) {
        const block = await provider.getBlock(event.blockNumber);
        const transfer = {
          contractAddress,
          fromAddress: event.args[1].toLowerCase(),
          toAddress: event.args[2].toLowerCase(),
          tokenId: event.args[3].toString(),
          amount: event.args[4].toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000
        };

        await saveNFTTransfer(transfer);
      }

      // Process batch transfers
      for (const event of batchEvents) {
        const block = await provider.getBlock(event.blockNumber);
        const ids = event.args[3];
        const amounts = event.args[4];
        
        for (let i = 0; i < ids.length; i++) {
          const transfer = {
            contractAddress,
            fromAddress: event.args[1].toLowerCase(),
            toAddress: event.args[2].toLowerCase(),
            tokenId: ids[i].toString(),
            amount: amounts[i].toString(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: block.timestamp * 1000
          };

          await saveNFTTransfer(transfer);
        }
      }

      // Set up listeners for new transfers
      const singleListener = contract.on("TransferSingle", async (operator, from, to, id, value, event) => {
        const block = await provider.getBlock(event.blockNumber);
        const transfer = {
          contractAddress,
          fromAddress: from.toLowerCase(),
          toAddress: to.toLowerCase(),
          tokenId: id.toString(),
          amount: value.toString(),
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000
        };

        await saveNFTTransfer(transfer);
      });

      const batchListener = contract.on("TransferBatch", async (operator, from, to, ids, values, event) => {
        const block = await provider.getBlock(event.blockNumber);
        for (let i = 0; i < ids.length; i++) {
          const transfer = {
            contractAddress,
            fromAddress: from.toLowerCase(),
            toAddress: to.toLowerCase(),
            tokenId: ids[i].toString(),
            amount: values[i].toString(),
            transactionHash: event.transactionHash,
            blockNumber: event.blockNumber,
            timestamp: block.timestamp * 1000
          };

          await saveNFTTransfer(transfer);
        }
      });

      activeListeners.set(contractAddress, [singleListener, batchListener]);
    } else {
      // Handle ERC721 transfers
      const filter = contract.filters.Transfer();
      const events = await contract.queryFilter(filter, startBlock, latestBlock);

      for (const event of events) {
        const block = await provider.getBlock(event.blockNumber);
        const transfer = {
          contractAddress,
          fromAddress: event.args[0].toLowerCase(),
          toAddress: event.args[1].toLowerCase(),
          tokenId: event.args[2].toString(),
          amount: '1',
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000
        };

        await saveNFTTransfer(transfer);
      }

      // Set up listener for new transfers
      const listener = contract.on("Transfer", async (from, to, tokenId, event) => {
        const block = await provider.getBlock(event.blockNumber);
        const transfer = {
          contractAddress,
          fromAddress: from.toLowerCase(),
          toAddress: to.toLowerCase(),
          tokenId: tokenId.toString(),
          amount: '1',
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          timestamp: block.timestamp * 1000
        };

        await saveNFTTransfer(transfer);
      });

      activeListeners.set(contractAddress, listener);
    }

    console.log('Transfer tracking initialized for NFT:', contractAddress);
  } catch (error) {
    console.error('Error tracking NFT transfers:', error);
  }
};

const saveNFTTransfer = async (transfer) => {
  try {
    // Check if this transfer is already recorded using a more efficient query
    const existingQuery = query(
      collection(db, 'nftTransfers'),
      where('transactionHash', '==', transfer.transactionHash),
      where('tokenId', '==', transfer.tokenId),
      limit(1) // Limit to 1 since we only need to know if it exists
    );
    
    const existingDoc = await getDocs(existingQuery)
      .catch(err => {
        console.log('Error checking existing transfer, skipping save');
        return { empty: false }; // Prevent save attempt on error
      });
    
    if (existingDoc.empty) {
      await addDoc(collection(db, 'nftTransfers'), {
        ...transfer,
        timestamp: transfer.timestamp || new Date().getTime() // Ensure timestamp exists
      }).catch(err => {
        console.log('Error saving transfer, will be retried next time');
      });
    }
  } catch (error) {
    // Log error but don't throw - this allows the app to continue functioning
    console.error('Error in saveNFTTransfer:', error);
  }
};

export const getTokenTransfersForAddress = async (address) => {
  try {
    console.log('Getting transfers for address:', address);
    // Query for transfers where address is either sender or receiver
    const sentQuery = query(
      tokenTransfersRef,
      where('fromAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const receivedQuery = query(
      tokenTransfersRef,
      where('toAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery),
      getDocs(receivedQuery)
    ]);

    const sentTransfers = sentSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        type: 'sent',
        timestamp: new Date(data.timestamp) // Convert timestamp to Date
      };
    });

    const receivedTransfers = receivedSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        type: 'received',
        timestamp: new Date(data.timestamp) // Convert timestamp to Date
      };
    });

    // Combine and sort by timestamp
    const allTransfers = [...sentTransfers, ...receivedTransfers].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    console.log('Found transfers:', allTransfers);
    return allTransfers;
  } catch (error) {
    console.error('Error getting token transfers:', error);
    return [];
  }
};

export const getNFTTransfersForAddress = async (address) => {
  try {
    console.log('Getting NFT transfers for address:', address);
    
    // Create batch queries with limits to improve performance
    const sentQuery = query(
      collection(db, 'nftTransfers'),
      where('fromAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc'),
      limit(50) // Limit to most recent 50 transfers
    );

    const receivedQuery = query(
      collection(db, 'nftTransfers'),
      where('toAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc'),
      limit(50) // Limit to most recent 50 transfers
    );

    // Load transfers in parallel
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(sentQuery).catch(err => {
        console.log('Error fetching sent transfers, continuing with empty result');
        return { docs: [] };
      }),
      getDocs(receivedQuery).catch(err => {
        console.log('Error fetching received transfers, continuing with empty result');
        return { docs: [] };
      })
    ]);

    // Process results
    const transfers = [];

    // Add sent transfers
    sentSnapshot.docs.forEach(doc => {
      const data = doc.data();
      transfers.push({
        id: doc.id,
        ...data,
        type: 'sent',
        timestamp: new Date(data.timestamp)
      });
    });

    // Add received transfers
    receivedSnapshot.docs.forEach(doc => {
      const data = doc.data();
      transfers.push({
        id: doc.id,
        ...data,
        type: 'received',
        timestamp: new Date(data.timestamp)
      });
    });

    // Sort by timestamp
    transfers.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    console.log(`Loaded ${transfers.length} NFT transfers`);
    return transfers;
  } catch (error) {
    console.error('Error getting NFT transfers:', error);
    return []; // Return empty array on error
  }
}; 