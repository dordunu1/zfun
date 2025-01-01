import { create } from 'zustand';

const useUniswapVersion = create((set) => ({
  version: 'v2',
  setVersion: (version) => set({ version }),
}));

export { useUniswapVersion }; 