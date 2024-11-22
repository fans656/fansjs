import { vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import _ from 'lodash';

export function mockFetch(data = {}, {
  status = 200,
} = {}) {
  const res = {
    status,
    json: async () => data,
  };
  global.fetch = vi.fn();
  fetch.mockResolvedValue(res);
  return {status, data};
}

mockFetch.echo = (data = {}, {
  status = 200,
} = {}) => {
  global.fetch = vi.fn(async (resource, options) => {
    return {
      status,
      json: async () => JSON.parse(options.body),
    };
  });
}

export function hooked(hook, ...args) {
  const ret = renderHook(hook, {initialProps: args});

  return {
    ...ret,

    get current() {
      return ret.result.current;
    },
    
    async wait(verify) {
      await waitFor(() => verify(ret.result.current));
    },

    rerender(...args) {
      act(() => ret.rerender(args));
    },
  };
}
