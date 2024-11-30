import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getChadMinters, getEthPrice } from '../../../services/analytics';
import { useParams } from 'react-router-dom';

const RANK_EMOJIS = ['🏆', '🥈', '🥉'];

export default function ChadMinters() {
  const { symbol } = useParams();
  const [minters, setMinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mintersData, usdPrice] = await Promise.all([
          getChadMinters(symbol),
          getEthPrice()
        ]);
        setMinters(mintersData);
        setEthPrice(usdPrice);
      } catch (error) {
        console.error('Error loading minters:', error);
        toast.error('Failed to load chad minters');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  const totalMinted = minters.reduce((sum, minter) => sum + minter.totalMinted, 0);

  return (
    <div className="space-y-4">
      {minters.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No minting data yet
        </div>
      ) : (
        minters.map((minter, index) => (
          <div 
            key={minter.address} 
            className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
              <div>
                <div className="text-gray-900 dark:text-white font-medium">
                  {minter.address.slice(0, 6)}...{minter.address.slice(-4)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {minter.totalMinted} NFTs minted
                </div>
              </div>
            </div>
            <div className="text-[#00ffbd]">{formatEther(minter.totalValue)} ETH</div>
          </div>
        ))
      )}
    </div>
  );
} 