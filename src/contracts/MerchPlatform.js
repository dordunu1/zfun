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
  "function createOrder(address _seller, address _token, uint256 _amount) external",
  "function requestWithdrawal(address _token, uint256 _amount) external",
  "function approveWithdrawal(address _seller, address _token, uint256 _amount) external",
  "function withdrawPlatformFees(address _token, uint256 _amount) external",
  "function pause() external",
  "function unpause() external",
  "function owner() external view returns (address)",
  "function paused() external view returns (bool)",
  "function sellerBalances(address seller, address token) external view returns (uint256)",
  "function platformBalance(address token) external view returns (uint256)",
  "function platformFees(address token) external view returns (uint256)",
  "event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, address token, uint256 amount)",
  "event WithdrawalRequested(address indexed seller, address token, uint256 amount)",
  "event WithdrawalApproved(address indexed seller, address token, uint256 amount)",
  "event PlatformFeeUpdated(uint256 newFee)"
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