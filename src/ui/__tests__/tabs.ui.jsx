import React from 'react';
import { render, screen, within, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Tabs } from 'fansjs/ui';

describe('Tabs basics', () => {
  afterEach(() => cleanup());

  it('render simple', async () => {
    render(
      <Tabs>{[
        {name: 'foo', render: () => <div>foo-content</div>},
        {name: 'bar', render: () => <div>bar-content</div>},
      ]}</Tabs>
    )

    // has tabs button
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map(d => d.textContent)).toEqual(['foo', 'bar']);

    // default to first tab
    expect(screen.getByRole('tabpanel', {hidden: false}).textContent).toEqual('foo-content');

    // can navigate to other tab
    await userEvent.click(tabs[1]);
    expect(screen.getByRole('tabpanel', {hidden: false}).textContent).toEqual('bar-content');
  })
})
