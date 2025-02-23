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
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: true,
    commonjsOptions: {
      include: [/recharts/, /node_modules/]
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2/.test(extType)) {
            extType = 'fonts';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: (id) => {
          // Split external dependencies (node_modules) into chunks
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('@rainbow-me/rainbowkit')) {
              return 'rainbow-core';
            }
            if (id.includes('@rainbow-me') && !id.includes('@rainbow-me/rainbowkit')) {
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
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('@emotion/') || id.includes('styled-components') || id.includes('@mui/')) {
              return 'ui-libs';
            }
            // Split remaining vendor chunks by first letter to make them smaller
            const match = id.match(/node_modules\/((@[^/]+\/)?[^/]+)/);
            if (match) {
              const pkg = match[1];
              const firstChar = pkg.charAt(0).toLowerCase();
              return `vendor-${firstChar}`;
            }
            return 'vendor-misc';
          }
          // Split your app code into feature-based chunks
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/context/')) {
            return 'context';
          }
        }
      }
    },
    minify: 'esbuild',
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['recharts', '@rainbow-me/rainbowkit', 'wagmi', 'viem', 'ethers']
  },
  server: {
    host: true,
    proxy: {
      '/polygon-api': {
        target: 'https://api.polygonscan.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/polygon-api/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    }
  }
});