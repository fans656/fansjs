import dedent from 'dedent';

export class Docs {
  constructor({docs, testcaseApps, sampleApps}) {
    // Usage: `docs.docs`
    this.docs = [];
    this.testcases = [];
    this.samples = {};

    for (const docData of docs) {
      const doc = new Doc(docData);
      this.docs.push(doc);

      // Usage: `doc = docs[docId]`
      this[doc.id] = doc;

      for (const testcase of Object.values(doc.testcases)) {
        const App = testcaseApps[testcase.id];
        if (App) {
          testcase.App = App;
        }

        // Usage: `testcase = docs.testcases[testcaseId]`
        this.testcases.push(testcase);
        this.testcases[testcase.id] = testcase;
      }

      for (const sample of doc.samples) {
        sample.app = dedent(sample.app);
        const App = sampleApps[sample.id];
        if (App) {
          sample.App = App;
        }

        // Usage: `sample = docs.samples[sampleId]`
        this.samples[sample.id] = sample;
      }
    }
  }
}

class Doc {
  constructor(data) {
    this.id = data.id;
    this.title = data.title || data.id;
    this.samples = data.samples || [];
    
    this.samples.forEach((sample, index) => {
      sample.id = `${this.id}__sample_${index}`;  // TODO: sync with vite.config.js
    });

    this.testcases = {};
    for (const testcaseData of (data.testcases || [])) {
      const id = `${this.id}__` + (testcaseData.id || testcaseData.desc.replace(/ /g, '_'));
      const testcase = new Testcase({id, data: testcaseData});
      this.testcases[id] = testcase;
    }
  }
}

class Testcase {
  constructor({id, data}) {
    this.id = id;
    this.desc = data.desc;
    this.verify = data.verify;
    this.App = () => null;  // updated by Docs
  }
}
