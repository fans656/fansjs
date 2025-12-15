export { Root } from './root';
export { App } from './app';
export { Auth } from './auth';
export { Routed } from './routed';
export { Layout } from './layout';
export { Form } from './form';
export { Button } from './button';
export { Toc } from './toc';
export { Code } from './code';
export { Table } from './table';
export { Edit } from './edit';
export { List } from './list';
export { Actions, Action } from './action';
export { message } from './message';
export { dialog } from './dialog';

import styleInject from 'style-inject';

styleInject(`
.horz {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.bordered {
  border: 0.5px solid #ccc;
}

.padding {
  padding: .5rem 1rem;
}

.horz.xxs-margin > *:not(:last-child) {
  margin-right: 0.25em;
}

.horz.xs-margin > *:not(:last-child) {
  margin-right: 0.5em;
}

.horz.margin > *:not(:last-child) {
  margin-right: 1em;
}

.horz.xl-margin > *:not(:last-child) {
  margin-right: 2.5em;
}

.horz.xxl-margin > *:not(:last-child) {
  margin-right: 5em;
}

.vert.xs-margin > *:not(:last-child) {
  margin-bottom: 0.5em;
}

.vert.margin > *:not(:last-child) {
  margin-bottom: 1em;
}

.vert.xl-margin > *:not(:last-child) {
  margin-bottom: 2.5em;
}

.vert.xxl-margin > *:not(:last-child) {
  margin-bottom: 5em;
}

.horz.right {
  justify-content: flex-end;
}

.space {
  justify-content: space-between;
}

.stretch {
  align-items: stretch;
}

.clickable:hover {
  cursor: pointer;
}

.hover-background:hover {
  background: var(--hover-background);
}
`);
