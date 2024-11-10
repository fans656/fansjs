export class Docs {
  constructor({docs, testcaseApps}) {
    // Usage: `docs.docs`
    this.docs = [];
    this.testcases = [];

    for (const docData of docs) {
      const doc =  new Doc(docData);
      this.docs.push(doc);

      // Usage: `doc = docs[docId]`
      this[docData.id] = doc;

      for (const testcase of Object.values(doc.testcases)) {
        const App = testcaseApps[testcase.id];
        if (App) {
          testcase.App = App;
        }

        // Usage: `testcase = docs.testcases[testcaseId]`
        this.testcases.push(testcase);
        this.testcases[testcase.id] = testcase;
      }
    }
  }
}

class Doc {
  constructor(data) {
    this.id = data.id;
    this.title = data.title || data.id;
    this.samples = data.samples || [];

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
