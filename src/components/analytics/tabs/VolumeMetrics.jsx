import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { getVolumeMetrics, getEthPrice } from '../../../services/analytics';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const TIME_RANGES = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: 'All', value: 'all' }
];

export default function VolumeMetrics() {
  const { symbol } = useParams();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ethPrice, setEthPrice] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, usdPrice] = await Promise.all([
          getVolumeMetrics(symbol, timeRange),
          getEthPrice()
        ]);
        setMetrics(metricsData);
        setEthPrice(usdPrice);
      } catch (error) {
        console.error('Error loading volume metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

  // Calculate summary metrics
  const totalVolume = metrics.reduce((sum, m) => sum + m.volume, 0);
  const totalTransactions = metrics.reduce((sum, m) => sum + m.transactions, 0);
  const avgPrice = totalVolume / totalTransactions || 0;

  // Format data for charts
  const chartData = metrics.map(m => ({
    date: m.timestamp.toDate(),
    volume: m.volume,
    transactions: m.transactions,
    avgPrice: m.volume / m.transactions || 0
  }));

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {TIME_RANGES.map(range => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              timeRange === range.value
                ? 'bg-[#00ffbd] text-black font-medium'
                : 'bg-[#1a1b1f] text-gray-400 hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Total Volume</div>
          <div className="flex items-center text-2xl font-bold text-white">
            <FaEthereum className="mr-1" size={20} />
            {totalVolume.toFixed(2)}
            {ethPrice && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (${(totalVolume * ethPrice).toLocaleString()})
              </span>
            )}
          </div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Transactions</div>
          <div className="text-2xl font-bold text-white">{totalTransactions}</div>
        </div>
        <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
          <div className="text-sm text-gray-400 mb-1">Avg. Price</div>
          <div className="flex items-center text-2xl font-bold text-white">
            <FaEthereum className="mr-1" size={20} />
            {avgPrice.toFixed(3)}
            {ethPrice && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (${(avgPrice * ethPrice).toLocaleString()})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Volume</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ffbd" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ffbd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={date => format(date, timeRange === '24h' ? 'HH:mm' : 'MMM dd')}
                stroke="#4b5563"
              />
              <YAxis
                stroke="#4b5563"
                tickFormatter={value => `${value.toFixed(2)} Ξ`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelFormatter={date => format(date, 'MMM dd, yyyy HH:mm')}
                formatter={value => [`${value.toFixed(2)} Ξ`, 'Volume']}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#00ffbd"
                strokeWidth={2}
                fill="url(#volumeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Chart */}
      <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Transactions</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ffbd" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ffbd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={date => format(date, timeRange === '24h' ? 'HH:mm' : 'MMM dd')}
                stroke="#4b5563"
              />
              <YAxis stroke="#4b5563" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelFormatter={date => format(date, 'MMM dd, yyyy HH:mm')}
                formatter={value => [value, 'Transactions']}
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#00ffbd"
                strokeWidth={2}
                fill="url(#txGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Price Chart */}
      <div className="bg-[#1a1b1f] rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Average Price</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ffbd" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ffbd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={date => format(date, timeRange === '24h' ? 'HH:mm' : 'MMM dd')}
                stroke="#4b5563"
              />
              <YAxis
                stroke="#4b5563"
                tickFormatter={value => `${value.toFixed(3)} Ξ`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
                labelFormatter={date => format(date, 'MMM dd, yyyy HH:mm')}
                formatter={value => [`${value.toFixed(3)} Ξ`, 'Avg. Price']}
              />
              <Area
                type="monotone"
                dataKey="avgPrice"
                stroke="#00ffbd"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">No volume data available</div>
        </div>
      )}
    </div>
  );
} 