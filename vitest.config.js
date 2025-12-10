import { defineConfig } from 'vitest/config';
import pathlib from 'path';

import packageJson from './package.json';

export default defineConfig({
  test: {
    include: ['**/*.unit.js'],
    setupFiles: './vitest.setup.js',
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
