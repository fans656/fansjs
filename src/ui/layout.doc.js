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
  }, {
    title: 'Sider width',
    app: `
      import { Layout } from 'fansjs/ui';

      export const App = () => (
        <Layout>
          <Layout.Left width="50%">
            side panel
          </Layout.Left>
          <Layout.Content>
            content
          </Layout.Content>
        </Layout>
      );
    `,
  }],
  
  testcases: [
    {
      desc: 'Layout should make html and body padding 0',
      app: `
        import { Layout } from 'fansjs/ui';
        
        export const App = () => (
          <Layout/>
        );
      `,
      verify: async ({util}) => {
        await util.verifyElem('html', {style: {margin: 0, padding: 0}});
        await util.verifyElem('body', {style: {margin: 0, padding: 0}});
      },
    },
    {
      desc: 'Content should takes full height',
      app: `
        import { Layout } from 'fansjs/ui';
        
        export const App = () => (
          <Layout>
            <Layout.Content id="content"/>
          </Layout>
        );
      `,
      verify: async ({page, util}) => {
        await util.verifyElem('#content', {height: page.viewportSize().height});
      },
    },
    {
      desc: 'Left Sider and Content',
      app: `
        import { Layout } from 'fansjs/ui';
        
        export const App = () => (
          <Layout>
            <Layout.Left id="left"/>
            <Layout.Content id="content"/>
          </Layout>
        );
      `,
      verify: async ({util}) => {
        await util.verifyElem('#left', {width: width => width > 0});
        await util.verifyElem('#content', {x: x => x > 0});
      },
    },
    {
      desc: 'Can specify sider width',
      app: `
        import { Layout } from 'fansjs/ui';
        
        export const App = () => (
          <Layout>
            <Layout.Left id="left" width="50%"/>
            <Layout.Content/>
          </Layout>
        );
      `,
      verify: async ({page, util}) => {
        await util.verifyElem('#left', {width: page.viewportSize().width / 2});
      },
    },
    {
      desc: 'Left sider has right border',
      app: `
        import { Layout } from 'fansjs/ui';
        
        export const App = () => (
          <Layout>
            <Layout.Left id="left" width="50%"/>
            <Layout.Content/>
          </Layout>
        );
      `,
      verify: async ({page, util}) => {
        await util.verifyElem('#left', {styles: d => d.borderRightWidth != '0px'});
      },
    },
    // TODO: change path should update selected link
  ],
};

