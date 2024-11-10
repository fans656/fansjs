export const doc = {
  title: 'Form',

  samples: [
    {
      name: 'Fields',
      app: `
        import { Form } from 'fansjs/ui';
        
        export const App = () => (
          <Form
            fields={[
              {name: 'username', type: 'input'},
              {name: 'password', type: 'password'},
              {name: 'login', type: 'submit'},
            ]}
          />
        );
      `,
    },
  ],

  testcases: [
    {
      desc: 'fields are correct html elements',
      app: `
        import { Form } from 'fansjs/ui';
        
        export const App = () => (
          <Form
            fields={[
              {name: 'username', type: 'input'},
              {name: 'password', type: 'password'},
              {name: 'login', type: 'submit'},
            ]}
          />
        );
      `,
      verify: async ({util}) => {
        await util.verifyElem('#username', {tag: 'input'});
        await util.verifyElem('#password', {tag: 'input', attrs: {type: 'password'}});
        await util.verifyElem('#login', {tag: 'button'});
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
            submit={(values) => {
              console.log(JSON.stringify(values));
            }}
          />
        );
      `,
      verify: async ({page, util}) => {
        await page.fill('#username', 'foo');
        await page.fill('#password', 'bar');
        await page.click('#login');
        await util.verifyLog(log => {
          const data = JSON.parse(log);
          util.assert(data.username === 'foo');
          util.assert(data.password === 'bar');
        });
      },
    },
  ],
};
