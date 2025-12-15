export const doc = {
  title: 'Routed',
  desc: `
    Render given pages array as different routes.
  `,
  
  samples: [{
    title: 'Simple usage',
    app: `
      import { Routed } from 'fansjs/ui';

      export const App = () => (
        <Routed>{[
          {
            path: '/books',
            comp: <div>lots of books</div>,
          },
          {
            path: '/movies',
            comp: <div>lots of movies</div>,
          },
          {
            path: '/',
            comp: (
              <div className="horz margin">
                <a href="/books">Books</a>
                <a href="/movies">Movies</a>
              </div>
            ),
          },
        ]}</Routed>
      );
    `,
    inplace: false,
    stayInApp: true,
  }, {
    title: 'With header',
    app: `
      import { Routed } from 'fansjs/ui';

      export const App = () => (
        <Routed
          header={[
            {name: 'Home', path: '/'},
            {name: 'Books', path: '/books'},
            {name: 'Movies', path: '/movies'},
          ]}
        >{[
          {
            path: '/books',
            comp: <div>lots of books</div>,
          },
          {
            path: '/movies',
            comp: <div>lots of movies</div>,
          },
          {
            path: '/',
            comp: <div>Ths is home</div>,
          },
        ]}</Routed>
      );
    `,
    inplace: false,
    stayInApp: true,
  }],

  testcases: [],
};
