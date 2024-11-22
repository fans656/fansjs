/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

import { mockFetch, hooked } from './api.testutils';

import { API } from './api';

describe('API', () => {
  const api = new API();

  it('can call useGet to do simple get', async () => {
    mockFetch({value: 1});
    const {result} = renderHook(() => api.useGet('/'));
    await waitFor(() => expect(result.current).toEqual({value: 1}));
  });

  it('can re-fetch upon path change', async () => {
    mockFetch({value: 1});
    const hook = hooked(api.useGet, '/');
    await hook.wait(res => expect(res).toEqual({value: 1}));

    mockFetch({value: 2});
    hook.rerender('/foo');
    await hook.wait(res => expect(res).toEqual({value: 2}));
  });

  it('can re-fetch upon deps change', async () => {
    const deps = [1];

    mockFetch({value: 1});
    const hook = hooked(api.useGet, '/', {deps});
    await hook.wait(res => expect(res).toEqual({value: 1}));

    mockFetch({value: 2});
    ++deps[0];
    hook.rerender('/', {deps});
    await hook.wait(res => expect(res).toEqual({value: 2}));
  });

  it('can refresh using useGet controller', async () => {
    mockFetch({value: 1});
    const {result} = renderHook(() => api.useGet('/', {controller: true}));
    await waitFor(() => {
      const [res, controller] = result.current;
      expect(res).toEqual({value: 1});
    });

    mockFetch({value: 2});
    act(() => {
      const [res, controller] = result.current;
      controller.refresh();
    });
    await waitFor(() => {
      const [res, controller] = result.current;
      expect(res).toEqual({value: 2});
    });
  });
});
