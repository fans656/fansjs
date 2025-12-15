export const doc = {
  title: 'List',

  samples: [{
    title: 'Simple',
    app: `
      import { List } from 'fansjs/ui';

      export const App = () => (
        <List>{['foo', 'bar', 'baz']}</List>
      );
    `,
  }, {
    title: 'Pass items as `data` instead of `children`',
    app: `
      import { List } from 'fansjs/ui';

      export const App = () => (
        <List data={[1, 2, 3]}/>
      );
    `,
  }, {
    title: 'List of objects',
    app: `
      import { List } from 'fansjs/ui';

      export const App = () => (
        <List>{[
          {name: 'fans656', age: 35},
          {name: 'evo', age: 16},
        ]}</List>
      );
    `,
  }, {
    title: 'Custom render function',
    app: `
      import { List } from 'fansjs/ui';

      export const App = () => (
        <List render={d => d.toUpperCase()}>{['a', 'b', 'c']}</List>
      );
    `,
  }, {
    title: 'Actions',
    app: `
      import { List } from 'fansjs/ui';

      export const App = () => (
        <List
          actions={{
            'Lower': item => alert(item.toLowerCase()),
            'Upper': item => alert(item.toUpperCase()),
          }}
        >
          {['A', 'b', 'c']}
        </List>
      );
    `,
  }],
};
