import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      'recharts': 'recharts'
    }
  },
  build: {
    commonjsOptions: {
      include: [/recharts/, /node_modules/]
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'recharts': ['recharts']
        },
        format: 'es',
        inlineDynamicImports: false
      }
    },
    sourcemap: true,
    assetsDir: 'assets',
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
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