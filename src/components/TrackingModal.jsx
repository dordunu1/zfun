import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const TrackingModal = ({ isOpen, onClose, trackingNumber, carrier }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Add console filtering
  useEffect(() => {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    // Filter out all messages
    const filterLogs = (type) => (...args) => {
      // Only allow console messages that we explicitly want to show
      const isOurMessage = args.some(arg => 
        typeof arg === 'string' && 
        arg.includes('Error initializing tracking widget:')
      );
      
      if (isOurMessage) {
        originalConsole[type](...args);
      }
    };

    // Override console methods
    console.log = filterLogs('log');
    console.warn = filterLogs('warn');
    console.error = filterLogs('error');

    // Cleanup
    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const container = document.getElementById('tracking-container');
    if (!container) return;

    const initializeWidget = () => {
      try {
        // Clear previous content
        container.innerHTML = '';

        // Create a div for the tracking widget
        const widgetContainer = document.createElement('div');
        widgetContainer.id = 'YQContainer';
        widgetContainer.className = 'rounded-lg border border-pink-100 shadow-sm';
        container.appendChild(widgetContainer);

        if (window.YQV5) {
          window.YQV5.trackSingle({
            YQ_ContainerId: "YQContainer",
            YQ_Height: 560,
            YQ_Fc: carrier || "0",
            YQ_Lang: "en",
            YQ_Num: trackingNumber
          });
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing tracking widget:', error);
      }
    };

    // Load the 17Track script if not already loaded
    if (!document.getElementById('YQScript')) {
      const script = document.createElement('script');
      script.id = 'YQScript';
      script.src = 'https://www.17track.net/externalcall.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Check for YQV5 object
    const checkYQV5 = setInterval(() => {
      if (window.YQV5) {
        clearInterval(checkYQV5);
        initializeWidget();
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkYQV5);
      setIsInitialized(false);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isOpen, trackingNumber, carrier]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-white bg-opacity-90" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-4 relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#FF1B6B]">
            Tracking Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#FF1B6B] transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-pink-50 rounded-lg">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-gray-500">Tracking Number:</span>
            <span className="font-medium text-gray-900">{trackingNumber}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="font-medium text-gray-500">Carrier:</span>
            <span className="font-medium text-gray-900">{carrier || 'Auto-detect'}</span>
          </div>
        </div>

        {!isInitialized ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF1B6B]" />
          </div>
        ) : null}
        <div id="tracking-container" className="w-full min-h-[560px] rounded-lg bg-gradient-to-br from-pink-50 to-white"></div>
      </div>
    </div>
  );
};

export default TrackingModal; 