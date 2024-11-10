export const doc = {
  title: 'Form',

  samples: [
    {
      name: 'Fields',
      render: ({jsx}) => jsx`
        <Form
          fields={[
            {name: 'username', type: 'input'},
          ]}
        />
      `,
    },
  ],

  // TODO
  testcases: [
    {
      desc: 'fields are correct html elements',
      app: `
        import { Form } from 'fansjs/ui';
        
        export const App = () => (
          <Form
            fields={[
              {name: 'username', type: 'input'},
            ]}
          />
        );
      `,
      verify: async ({page, util}) => {
        await util.verifyElem('#username', {tag: 'input'});
      },
    },

    {
      desc: 'submit can collect field values',
      app: `
        import { Form } from 'fansjs/ui';
        
        export const App = () => (
          <Form
            fields={[
              {name: 'username', type: 'input'},
              {name: 'password', type: 'input'},
              {name: 'login', type: 'submit'},
            ]}
          />
        );
      `,
      verify: async ({page, util}) => {
        await util.verifyElem('#username', {tag: 'input'});

        await util.verifyLog(() => {
          page.fill('#username', 'foo');
          page.fill('#password', 'bar');
          page.click('#login');
        }, (log) => {
          const data = JSON.parse(log);
          util.assert(data.username, 'foo');
          util.assert(data.password, 'bar');
        });
      },
    },
  ],
};
