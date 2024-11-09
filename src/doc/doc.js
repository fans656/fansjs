export class Doc {
  constructor({name, data}) {
    this.name = name;
    this.title = data.title || name;
    this.samples = data.samples || [];
    this.testcases = data.testcases || [];
  }
}
