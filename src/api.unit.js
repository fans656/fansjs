import { describe, it, expect, vi } from 'vitest';

import { API, makeURL, makeOptions } from './api';

global.fetch = vi.fn();

describe('API', () => {
  console.debug = () => {};

  // TODO
  // describe('GET', () => {
  // });

  describe('POST', () => {
    describe('json', () => {

      it('return json', async () => {
        const data = {name: 'evo'};
        fetch.mockResolvedValueOnce({
          status: 200,
          json: async () => data,
          headers: new Headers({'content-type': 'application/json'}),
        });
        expect(await new API().post('/')).toEqual(data);
      });

      it('can specify raw res return', async () => {
        const res = {
          status: 200,
          json: async () => {name: 'evo'},
          headers: new Headers({'content-type': 'application/json'}),
        };
        fetch.mockResolvedValueOnce(res);
        expect(await new API().post('/', null, {res: 'raw'})).toEqual(res);
      });

    });

    it('can post text', () => {
      // TODO
    });

    it('can post blob', () => {
      // TODO
    });
  });
});

describe('makeURL', () => {
  it('concatenate host and path', () => {
    expect(makeURL('https://fans656.me', '/api/note')).toBe('https://fans656.me/api/note');
  });

  it('attach query', () => {
    expect(makeURL(
      'https://fans656.me',
      '/api/note',
      {name: 'evo', age: 16},
    )).toBe('https://fans656.me/api/note?name=evo&age=16');
  });
});

describe('makeOptions', () => {
  describe('data', () => {
    it('makes json body for object data', () => {
      const data = {name: 'evo', age: 16};
      const options = makeOptions('POST', {data});
      expect(JSON.parse(options.body)).toEqual(data);
      expect(options.headers.get('Content-Type')).toBe('application/json');
    });
  });
});
