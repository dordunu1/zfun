import React from 'react';
import { BiSun, BiMoon, BiWallet, BiLogOut } from 'react-icons/bi';
import { useTheme } from '../context/ThemeContext';
import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import NetworkSelector from './NetworkSelector';
import PriceTicker from './PriceTicker';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      // Clear all wallet-related data from localStorage
      localStorage.removeItem('wagmi.connected');
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.account');
      localStorage.removeItem('wagmi.chain');
      localStorage.removeItem('wagmi.network');
      localStorage.removeItem('walletconnect');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 right-0 lg:left-64 left-0 h-16 bg-white dark:bg-[#0d0e12] border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between z-10 transition-all duration-300">
      <PriceTicker />
      
      <div className="flex items-center gap-4">
        {isConnected && <NetworkSelector />}
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-600 dark:text-gray-300"
        >
          {isDarkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
        </button>

        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300">
              {shortenAddress(address)}
            </span>
            <button
              onClick={handleDisconnect}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1b1f] text-gray-600 dark:text-gray-300"
            >
              <BiLogOut size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 px-4 py-2 bg-[#00ffbd] hover:bg-[#00e6a9] text-black font-semibold rounded-lg"
          >
            <BiWallet size={20} />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}