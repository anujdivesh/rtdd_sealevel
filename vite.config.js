import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  define: {
    global: 'window',
  },
  esbuild: command === 'build' && process.env.KEEP_LOGS !== 'true' ? {
    drop: ['debugger'],
    pure: ['console.log', 'console.debug'],
  } : {},
  plugins: [],
  root: resolve(__dirname, 'frontend'),
  base: '/static/vite/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    origin: 'http://localhost:5173',
    cors: {
      origin: 'http://localhost:8000',
      methods: ['GET', 'OPTIONS'],
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: resolve(__dirname, 'static/vite'),
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/js/main.js'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('plotly.js')) {
            return 'plotly';
          }
          if (id.includes('leaflet')) {
            return 'leaflet';
          }
          if (id.includes('@fortawesome')) {
            return 'fontawesome';
          }
          if (id.includes('bootstrap')) {
            return 'bootstrap';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));
