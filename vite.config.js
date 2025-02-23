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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) {
              return 'recharts';
            }
            return 'vendor';
          }
        }
      }
    },
    sourcemap: false,
    assetsDir: 'assets',
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: 'esbuild'
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