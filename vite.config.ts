import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    cssCodeSplit: true,
    cssMinify: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local'
    }
  },
  server: {
    fs: {
      strict: true
    }
  }
});