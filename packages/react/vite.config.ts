import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactPlugin()],
  resolve: {
    alias: {
      // TODO: Check whether this is needed. Next.js automatically reads this from `tsconfig.json`.
      // '@monorepo/api': '../api',
    },
  },
  server: {
    port: 5176,
  },
});
