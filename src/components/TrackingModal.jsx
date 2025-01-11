import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const TrackingModal = ({ isOpen, onClose, trackingNumber, carrier }) => {
  const [isInitialized, setIsInitialized] = useState(false);

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
          // Initialize tracking
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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 relative z-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-[#FF1B6B]">
            Tracking Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#FF1B6B] transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-pink-50 rounded-lg">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium text-gray-500">Tracking Number:</span>
            <span className="text-sm font-medium text-gray-900">{trackingNumber}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Carrier:</span>
            <span className="text-sm font-medium text-gray-900">{carrier || 'Auto-detect'}</span>
          </div>
        </div>

        {!isInitialized ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF1B6B]" />
          </div>
        ) : null}
        <div id="tracking-container" className="w-full min-h-[560px] p-1 rounded-lg bg-gradient-to-br from-pink-50 to-white"></div>
      </div>
    </div>
  );
};

export default TrackingModal; 