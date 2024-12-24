import React, { useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia, polygon } from 'wagmi/chains';
import { BiChevronDown } from 'react-icons/bi';
import toast from 'react-hot-toast';
import { unichainTestnet } from '../config/wagmi';

// Network configurations with logos and names
const NETWORKS = [
  {
    ...sepolia,
    logo: '/sepolia.png',
    name: 'Sepolia'
  },
  {
    ...polygon,
    logo: '/polygon.png',
    name: 'Polygon'
  },
  {
    ...unichainTestnet,
    logo: '/unichain.png',
    name: 'Unichain Testnet'
  },
  {
    id: 'z-chain',
    logo: '/zchain.png',
    name: 'Z Chain',
    disabled: true
  }
];

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork();

  const currentNetwork = NETWORKS.find(net => net.id === chain?.id) || NETWORKS[0];

  const handleNetworkSwitch = async (network) => {
    if (network.disabled) {
      toast.error('This network is coming soon!');
      setIsOpen(false);
      return;
    }

    if (network.id === chain?.id) {
      setIsOpen(false);
      return;
    }

    try {
      await switchNetwork?.(network.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast.error('Failed to switch network');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-[#1a1b1f] hover:bg-gray-200 dark:hover:bg-[#2d2f36] disabled:opacity-50"
      >
        <img 
          src={currentNetwork.logo} 
          alt={currentNetwork.name}
          className="w-5 h-5 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentNetwork.name}
        </span>
        <BiChevronDown 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 rounded-lg bg-white dark:bg-[#1a1b1f] shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              onClick={() => handleNetworkSwitch(network)}
              disabled={isLoading}
              className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#2d2f36] ${
                network.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${network.id === chain?.id ? 'bg-gray-100 dark:bg-[#2d2f36]' : ''}`}
            >
              <img 
                src={network.logo} 
                alt={network.name}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {network.name}
              </span>
              {network.disabled && (
                <span className="text-xs text-gray-500 ml-auto">Coming Soon</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 