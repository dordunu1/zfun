import React from 'react';
import TokenSelectionModal from './TokenSelectionModal';

export default function TokenSelector({ isOpen, onClose, onSelect, selectedTokenAddress, excludeToken }) {
  return (
    <TokenSelectionModal
      isOpen={isOpen}
      onClose={onClose}
      onSelect={onSelect}
      selectedTokenAddress={selectedTokenAddress}
      excludeToken={excludeToken}
    />
  );
} 