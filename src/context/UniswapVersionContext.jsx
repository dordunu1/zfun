import React, { createContext, useContext, useState } from 'react';

const UniswapVersionContext = createContext();

export function UniswapVersionProvider({ children }) {
  const [version, setVersion] = useState('v2');

  return (
    <UniswapVersionContext.Provider value={{ version, setVersion }}>
      {children}
    </UniswapVersionContext.Provider>
  );
}

export function useUniswapVersion() {
  const context = useContext(UniswapVersionContext);
  if (!context) {
    throw new Error('useUniswapVersion must be used within a UniswapVersionProvider');
  }
  return context;
} 