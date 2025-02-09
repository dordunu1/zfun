import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import TokenFactoryABI from '../contracts/TokenFactory.json';

export default function LiquidityModal({ isOpen, onClose, tokenAddress, tokenName, tokenSymbol, totalSupply, onSuccess }) {
  const [tokenAmount, setTokenAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState('365');
  const { chain } = useNetwork();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLiquidity = async () => {
    if (!tokenAmount || !ethAmount) {
      toast.error('Please enter both token and ETH amounts');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Get router address based on current chain
      let routerAddress;
      switch (chain?.id) {
        case 11155111: // Sepolia
          routerAddress = import.meta.env.VITE_ROUTER_ADDRESS_11155111;
          break;
        case 1301: // Unichain
          routerAddress = import.meta.env.VITE_ROUTER_ADDRESS_1301;
          break;
        case 137: // Polygon
          routerAddress = import.meta.env.VITE_ROUTER_ADDRESS_137;
          break;
        default:
          throw new Error('Unsupported network');
      }

      console.log('Using router address:', routerAddress);

      // Get token contract with full ABI for proper approval and exclusions
      const tokenContract = new ethers.Contract(
        tokenAddress,
        [
          'function approve(address spender, uint256 amount) public returns (bool)',
          'function allowance(address owner, address spender) public view returns (uint256)',
          'function balanceOf(address account) public view returns (uint256)',
          'function decimals() public view returns (uint8)',
          'function owner() public view returns (address)',
          'function excludeFromFees(address account, bool excluded) public',
          'function excludeFromLimits(address account, bool excluded) public',
          'function tradingEnabled() public view returns (bool)',
          'function enableTrading() public'
        ],
        signer
      );

      // Convert amounts to Wei
      const decimals = await tokenContract.decimals();
      const tokenAmountWei = ethers.parseUnits(tokenAmount, decimals);
      const ethAmountWei = ethers.parseEther(ethAmount);

      // Check token balance
      const balance = await tokenContract.balanceOf(await signer.getAddress());
      if (balance.lt(tokenAmountWei)) {
        throw new Error('Insufficient token balance');
      }

      // Check if trading is enabled and enable it if we're the owner
      try {
        const isOwner = (await tokenContract.owner()).toLowerCase() === (await signer.getAddress()).toLowerCase();
        const isTradingEnabled = await tokenContract.tradingEnabled();
        
        if (!isTradingEnabled && isOwner) {
          console.log('Enabling trading...');
          const enableTx = await tokenContract.enableTrading();
          await enableTx.wait();
          console.log('Trading enabled');
        }
      } catch (error) {
        console.warn('Could not check/enable trading:', error);
      }

      // Ensure the router is excluded from fees and limits
      try {
        const isOwner = (await tokenContract.owner()).toLowerCase() === (await signer.getAddress()).toLowerCase();
        if (isOwner) {
          console.log('Excluding router from fees and limits...');
          await tokenContract.excludeFromFees(routerAddress, true);
          await tokenContract.excludeFromLimits(routerAddress, true);
        }
      } catch (error) {
        console.warn('Could not exclude router from fees/limits:', error);
      }

      // Check current allowance
      const currentAllowance = await tokenContract.allowance(await signer.getAddress(), routerAddress);
      
      // If current allowance is less than needed amount, approve
      if (currentAllowance.lt(tokenAmountWei)) {
        console.log('Approving router to spend tokens...');
        const approveTx = await tokenContract.approve(routerAddress, ethers.MaxUint256);
        console.log('Approval transaction:', approveTx.hash);
        const approvalReceipt = await approveTx.wait();
        console.log('Approval confirmed:', approvalReceipt);
      } else {
        console.log('Router already has sufficient allowance');
      }

      // Get router contract with full interface
      const routerContract = new ethers.Contract(
        routerAddress,
        [
          'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)',
          'function WETH() external pure returns (address)',
          'function factory() external pure returns (address)'
        ],
        signer
      );

      // Add liquidity with a longer deadline and slippage protection
      const slippage = 50; // 50% slippage for initial liquidity
      const amountTokenMin = tokenAmountWei.mul(100 - slippage).div(100);
      const amountETHMin = ethAmountWei.mul(100 - slippage).div(100);

      console.log('Adding liquidity with params:', {
        token: tokenAddress,
        amountTokenDesired: tokenAmountWei.toString(),
        amountTokenMin: amountTokenMin.toString(),
        amountETHMin: amountETHMin.toString(),
        to: await signer.getAddress(),
        value: ethAmountWei.toString()
      });

      const tx = await routerContract.addLiquidityETH(
        tokenAddress,
        tokenAmountWei,
        amountTokenMin,
        amountETHMin,
        await signer.getAddress(),
        Math.floor(Date.now() / 1000) + 1200, // 20 minutes deadline
        { value: ethAmountWei }
      );

      console.log('Liquidity transaction submitted:', tx.hash);
      const receipt = await tx.wait();
      console.log('Liquidity transaction confirmed:', receipt);

      toast.success('Liquidity added successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding liquidity:', error);
      const errorMessage = error.message || 'Failed to add liquidity';
      // Clean up the error message for better user experience
      const cleanError = errorMessage.includes('execution reverted') 
        ? errorMessage.split('execution reverted:')[1]?.trim() || errorMessage
        : errorMessage;
      toast.error(cleanError);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!tokenAmount || !ethAmount) return '0';
    return (parseFloat(ethAmount) / parseFloat(tokenAmount)).toFixed(8);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[99999]">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a1b1f] p-6 text-left align-middle shadow-xl transition-all">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Add Initial Liquidity
            <div className="mt-1 text-sm font-normal text-gray-500">
              {tokenSymbol} ({tokenName})
            </div>
          </Dialog.Title>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Token Amount
              </label>
              <input
                type="text"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#2d2f36] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                placeholder="Enter token amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ETH Amount
              </label>
              <input
                type="text"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#2d2f36] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                placeholder="Enter ETH amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lock Period (days)
              </label>
              <input
                type="number"
                value={lockPeriod}
                onChange={(e) => setLockPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-[#2d2f36] focus:outline-none focus:ring-2 focus:ring-[#00ffbd]"
                placeholder="Enter lock period in days"
              />
            </div>

            <div className="bg-gray-50 dark:bg-[#2d2f36] rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Initial Token Price: {calculatePrice()} ETH per token
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLiquidity}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-black bg-[#00ffbd] rounded-lg hover:bg-[#00e6a9] focus:outline-none focus:ring-2 focus:ring-[#00ffbd] disabled:opacity-50"
              >
                {isLoading ? 'Adding Liquidity...' : 'Add Liquidity'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 