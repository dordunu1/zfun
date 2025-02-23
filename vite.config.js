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
            if (id.includes('@rainbow-me')) {
              return 'rainbow';
            }
            if (id.includes('wagmi') || id.includes('viem')) {
              return 'web3';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            // Group smaller common dependencies together
            if (id.includes('@emotion/') || id.includes('styled-components') || id.includes('@mui/')) {
              return 'ui-libs';
            }
            return 'vendor';
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
    include: ['recharts']
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