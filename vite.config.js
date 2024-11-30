import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
        }
      }
    }
  },
  optimizeDeps: {
    include: ['recharts']
  },
  server: {
    host: true
  }
});