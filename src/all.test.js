import { test, expect } from '@playwright/test';

import { ports } from './ports';
import { docs } from './doc';

for (const doc of docs.docs) {
  test.describe(doc.id, () => {
    for (const testcase of Object.values(doc.testcases)) {
      test(testcase.id, async ({page}) => {
        await visit(page, `/testcase/${testcase.id}`);
        await testcase.verify({
          page,
          util: new Util(page, testcase),
        });
      });
    }
  });
}

class Util {
  constructor(page, testcase) {
    this.page = page;
    this.testcase = testcase;

    this.logs = [];
    this.page.on('console', log => {
      this.logs.push(log.text());
    });
  }
  
  async verifyElem(selector, spec) {
    const loc = this.page.locator(selector);

    if (spec.tag) {
      expect(await loc.evaluate(e => e.tagName.toLowerCase())).toBe(spec.tag);
    }

    if (spec.attrs) {
      for (const [key, value] of Object.entries(spec.attrs)) {
        expect(await loc.getAttribute(key)).toBe(value);
      }
    }
  }
  
  async verifyLog(func, {wait = 100} = {}) {
    await sleep(wait);
    let passed = false;
    let exc;
    for (const log of this.logs.toReversed()) {
      try {
        func(log);
        passed = true;
        break;
      } catch (e) {
        exc = e;
      }
    }
    if (!passed) {
      throw Error('verifyLog failed');
    }
  }
  
  assert(result, desc = '') {
    if (!result) {
      throw new AssertionError(desc);
    }
  }
}

class AssertionError extends Error {};
  
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function visit(page, path) {
  return await page.goto(`${pagePrefix}${path}`);
}
 
const pagePrefix = `http://localhost:${ports.fansjs_dev}`;
