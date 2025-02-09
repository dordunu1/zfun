import { ethers } from 'ethers';
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

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

// Keep track of active listeners and processed transactions to avoid duplicates
const activeListeners = new Map();
const processedTransactions = new Set();

export const trackTokenTransfers = async (tokenAddress, provider) => {
  try {
    // If already tracking this token, don't create another listener
    if (activeListeners.has(tokenAddress)) {
      return;
    }

    const contract = new ethers.Contract(tokenAddress, ERC20_TRANSFER_ABI, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();

    // Get the network to determine chain ID
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Check for any recent transfers (last 10000 blocks)
    const filter = contract.filters.Transfer();
    const startBlock = Math.max(0, latestBlock - 10000);
    
    const events = await contract.queryFilter(filter, startBlock, latestBlock);

    // Save historical transfers
    for (const event of events) {
      const txKey = `${event.transactionHash}-${event.args[0]}-${event.args[1]}-${event.args[2]}`;
      
      // Skip if we've already processed this transaction
      if (processedTransactions.has(txKey)) {
        continue;
      }

      // Get the block to get the timestamp
      const block = await provider.getBlock(event.blockNumber);

      const transfer = {
        tokenAddress,
        fromAddress: event.args[0].toLowerCase(),
        toAddress: event.args[1].toLowerCase(),
        amount: event.args[2].toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000,
        chainId: Number(chainId)
      };

      // Check if this transfer is already recorded
      const existingQuery = query(
        tokenTransfersRef,
        where('transactionHash', '==', transfer.transactionHash),
        where('fromAddress', '==', transfer.fromAddress),
        where('toAddress', '==', transfer.toAddress)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        await addDoc(tokenTransfersRef, transfer);
      }

      // Mark this transaction as processed
      processedTransactions.add(txKey);
    }

    // Set up listener for new transfers
    const listener = contract.on("Transfer", async (from, to, value, event) => {
      const txKey = `${event.transactionHash}-${from}-${to}-${value}`;
      
      // Skip if we've already processed this transaction
      if (processedTransactions.has(txKey)) {
        return;
      }

      // Get the block to get the timestamp
      const block = await provider.getBlock(event.blockNumber);

      const transfer = {
        tokenAddress,
        fromAddress: from.toLowerCase(),
        toAddress: to.toLowerCase(),
        amount: value.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: block.timestamp * 1000,
        chainId: Number(chainId)
      };

      // Check if this transfer is already recorded
      const existingQuery = query(
        tokenTransfersRef,
        where('transactionHash', '==', transfer.transactionHash),
        where('fromAddress', '==', transfer.fromAddress),
        where('toAddress', '==', transfer.toAddress)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        await addDoc(tokenTransfersRef, transfer);
      }

      // Mark this transaction as processed
      processedTransactions.add(txKey);
    });

    activeListeners.set(tokenAddress, listener);

  } catch (error) {
    throw error;
  }
};

export const trackNFTTransfers = async (contractAddress, nftType, provider) => {
  try {
    // If already tracking this NFT contract, don't create another listener
    if (activeListeners.has(contractAddress)) {
      return;
    }

    const abi = nftType === 'ERC1155' ? 
      [...ERC1155_TRANSFER_SINGLE_ABI, ...ERC1155_TRANSFER_BATCH_ABI] : 
      ERC721_TRANSFER_ABI;

    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();

    // Get the network to determine chain ID
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    // Check for any recent transfers (last 10000 blocks)
    const startBlock = Math.max(0, latestBlock - 10000);
    
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
          timestamp: block.timestamp * 1000,
          chainId: Number(chainId)
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
            timestamp: block.timestamp * 1000,
            chainId: Number(chainId)
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
          timestamp: block.timestamp * 1000,
          chainId: Number(chainId)
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
            timestamp: block.timestamp * 1000,
            chainId: Number(chainId)
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
          timestamp: block.timestamp * 1000,
          chainId: Number(chainId)
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
          timestamp: block.timestamp * 1000,
          chainId: Number(chainId)
        };

        await saveNFTTransfer(transfer);
      });

      activeListeners.set(contractAddress, listener);
    }

  } catch (error) {
    throw error;
  }
};

const saveNFTTransfer = async (transfer) => {
  try {
    // Check if this transfer is already recorded
    const existingQuery = query(
      collection(db, 'nftTransfers'),
      where('transactionHash', '==', transfer.transactionHash),
      where('tokenId', '==', transfer.tokenId)
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (existingDocs.empty) {
      await addDoc(collection(db, 'nftTransfers'), transfer);
    }
  } catch (error) {
    throw error;
  }
};

export const getTokenTransfersForAddress = async (address) => {
  try {
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
        timestamp: new Date(data.timestamp)
      };
    });

    const receivedTransfers = receivedSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        type: 'received',
        timestamp: new Date(data.timestamp)
      };
    });

    // Combine and sort by timestamp
    const allTransfers = [...sentTransfers, ...receivedTransfers].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return allTransfers;
  } catch (error) {
    return [];
  }
};

export const getNFTTransfersForAddress = async (address) => {
  try {
    // Query for NFT transfers where address is either sender or receiver
    const sentQuery = query(
      collection(db, 'nftTransfers'),
      where('fromAddress', '==', address.toLowerCase()),
      orderBy('timestamp', 'desc')
    );

    const receivedQuery = query(
      collection(db, 'nftTransfers'),
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
        timestamp: new Date(data.timestamp)
      };
    });

    const receivedTransfers = receivedSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        type: 'received',
        timestamp: new Date(data.timestamp)
      };
    });

    // Combine and sort by timestamp
    const allTransfers = [...sentTransfers, ...receivedTransfers].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return allTransfers;
  } catch (error) {
    return [];
  }
}; 