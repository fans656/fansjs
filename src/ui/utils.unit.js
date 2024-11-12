import { describe, it, expect } from 'vitest';

import { normalizedLink } from './utils';

describe('normalizedLink', () => {
  it('normalize key with priority', () => {
    const link = {};

    expect(normalizedLink(link).key).toBe('');

    link.title = 'title';
    expect(normalizedLink(link).key).toBe('title');

    link.label = 'label';
    expect(normalizedLink(link).key).toBe('label');

    link.name = 'name';
    expect(normalizedLink(link).key).toBe('name');

    link.href = 'href';
    expect(normalizedLink(link).key).toBe('href');

    link.path = 'path';
    expect(normalizedLink(link).key).toBe('path');

    link.key = 'key';
    expect(normalizedLink(link).key).toBe('key');
  });

  it('normalize path with priority', () => {
    const link = {};

    expect(normalizedLink(link).path).toBe('');

    link.key = 'key';
    expect(normalizedLink(link).path).toBe('key');

    link.href = 'href';
    expect(normalizedLink(link).path).toBe('href');

    link.path = 'path';
    expect(normalizedLink(link).path).toBe('path');
  });

  it('normalize label with priority', () => {
    const link = {};

    expect(normalizedLink(link).label).toBe('');

    link.name = 'name';
    expect(normalizedLink(link).label).toBe('name');

    link.label = 'label';
    expect(normalizedLink(link).label).toBe('label');
  });
  
  it('will not use title as label', () => {
    expect(normalizedLink({title: 'foo'}).label).toBe('');
  });
});
