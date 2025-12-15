import { describe, it, expect } from 'vitest';

import { normalizedItem } from 'fansjs/ui/toc';

describe('normalizedItem', () => {
  it('normalize label', () => {
    const item = {};
    expect(normalizedItem(item).label).toBe(undefined);

    item.key = 'key';
    expect(normalizedItem(item).label).toBe('key');

    item.name = 'name';
    expect(normalizedItem(item).label).toBe('name');

    item.name = 'label';
    expect(normalizedItem(item).label).toBe('label');
  });
});
