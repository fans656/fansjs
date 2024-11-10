import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pathlib from 'path';
import _ from 'lodash';
import { glob } from 'glob';
import fs from 'fs';
import dedent from 'dedent';
import mustache from 'mustache';

import packageJson from './package.json';
import { ports } from './src/ports';

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
        'fansjs': pathlib.resolve(__dirname, './src'),
        'src': pathlib.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      collectDocs(),
    ],
    server: {
      port: ports.fansjs_dev,
    },
  };
  if (mode !== 'app') {
    config = _.merge(config, {
      build: {
        lib: {
          entry: {
            'index': pathlib.resolve(__dirname, 'src/index.js'),
            'ui': pathlib.resolve(__dirname, 'src/ui/index.js'),
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
      const root = pathlib.resolve(__dirname, 'src');
      const files = await glob(pathlib.resolve(__dirname, 'src/**/*.doc.js'));
      const docs = files.map((file, index) => {
        const path = file.substring(root.length + 1);
        const id = path.replace('/', '.').replace(/\.doc\.js$/, '');
        const data = `doc${index}`
        return {id, data, file, path: '../' + path};
      });

      const testcaseApps = [];
      for (const doc of docs) {
        const mod = await import(doc.file);
        for (const testcase of (mod.doc.testcases || [])) {
          const testcaseId = `${doc.id}__${testcase.desc.replace(/ /g, '_')}`
          if (testcase.app) {
            const relpath = `doc/testcases.generated/${testcaseId}.jsx`;
            const path = pathlib.resolve(__dirname, 'src', relpath);
            fs.writeFileSync(path, dedent(testcase.app));
            testcaseApps.push({
              id: testcaseId,
              path: '../' + relpath,
              mod: `app${testcaseApps.length}`,
            });
          }
        };
      }

      const content = mustache.render(dedent(`
        // NOTE: DO NOT MODIFY! (This is auto generated)
        {{#docs}}
        import { doc as {{data}} } from '{{{path}}}';
        {{/docs}}

        {{#testcaseApps}}
        import { App as {{mod}} } from '{{{path}}}';
        {{/testcaseApps}}
        
        import { Docs } from './doc';

        export const docs = new Docs({
          docs: [
            {{#docs}}
            {id: '{{id}}', ...{{data}}},
            {{/docs}}
          ],
          testcaseApps: {
            {{#testcaseApps}}
            '{{id}}': {{mod}},
            {{/testcaseApps}}
          },
        });
      `), {docs, testcaseApps});

      fs.writeFileSync(pathlib.resolve(__dirname, 'src/doc/index.js'), content);
    },
  };
}
