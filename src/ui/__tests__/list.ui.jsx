import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Root, List } from 'fansjs/ui';

describe('List', () => {
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

  it('sync selected item from query', () => {
    window.location.assign('/?cur=foo'); 
    render(
      <List domain="cur">{[{id: 'foo'}, {id: 'bar'}]}</List>
    )
    expect(items(className('selected'))).toEqual([true, false]);
  })

  it('custom render function', () => {
    render(
      <List render={d => d.toUpperCase()}>{['a','b','c']}</List>
    )
    expect(items(d => d.textContent)).toEqual(['A','B','C']);
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
