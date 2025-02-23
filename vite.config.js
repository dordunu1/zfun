import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',  // Ensure this matches your deployment URL path
  plugins: [react()],
  resolve: {
    alias: {
      'recharts': 'recharts'
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@rainbow-me')) {
            if (id.includes('core')) {
              return 'rainbow-core';
            }
            return 'rainbow-utils';
          }
          if (id.includes('wagmi')) {
            return 'web3-wagmi';
          }
          if (id.includes('viem')) {
            return 'web3-viem';
          }
          if (id.includes('ethers')) {
            return 'web3-ethers';
          }
          if (id.includes('node_modules')) {
            const pkg = id.split('node_modules/')[1].split('/')[0];
            if (pkg.startsWith('@')) {
              const scope = pkg.split('/')[0].substring(1);
              return `vendor-${scope}`;
            }
            return `vendor-${pkg.charAt(0)}`;
          }
        },
        inlineDynamicImports: false,
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@rainbow-me/rainbowkit', 'wagmi', 'viem', 'ethers'],
    exclude: []
  },
  server: {
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});