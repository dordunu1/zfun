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
    <div className="space-y-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Unique Holders</div>
          <div className="text-2xl font-bold text-white">{holders.length}</div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Top 10 Hold</div>
          <div className="text-2xl font-bold text-white">
            {((holders.slice(0, 10).reduce((sum, h) => sum + h.quantity, 0) / totalQuantity) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Avg. Per Holder</div>
          <div className="text-2xl font-bold text-white">
            {(totalQuantity / holders.length).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Holders List */}
      <div className="space-y-3">
        {holders.map((holder, index) => {
          const rank = index + 1;
          const percentage = (holder.quantity / totalQuantity) * 100;
          
          return (
            <div 
              key={holder.address}
              className={`
                relative group rounded-lg p-4 border
                transition-all duration-200
                bg-gradient-to-r
                ${RANK_COLORS[rank] || RANK_COLORS.default}
              `}
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ffbd]/0 via-[#00ffbd]/5 to-[#00ffbd]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-xl -z-10" />

              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm">
                  <span className="text-lg font-bold text-[#00ffbd]">#{rank}</span>
                </div>

                {/* Holder Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => copyToClipboard(holder.address)}
                      className="text-sm text-white hover:text-[#00ffbd] transition-colors flex items-center gap-1 group/address"
                    >
                      {holder.address}
                      <BiCopy className="opacity-0 group-hover/address:opacity-100 transition-opacity" size={14} />
                    </button>

                    {/* Badge */}
                    <div className="group/badge relative">
                      <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border border-[#00ffbd]/30">
                        <FaCrown className="inline-block mr-1" size={12} />
                        {getBadgeText(rank)}
                      </div>
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-black/90 text-white text-xs opacity-0 group-hover/badge:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {rank <= 3 ? 'CHAD Alert! 🚀' : 'Keep Stacking! 💪'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <span>Quantity:</span>
                      <span className="text-white">{holder.quantity}</span>
                    </div>
                    {ethPrice && holder.value && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <span>Value:</span>
                        <div className="flex items-center text-white">
                          <FaEthereum size={14} className="mr-1" />
                          {holder.value.toFixed(2)}
                          <span className="text-gray-500 ml-1">
                            (${(holder.value * ethPrice).toLocaleString()})
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="text-gray-400">
                      <span>Share: </span>
                      <span className="text-white">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00ffbd] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {holders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400">No holders data yet</div>
          </div>
        )}
      </div>

      {holders.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="px-4 py-2 text-sm text-[#00ffbd] bg-[#00ffbd]/10 rounded-lg hover:bg-[#00ffbd]/20 transition-colors">
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 