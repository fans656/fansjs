export const doc = {
  title: 'Table',

  samples: [{
    title: 'Simple',
    app: `
      import { Table } from 'fansjs/ui';

      export const App = () => (
        <Table
          data={[
            {name: 'fans656', age: 35},
            {name: 'evo', age: 16},
          ]}
        />
      );
    `,
  }, {
    title: 'Cols',
    app: `
      import { Table, Button } from 'fansjs/ui';

      export const App = () => (
        <Table
          data={[
            {name: 'fans656', age: 35},
            {name: 'evo', age: 16},
          ]}
          cols={[
            {label: 'Name', name: 'name'},
            {label: 'Age (Days)', render: d => 365 * d.age},
            {label: 'Actions', render: () => (
              <div className="horz xs-margin">
                <Button>Edit</Button>
                <Button>Delete</Button>
              </div>
            )},
          ]}
        />
      );
    `,
  }],

  testcases: [
    // TODO: can simply render data
    // TODO: can specify cols
    // TODO: ...
  ],
};
