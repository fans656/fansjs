import { describe, it, expect } from 'vitest';

import { API, makeFetchUrl, makeFetchOptions } from '../api';

import { mockFetch } from './api.testutils';

describe('API', () => {
  const api = new API();

  it('parse json body by default', async () => {
    const {data} = mockFetch({name: 'evo'});

    expect(await api.get('/')).toEqual(data);
    expect(await api.post('/')).toEqual(data);
  });

  it('no parse for {parse: false}', async () => {
    const {data} = mockFetch({name: 'evo'});

    await verify(await api.get('/', {parse: false}));
    await verify(await api.post('/', {parse: false}));
    
    async function verify(res) {
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(data);
    }
  });

  it('can catch error response', async () => {
    const {status, data} = mockFetch({name: 'evo'}, {status: 400});

    await verify(api.get('/'));
    await verify(api.post('/'));
    
    async function verify(pr) {
      try {
        await pr;
      } catch (res) {
        expect(res.status).toBe(status);
        expect(await res.json()).toEqual(data);
      }
    }
  });

  it('can post json data', async () => {
    const data = {'foo': 3};
    mockFetch.echo();
    expect(await api.post('/', {data})).toEqual(data);
  });
});

describe('makeFetchUrl', () => {
  it('concatenate host and path', () => {
    const resource = makeFetchUrl('https://fans656.me', '/api/note');
    expect(resource).toBe('https://fans656.me/api/note');
  });

  it('attach query', () => {
    const resource = makeFetchUrl(
      'https://fans656.me',
      '/api/note',
      {name: 'evo', age: 16},
    );
    expect(resource).toBe('https://fans656.me/api/note?name=evo&age=16');
  });
});

describe('makeFetchOptions', () => {
  describe('data', () => {
    it('makes json body for object data', () => {
      const data = {name: 'evo', age: 16};
      const options = makeFetchOptions({data});
      expect(JSON.parse(options.body)).toEqual(data);
      expect(options.headers.get('Content-Type')).toBe('application/json');
    });
  });
});
