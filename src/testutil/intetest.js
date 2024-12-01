import _ from 'lodash';

let expect;

export class Intetest {
  constructor({
    playwright,
    origin = '',
  }) {

    expect = playwright.expect;

    this.origin = origin;
  }
  
  async verify(page, path, verify_func) {
    await page.goto(`${this.origin}${path}`);
    await verify_func({
      elem: async (...args) => await verifyElem(page, ...args),
    });
  }
}

export async function verifyElem(page, selector, spec) {
  const loc = page.locator(selector);

  if (spec.type) {
    expect(await loc.evaluate(e => e.tagName.toLowerCase())).toBe(spec.type);
  }

  if (spec.attrs) {
    for (const [key, value] of Object.entries(spec.attrs)) {
      expect(await loc.getAttribute(key)).toBe(value);
    }
  }

  if (spec.style) {
    const styles = await page.evaluate((elem) => {
      return window.getComputedStyle(elem);
    }, await loc.elementHandle());

    if (spec.style.margin != null) {
      await assert(styles.marginTop === spec.style.margin + 'px');
      await assert(styles.marginBottom === spec.style.margin + 'px');
      await assert(styles.marginLeft === spec.style.margin + 'px');
      await assert(styles.marginRight === spec.style.margin + 'px');
    }
    if (spec.style.padding != null) {
      await assert(styles.paddingTop === spec.style.padding + 'px');
      await assert(styles.paddingBottom === spec.style.padding + 'px');
      await assert(styles.paddingLeft === spec.style.padding + 'px');
      await assert(styles.paddingRight === spec.style.padding + 'px');
    }
  }

  if (spec.width != null) {
    if (_.isFunction(spec.width)) {
      await assert(spec.width((await loc.boundingBox()).width));
    } else {
      await assert((await loc.boundingBox()).width === spec.width);
    }
  }

  if (spec.height != null) {
    if (_.isFunction(spec.height)) {
      await assert(spec.height((await loc.boundingBox()).height));
    } else {
      await assert((await loc.boundingBox()).height === spec.height);
    }
  }

  if (spec.x) {
    if (_.isFunction(spec.x)) {
      await assert(spec.x((await loc.boundingBox()).x));
    } else {
      await assert((await loc.boundingBox()).x === spec.x);
    }
  }

  if (spec.y) {
    if (_.isFunction(spec.y)) {
      await assert(spec.y((await loc.boundingBox()).y));
    } else {
      await assert((await loc.boundingBox()).y === spec.y);
    }
  }

  if (spec.styles) {
    const styles = await page.evaluate((elem) => {
      return window.getComputedStyle(elem);
    }, await loc.elementHandle());
    await assert(spec.styles(styles));
  }
}
  
export async function assert(result, desc = '') {
  if (!result) {
    throw new AssertionError(desc);
  }
}

export class AssertionError extends Error {};
