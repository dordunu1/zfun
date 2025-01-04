import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/merchConfig';
import { FiSave, FiAlertTriangle } from 'react-icons/fi';
import { useAccount } from 'wagmi';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    withdrawalMinimum: 50,
    platformFee: 2.5,
    withdrawalProcessingTime: '3-5',
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { address: account, isConnected } = useAccount();
  const theme = localStorage.getItem('admin-theme') || 'light';

  useEffect(() => {
    if (isConnected) {
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      } else {
        // Create initial settings document if it doesn't exist
        await setDoc(doc(db, 'settings', 'platform'), settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected) return;
    
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Use setDoc instead of updateDoc to ensure the document is created if it doesn't exist
      await setDoc(doc(db, 'settings', 'platform'), settings);
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#FF1B6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <FiAlertTriangle className="w-16 h-16 text-[#FF1B6B] mb-4" />
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Access Denied</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>Please connect your admin wallet to access platform settings.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-[#FF1B6B] mb-6">Platform Settings</h1>

      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Minimum Withdrawal Amount (USDT)
            </label>
            <input
              type="number"
              name="withdrawalMinimum"
              value={settings.withdrawalMinimum}
              onChange={handleChange}
              className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Platform Fee (%)
            </label>
            <input
              type="number"
              name="platformFee"
              value={settings.platformFee}
              onChange={handleChange}
              className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Withdrawal Processing Time (days)
            </label>
            <input
              type="text"
              name="withdrawalProcessingTime"
              value={settings.withdrawalProcessingTime}
              onChange={handleChange}
              className={`block w-full px-3 py-2 rounded-md shadow-sm focus:ring-[#FF1B6B] focus:border-[#FF1B6B] ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-[#FF1B6B] focus:ring-[#FF1B6B] border-gray-300 rounded"
            />
            <label className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
              Maintenance Mode
            </label>
          </div>

          {message.text && (
            <div className={`p-4 rounded-md ${
              message.type === 'success' 
                ? theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-800'
                : theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !isConnected}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#FF1B6B] hover:bg-[#D4145A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF1B6B] disabled:opacity-50"
            >
              <FiSave className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 