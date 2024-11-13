import { test, expect } from '@playwright/test';
import _ from 'lodash';

import { ports } from './ports';
import { docs } from './doc';

for (const doc of docs.docs) {
  test.describe.parallel(doc.id, () => {
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
    
    if (spec.style) {
      const styles = await this.page.evaluate((elem) => {
        return window.getComputedStyle(elem);
      }, await loc.elementHandle());

      if (spec.style.margin != null) {
        await this.assert(styles.marginTop === spec.style.margin + 'px');
        await this.assert(styles.marginBottom === spec.style.margin + 'px');
        await this.assert(styles.marginLeft === spec.style.margin + 'px');
        await this.assert(styles.marginRight === spec.style.margin + 'px');
      }
      if (spec.style.padding != null) {
        await this.assert(styles.paddingTop === spec.style.padding + 'px');
        await this.assert(styles.paddingBottom === spec.style.padding + 'px');
        await this.assert(styles.paddingLeft === spec.style.padding + 'px');
        await this.assert(styles.paddingRight === spec.style.padding + 'px');
      }
    }
    
    if (spec.width != null) {
      if (_.isFunction(spec.width)) {
        await this.assert(spec.width((await loc.boundingBox()).width));
      } else {
        await this.assert((await loc.boundingBox()).width === spec.width);
      }
    }

    if (spec.height != null) {
      if (_.isFunction(spec.height)) {
        await this.assert(spec.height((await loc.boundingBox()).height));
      } else {
        await this.assert((await loc.boundingBox()).height === spec.height);
      }
    }

    if (spec.x) {
      if (_.isFunction(spec.x)) {
        await this.assert(spec.x((await loc.boundingBox()).x));
      } else {
        await this.assert((await loc.boundingBox()).x === spec.x);
      }
    }

    if (spec.y) {
      if (_.isFunction(spec.y)) {
        await this.assert(spec.y((await loc.boundingBox()).y));
      } else {
        await this.assert((await loc.boundingBox()).y === spec.y);
      }
    }

    if (spec.styles) {
      const styles = await this.page.evaluate((elem) => {
        return window.getComputedStyle(elem);
      }, await loc.elementHandle());
      await this.assert(spec.styles(styles));
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

  assertMargin(styles, desc = '') {
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
