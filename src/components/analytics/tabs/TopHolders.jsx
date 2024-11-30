import React, { useState, useEffect } from 'react';
import { FaEthereum, FaCrown } from 'react-icons/fa';
import { BiCopy } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { getTopHolders, getEthPrice } from '../../../services/analytics';
import { useParams } from 'react-router-dom';

const RANK_COLORS = {
  1: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/50',
  2: 'from-gray-400/20 to-gray-400/5 border-gray-400/50',
  3: 'from-orange-500/20 to-orange-500/5 border-orange-500/50',
  default: 'from-[#00ffbd]/20 to-[#00ffbd]/5 border-[#00ffbd]/50'
};

export default function TopHolders() {
  const { symbol } = useParams();
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [holdersData, usdPrice] = await Promise.all([
          getTopHolders(symbol),
          getEthPrice()
        ]);
        setHolders(holdersData);
        setEthPrice(usdPrice);
      } catch (error) {
        console.error('Error loading holders:', error);
        toast.error('Failed to load top holders');
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

  const getBadgeText = (rank) => {
    switch (rank) {
      case 1: return 'GIGACHAD';
      case 2: return 'CHAD';
      case 3: return 'BASED';
      default: return 'HOLDER';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  const totalQuantity = holders.reduce((sum, holder) => sum + holder.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Unique Holders</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{holders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Top 10 Hold</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {((holders.slice(0, 10).reduce((sum, h) => sum + h.quantity, 0) / totalQuantity) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Avg. Per Holder</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(totalQuantity / holders.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Holders List */}
      <div className="space-y-4">
        {holders.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No holders data yet
          </div>
        ) : (
          holders.map((holder, index) => (
            <div 
              key={holder.address} 
              className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-500 dark:text-gray-400">#{index + 1}</span>
                <div>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {holder.quantity} NFTs
                  </div>
                </div>
              </div>
              <div className="text-[#00ffbd]">{holder.percentage}%</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 