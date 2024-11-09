import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import _ from 'lodash';
import { glob } from 'glob';
import fs from 'fs';
import dedent from 'dedent';
import mustache from 'mustache';

import packageJson from './package.json';

export default defineConfig(({mode}) => {
  let config = {
    define: {
      __VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
      outDir: mode === 'app' ? 'dist.app' : 'dist',
    },
    resolve: {
      alias: {
        'src': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      collectDocs(),
    ],
  };
  if (mode !== 'app') {
    config = _.merge(config, {
      build: {
        lib: {
          entry: {
            'index': path.resolve(__dirname, 'src/index.js'),
            'ui': path.resolve(__dirname, 'src/ui/index.js'),
          },
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'antd',
          ],
        },
      },
    });
  }
  return config;
})

function collectDocs() {
  return {
    name: 'collectDocs',
    async buildStart() {
      const suffix = '.doc.js';
      const root = path.resolve(__dirname, 'src');
      const files = await glob(path.resolve(__dirname, 'src/**/*.doc.js'));
      const docs = files.map((file, index) => {
        file = file.substring(root.length + 1);
        const name = file.replace('/', '.').replace(/\.doc\.js$/, '');
        const data = `doc${index}`
        return {name, data, file: '../' + file};
      });

      const content = mustache.render(dedent(`
        import { Doc } from './doc';

        {{#docs}}
        import { doc as {{data}} } from '{{{file}}}';
        {{/docs}}

        export const docs = {
          {{#docs}}
          '{{name}}': new Doc({name: '{{name}}', data: {{data}}}),
          {{/docs}}
        };
      `), {docs});

      fs.writeFileSync(path.resolve(__dirname, 'src/doc/index.js'), content);
    },
  };
}
