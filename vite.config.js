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
      prepareDocs(),
    ],
    server: {
      port: ports.fansjs_dev,
    },
    test: {
      environmentMatch: {
        'src/**/__tests__/**/*.unit.js': 'node',
        'src/**/__tests__/**/*.ui.jsx': 'jsdom',
      },
    },
  };
  if (mode !== 'app') {
    config = _.merge(config, {
      build: {
        lib: {
          entry: {
            'index': pathlib.resolve(__dirname, 'src/index.js'),
            'ui': pathlib.resolve(__dirname, 'src/ui/index.js'),
            'jober': pathlib.resolve(__dirname, 'src/ui/jober.jsx'),
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

function prepareDocs() {
  async function generateDocs() {
    const docFiles = await findDocFiles();
    const docs = docFiles.map(({absPath, relPath}) => {
      const id = docIdFromPath(relPath);
      return {
        id,
        absPath,
        importedName: importedNameFromId(id),
        importPath: pathlib.join('fansjs', relPath),
      };
    });
    const sampleApps = [];
    for (const _doc of docs) {
      const doc = (await import(_doc.absPath + `?t=${_prepareDocsImportId++}`)).doc;
      for (const [index, sample] of (doc.samples || []).entries()) {
        const sampleId = `${_doc.id}__sample_${index}`;
        const path = `src/__generated__/docs/samples/${sampleId}.jsx`;
        renderRaw(path, sample.app);
        sampleApps.push({id: sampleId, path, index: sampleApps.length});
      }
    }
    render('src/__generated__/docs/index.js', `
      import dedent from 'dedent';

      {{#docs}}
      import { doc as {{importedName}} } from '{{{importPath}}}';
      {{/docs}}

      {{#sampleApps}}
      import { App as sampleApp{{index}} } from '{{{path}}}';
      {{/sampleApps}}

      class Doc {
        constructor(id, doc) {
          this.id = id;
          this.title = doc.title;
          this.desc = doc.desc;
          this.samples = doc.samples || [];
          this.testcases = doc.testcases || [];

          this.samples.forEach((sample, index) => {
            sample.id = \`\${this.id}__sample_\${index}\`
            sample.app = dedent(sample.app);
            sample.App = apps[sample.id].App;
            apps[sample.id].conf = sample;
          });
        }
      }

      export const apps = {
        {{#sampleApps}}
        '{{id}}': {App: sampleApp{{index}}},
        {{/sampleApps}}
      };

      export const docs = {
        {{#docs}}
        '{{id}}': new Doc('{{id}}', {{importedName}}),
        {{/docs}}
      };
    `, {docs, sampleApps});
  }

  return {
    name: 'prepareDocs',
    async buildStart() {
      generateDocs();
    },
    async handleHotUpdate({file}) {
      if (!file.includes('__generated__')) {
        generateDocs();
      }
    },
  };

  async function findDocFiles() {
    const root = pathlib.resolve(__dirname, 'src');
    const files = await glob(pathlib.join(root, '**/*.doc.js'));
    return files.map(file => {
      return {
        absPath: file,
        relPath: pathlib.relative(root, file),
      };
    });
  }
  
  function docIdFromPath(path) {
    // e.g. 'ui/__docs__/table.doc.js' => 'ui.table', used in url query param
    return path.replace(/\/__docs__/, '').replace('/', '.').replace(/\.doc\.js$/, '');
  }
  
  function importedNameFromId(id) {
    return id.replace('.', '_').replace('-', '_');
  }
  
  async function render(path, template, args) {
    const fpath = pathlib.resolve(__dirname, path);
    const content = mustache.render(dedent(template), args || {});
    ensureParent(fpath);
    fs.writeFileSync(fpath, content);
  }

  async function renderRaw(path, content) {
    const fpath = pathlib.resolve(__dirname, path);
    ensureParent(fpath);
    fs.writeFileSync(fpath, content);
  }

  function ensureParent(fpath) {
    const dirname = pathlib.dirname(fpath);
    try {
      fs.mkdirSync(dirname, {recursive: true});
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }
}

function collectTestcaseApps(doc, docModule, testcaseApps) {
  for (const testcase of (docModule.doc.testcases || [])) {
    const testcaseId = `${doc.id}__${testcase.desc.replace(/ /g, '_')}`
    if (testcase.app) {
      const relpath = `doc/testcases.generated/${testcaseId}.jsx`;
      const path = pathlib.resolve(__dirname, 'src', relpath);
      ensureParent(path);
      fs.writeFileSync(path, dedent(testcase.app));
      testcaseApps.push({
        id: testcaseId,
        importedModule: `app${testcaseApps.length}`,
        importPath: 'fansjs/' + relpath,
      });
    }
  }
}

function collectSampleApps(doc, docModule, sampleApps) {
  (docModule.doc.samples || []).forEach((sample, index) => {
    const sampleId = `${doc.id}__sample_${index}`
    if (sample.app) {
      const relpath = `doc/samples.generated/${sampleId}.jsx`;
      const path = pathlib.resolve(__dirname, 'src', relpath);
      ensureParent(path);
      fs.writeFileSync(path, dedent(sample.app));
      sampleApps.push({
        id: sampleId,
        importPath: 'fansjs/' + relpath,
        importedModule: `sampleApp${sampleApps.length}`,
      });
    }
  });
}

function ensureDir(path) {
  try {
    fs.mkdirSync(path, {recursive: true});
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

let _prepareDocsImportId = 0;
