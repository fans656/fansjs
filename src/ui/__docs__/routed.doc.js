export const doc = {
  title: 'Routed',
  
  samples: [{
    title: 'routed',
    norender: true,
    app: `
      import { Routed } from 'fansjs/ui';
      
      const pages = [
        {
          path: '/book',
          comp: <div>book</div>,
        },
        {
          path: '/movie',
          comp: <div>movie</div>,
        },
      ];

      export const App = () => (
        <Routed>
          {pages}
        </Routed>
      );
    `,
  }],

  // TODO:
  testcases: [],
};
