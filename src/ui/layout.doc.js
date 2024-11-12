export const doc = {
  title: 'Layout',

  samples: [{
    title: 'Header and Content',
    app: `
      import { Layout } from 'fansjs/ui';

      export const App = () => (
        <Layout>
          <Layout.Header>this is header</Layout.Header>
          <Layout.Content>this is content</Layout.Content>
        </Layout>
      );
    `,
  }, {
    title: 'Header and Sider and Content',
    app: `
      import { Layout } from 'fansjs/ui';

      export const App = () => (
        <Layout>
          <Layout.Header>this is header</Layout.Header>
          <Layout id="asdf" style={{minHeight: '5em'}}>
            <Layout.Left>left panel</Layout.Left>
            <Layout.Content>this is content</Layout.Content>
            <Layout.Right>right panel</Layout.Right>
          </Layout>
        </Layout>
      );
    `,
  }, {
    title: 'Header links',
    app: `
      import { Layout } from 'fansjs/ui';

      export const App = () => (
        <Layout.Header
          links={[
            {label: 'Foo', path: '/foo'},
            {label: 'Bar', path: '/bar'},
          ]}
        />
      );
    `,
  }],
  
  // TODO: change path should update selected link
  // TODO: more tests
};

