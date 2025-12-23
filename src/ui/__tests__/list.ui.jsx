import React from 'react';
import { render, screen, within, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Root, List } from 'fansjs/ui';

describe('List basics', () => {
  afterEach(() => cleanup());

  it('render simple numbers', () => {
    render(
      <List>{[1,2,3]}</List>
    )
    expect(items(d => d.textContent)).toEqual(['1','2','3']);
  })

  it('render simple strings', () => {
    render(
      <List>{['a','b','c']}</List>
    )
    expect(items(d => d.textContent)).toEqual(['a','b','c']);
  })

  it('custom render function', () => {
    render(
      <List render={d => d.toUpperCase()}>{['a','b','c']}</List>
    )
    expect(items(d => d.textContent)).toEqual(['A','B','C']);
  })
})

describe('List query', () => {
  afterEach(() => cleanup());

  it('sync selected item from query', () => {
    window.location.assign('/?cur=foo'); 
    render(
      <List domain="cur">{[{id: 'foo'}, {id: 'bar'}]}</List>
    )
    expect(items(className('selected'))).toEqual([true, false]);
  })
})

describe('List actions', () => {
  afterEach(() => cleanup());

  it('actions', async () => {
    const onAction = vi.fn();
    render(
      <List
        actions={{
          'Info': onAction,
        }}
      >
        {[1,2,3]}
      </List>
    )
    const lis = items();

    await userEvent.click(within(lis[0]).getByRole('button'));
    expect(onAction).toHaveBeenCalledWith(1);
  })

  it('hover actions', async () => {
    render(
      <List
        actions={{
          'Info': {hover: true},
        }}
      >
        {[1,2,3]}
      </List>
    )
    const lis = items();

    await userEvent.hover(lis[0]);
    expect(screen.queryAllByRole('button')).to.have.lengthOf(1);
    await userEvent.unhover(lis[0]);
    expect(screen.queryAllByRole('button')).to.have.lengthOf(0);
  })

  it('custom component (array)', async () => {
    render(
      <List
        actions={[
          <div>custom</div>,
        ]}
      >
        {[1,2,3]}
      </List>
    )
    expect(screen.getAllByText('custom')).to.have.lengthOf(3);
  })

  it('custom component (object)', async () => {
    render(
      <List
        actions={{
          'Info': <div>custom</div>,
        }}
      >
        {[1,2,3]}
      </List>
    )
    expect(screen.getAllByText('custom')).to.have.lengthOf(3);
  })

  it('custom component (component)', async () => {
    render(
      <List
        actions={<div>custom</div>}
      >
        {[1,2,3]}
      </List>
    )
    expect(screen.getAllByText('custom')).to.have.lengthOf(3);
  })
})

function items(map) {
  let ret = screen.getAllByRole('listitem');
  if (map) {
    ret = ret.map(map);
  }
  return ret;
}

function className(value) {
  if (value) {
    return d => d.className.split(' ').includes(value);
  } else {
    return d => d.className;
  }
}
