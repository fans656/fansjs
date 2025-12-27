export const doc = {
  title: 'Tabs',

  samples: [{
    title: 'Simple',
    app: `
      import { Tabs } from 'fansjs/ui';

      export const App = () => (
        <Tabs>{[
          {name: 'foo', render: () => <div>foo-content</div>},
          {name: 'bar', render: () => <div>bar-content</div>},
        ]}</Tabs>
      );
    `,
  }],
};
