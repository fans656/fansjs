import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import _ from 'lodash';

import packageJson from './package.json';

export default defineConfig(({mode}) => {
  let config = {
    define: {
      __VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
      outDir: mode === 'app' ? 'dist.app' : 'dist',
    },
    plugins: [
      react(),
    ],
  };
  if (mode !== 'app') {
    config = _.merge(config, {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.js'),
          name: 'fansjs',
          fileName: (format) => `fansjs.${format}.js`
        },
      },
    });
  }
  return config;
})
