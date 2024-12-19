import React, { useState, useEffect } from 'react';
import { FaEthereum } from 'react-icons/fa';
import { getVolumeMetrics } from '../../../services/analytics';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useTokenPrices } from '../../../hooks/useTokenPrices';

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
  const [timeRange, setTimeRange] = useState('7d');
  const { prices } = useTokenPrices();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const metricsData = await getVolumeMetrics(symbol, timeRange);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error loading volume metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, timeRange]);

  // Calculate USD values using ETH price from Chainlink
  const calculateUSDValue = (ethAmount) => {
    if (!ethAmount || !prices.ETH) return 0;
    return ethAmount * prices.ETH;
  };

  // Calculate summary metrics with USD values
  const totalVolumeUSD = metrics.reduce((sum, m) => sum + calculateUSDValue(m.volume), 0);
  const totalTransactions = metrics.reduce((sum, m) => sum + m.transactions, 0);
  const avgPriceUSD = totalVolumeUSD / totalTransactions || 0;

  // Format data for charts with USD values
  const chartData = metrics.map(m => ({
    date: m.timestamp.toDate(),
    volumeUSD: calculateUSDValue(m.volume),
    volume: m.volume,
    transactions: m.transactions,
    avgPriceUSD: calculateUSDValue(m.volume / m.transactions) || 0
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ffbd]" />
      </div>
    );
  }

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
                : 'bg-white/10 dark:bg-[#1a1b1f] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Volume Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Volume</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="flex items-center">
              <FaEthereum className="mr-1" /> {totalVolumeUSD.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Transactions</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Avg. Price</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="flex items-center">
              <FaEthereum className="mr-1" /> {avgPriceUSD.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Volume Chart */}
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-900 dark:text-white font-medium mb-4">Volume</h3>
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
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    color: '#111827'
                  }}
                  labelFormatter={date => format(date, 'MMM dd, yyyy HH:mm')}
                  formatter={value => [`${value.toFixed(2)} Ξ`, 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="volumeUSD"
                  stroke="#00ffbd"
                  strokeWidth={2}
                  fill="url(#volumeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Chart */}
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-900 dark:text-white font-medium mb-4">Transactions</h3>
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
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    color: '#111827'
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
        <div className="bg-white dark:bg-[#1a1b1f] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-gray-900 dark:text-white font-medium mb-4">Average Price</h3>
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
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    color: '#111827'
                  }}
                  labelFormatter={date => format(date, 'MMM dd, yyyy HH:mm')}
                  formatter={value => [`${value.toFixed(3)} Ξ`, 'Avg. Price']}
                />
                <Area
                  type="monotone"
                  dataKey="avgPriceUSD"
                  stroke="#00ffbd"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">No volume data available</div>
        </div>
      )}
    </div>
  );
} 