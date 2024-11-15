import { describe, it, expect } from 'vitest';

import { normalizedLink, normalizedFormField } from './utils';

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

describe('normalizedFormField', () => {
  it('normalize password as input with password attr', () => {
    const field = normalizedFormField({type: 'password'});
    expect(field.type).toBe('input');
    expect(field.password).toBe(true);
  });

  it('normalize submit as button with submit attr', () => {
    const field = normalizedFormField({type: 'submit'});
    expect(field.type).toBe('button');
    expect(field.submit).toBe(true);
    expect(field.primary).toBe(true);
    expect(field.nolabel).toBe(true);
  });

  it('normalize button as nolabel', () => {
    {
      const field = normalizedFormField({type: 'button'});
      expect(field.nolabel).toBe(true);
    }
    {
      const field = normalizedFormField({type: 'submit'});
      expect(field.nolabel).toBe(true);
    }
  });

  it('normalize field key', () => {
    const field = {};
    expect(normalizedFormField(field).key).toBe(undefined);

    field.label = 'label';
    expect(normalizedFormField(field).key).toBe('label');

    field.name = 'name';
    expect(normalizedFormField(field).key).toBe('name');

    field.key = 'key';
    expect(normalizedFormField(field).key).toBe('key');
  });

  it('normalize field label', () => {
    const field = {};
    expect(normalizedFormField(field).label).toBe(undefined);

    field.key = 'key';
    expect(normalizedFormField(field).label).toBe('key');

    field.name = 'name';
    expect(normalizedFormField(field).label).toBe('name');

    field.label = 'label';
    expect(normalizedFormField(field).label).toBe('label');
  });
});
