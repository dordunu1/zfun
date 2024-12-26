import { ethers } from 'ethers';

// Bridge contract ABI - only the functions we need for estimation
const BRIDGE_ABI = [
  {"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"stateMutability":"payable","type":"fallback"},
  {"inputs":[],"name":"getImplementation","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes","name":"_code","type":"bytes"}],"name":"setCode","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"bytes32","name":"_value","type":"bytes32"}],"name":"setStorage","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"stateMutability":"payable","type":"receive"}
];

// Network-specific configurations
export const GAS_CONFIG = {
  sepolia: {
    bridgeAddress: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
    bufferMultiplier: 1.2, // 20% buffer
    minGasPrice: BigInt(20_000_000_000), // 20 gwei
    maxGasPrice: BigInt(100_000_000_000), // 100 gwei
    name: 'Sepolia'
  },
  unichain: {
    bridgeAddress: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
    bufferMultiplier: 1.3, // 30% buffer
    minGasPrice: BigInt(1_000_000_000), // 1 gwei
    maxGasPrice: BigInt(50_000_000_000), // 50 gwei
    name: 'Unichain Sepolia'
  }
};

// Cache storage
const estimationCache = new Map();

export class BridgeGasEstimator {
  constructor(provider, network) {
    this.provider = provider;
    this.network = network;
    this.config = GAS_CONFIG[network];
    
    // Initialize contract interface
    this.bridgeContract = new ethers.Contract(
      this.config.bridgeAddress,
      BRIDGE_ABI,
      this.provider
    );
  }

  async estimateGasFee(amount) {
    try {
      // Check cache first
      const cachedEstimate = this.getCachedEstimate();
      if (cachedEstimate) {
        return cachedEstimate;
      }

      // Get current gas price
      const gasPrice = await this.getCurrentGasPrice();
      
      // Simulate the actual bridge transaction
      const simulatedGas = await this.simulateBridgeTransaction(amount);
      
      // Calculate total gas cost (gas price * gas limit)
      const totalGasCost = gasPrice * simulatedGas;

      // Format the result
      const estimate = {
        gasFee: ethers.formatEther(totalGasCost.toString()),
        gasPrice: gasPrice.toString(),
        estimatedGas: simulatedGas.toString(),
        timestamp: Date.now(),
        confidence: 'high'
      };

      // Cache the result
      this.cacheEstimate(estimate);

      return estimate;
    } catch (error) {
      console.error('Error estimating gas fee:', error);
      return this.getFallbackEstimate();
    }
  }

  async simulateBridgeTransaction(amount) {
    try {
      // Convert amount to wei
      const valueInWei = ethers.parseEther(amount.toString());
      
      // For proxy contracts, we need to estimate the gas for a direct transfer
      const estimatedGas = await this.provider.estimateGas({
        to: this.config.bridgeAddress,
        value: valueInWei,
        data: '0x' // Empty data for ETH transfer through fallback/receive
      });

      // Add a buffer for safety
      return estimatedGas + BigInt(50000); // Add 50k gas as buffer
    } catch (error) {
      console.error('Error simulating bridge transaction:', error);
      // Fallback to a conservative estimate if simulation fails
      return BigInt(200000); // Increased conservative fallback
    }
  }

  async getCurrentGasPrice() {
    try {
      // Try EIP-1559 first
      const feeData = await this.provider.getFeeData();
      if (feeData.maxFeePerGas) {
        return feeData.maxFeePerGas;
      }
      
      // Fallback to legacy gas price
      return await this.provider.getGasPrice();
    } catch (error) {
      console.error('Error getting gas price:', error);
      return this.config.minGasPrice;
    }
  }

  clampGasPrice(gasPrice) {
    if (gasPrice < this.config.minGasPrice) {
      return this.config.minGasPrice;
    }
    if (gasPrice > this.config.maxGasPrice) {
      return this.config.maxGasPrice;
    }
    return gasPrice;
  }

  getCachedEstimate() {
    const cached = estimationCache.get(this.network);
    if (cached && Date.now() - cached.timestamp < 30000) { // 30 second cache
      return cached;
    }
    return null;
  }

  cacheEstimate(estimate) {
    estimationCache.set(this.network, estimate);
  }

  getFallbackEstimate() {
    return {
      gasFee: '0.019',
      gasPrice: this.config.minGasPrice.toString(),
      estimatedGas: '150000',
      timestamp: Date.now(),
      confidence: 'low'
    };
  }
}

// Helper function to create estimator instance
export function createBridgeGasEstimator(provider, network) {
  return new BridgeGasEstimator(provider, network);
} 