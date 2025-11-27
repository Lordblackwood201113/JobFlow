import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Désactiver les erreurs ESLint en production
    babel: {
      parserOpts: {
        plugins: ['jsx'],
      },
    },
  })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks pour les librairies volumineuses
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'charts': ['recharts'],
          'date': ['date-fns'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Optimisations supplémentaires
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'esbuild', // Utiliser esbuild pour la minification (plus rapide)
    target: 'es2015',
  },
  // Optimisation du serveur de dev
  server: {
    port: 5173,
    strictPort: false,
  },
  // Prévisualisation du build
  preview: {
    port: 4173,
  },
})
