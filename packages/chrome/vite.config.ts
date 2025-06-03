import createReactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: true, // Clean the 'dist/' directory before each build
    // minify: false,
    modulePreload: {
      polyfill: false, // We don't care about older browsers that don't support module preload.
    },
    rollupOptions: {
      input: {
        background: 'src/background.ts',
        content: 'src/content.ts',
        loader: 'devtools-loader.html',
        panel: 'devtools-panel.html',
        sidebar: 'devtools-sidebar.html',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [createReactPlugin()],
  publicDir: 'public', // Files in this location will be copied to the distribution directory when built.
});
