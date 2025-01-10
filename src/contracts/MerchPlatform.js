import { ethers } from 'ethers';

export const NETWORK_NAMES = {
  '1301': 'Unichain Sepolia',
  '137': 'Polygon Mainnet'
};

export const SUPPORTED_TOKENS = {
  '1301': {
    'USDT': import.meta.env.VITE_UNICHAIN_USDT_ADDRESS,
    'USDC': import.meta.env.VITE_UNICHAIN_USDC_ADDRESS
  },
  '137': {
    'USDT': import.meta.env.VITE_USDT_ADDRESS_POLYGON,
    'USDC': import.meta.env.VITE_USDC_ADDRESS_POLYGON
  }
};

export const ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "orderId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "buyer", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "seller", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "OrderCreated",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "address","name": "_seller","type": "address"},
      {"internalType": "address","name": "_token","type": "address"},
      {"internalType": "uint256","name": "_amount","type": "uint256"}
    ],
    "name": "createOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "_token","type": "address"},
      {"internalType": "uint256","name": "_amount","type": "uint256"}
    ],
    "name": "requestWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "_seller","type": "address"},
      {"internalType": "address","name": "_token","type": "address"},
      {"internalType": "uint256","name": "_amount","type": "uint256"}
    ],
    "name": "approveWithdrawal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256","name": "_orderId","type": "uint256"},
      {"internalType": "address","name": "_buyer","type": "address"},
      {"internalType": "address","name": "_seller","type": "address"},
      {"internalType": "uint256","name": "_amount","type": "uint256"}
    ],
    "name": "processRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address","name": "","type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool","name": "","type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address","name": "","type": "address"},{"internalType": "address","name": "","type": "address"}],
    "name": "sellerBalances",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "name": "orders",
    "outputs": [
      {"internalType": "uint256","name": "orderId","type": "uint256"},
      {"internalType": "address","name": "buyer","type": "address"},
      {"internalType": "address","name": "seller","type": "address"},
      {"internalType": "address","name": "token","type": "address"},
      {"internalType": "uint256","name": "amount","type": "uint256"},
      {"internalType": "bool","name": "isCompleted","type": "bool"},
      {"internalType": "uint256","name": "timestamp","type": "uint256"},
      {"internalType": "bool","name": "isRefunded","type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "_token","type": "address"},
      {"internalType": "uint256","name": "_amount","type": "uint256"}
    ],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const getContractAddress = (chainId) => {
  const envKey = `VITE_MERCH_PLATFORM_ADDRESS_${chainId}`;
  const address = import.meta.env[envKey];
  if (!address) {
    console.warn(`No contract address found for chain ${chainId}. Make sure ${envKey} is set in your .env file.`);
    return null;
  }
  return address;
};

export const getMerchPlatformContract = (provider, chainId) => {
  try {
    const address = getContractAddress(chainId);
    if (!address) {
      return null;
    }
    
    if (!ethers.isAddress(address)) {
      console.warn(`Invalid contract address for chain ${chainId}: ${address}`);
      return null;
    }

    const contract = new ethers.Contract(address, ABI, provider);
    Object.defineProperty(contract, 'address', {
      value: address,
      writable: false,
      configurable: false
    });
    return contract;
  } catch (error) {
    console.warn(`Error creating contract instance for chain ${chainId}:`, error);
    return null;
  }
};

export const getTokenContract = (provider, chainId, tokenSymbol) => {
  const tokenAddress = SUPPORTED_TOKENS[chainId]?.[tokenSymbol];
  if (!tokenAddress) throw new Error(`Unsupported token ${tokenSymbol} on chain ${chainId}`);
  if (!ethers.isAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }

  const tokenABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)"
  ];

  const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
  Object.defineProperty(contract, 'address', {
    value: tokenAddress,
    writable: false,
    configurable: false
  });
  return contract;
};

export const formatTokenAmount = (amount, decimals = 6) => {
  return ethers.formatUnits(amount, decimals);
};

export const parseTokenAmount = (amount, decimals = 6) => {
  return ethers.parseUnits(amount.toString(), decimals);
};

export const getPlatformBalances = async (contract, network) => {
  try {
    const tokens = SUPPORTED_TOKENS[network];
    const balances = {};
    
    for (const [symbol, address] of Object.entries(tokens)) {
      const totalBalance = await contract.platformBalance(address);
      const fees = await contract.platformFees(address);
      
      balances[symbol] = {
        total: parseFloat(formatTokenAmount(totalBalance)),
        fees: parseFloat(formatTokenAmount(fees)),
        available: parseFloat(formatTokenAmount(totalBalance.sub(fees)))
      };
    }
    
    return balances;
  } catch (error) {
    console.error('Error getting platform balances:', error);
    return null;
  }
}; 