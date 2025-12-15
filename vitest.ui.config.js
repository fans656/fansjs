import { defineConfig } from 'vitest/config';
import pathlib from 'path';

import packageJson from './package.json';

export default defineConfig({
  test: {
    include: ['**/__tests__/**/*.ui.jsx'],
    setupFiles: './vitest.setup.js',
    environment: 'jsdom',
    globals: true,
  },
  define: {
    __VERSION__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      'fansjs': pathlib.resolve(__dirname, './src'),
    },
  },
});
