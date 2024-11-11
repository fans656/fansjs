export const doc = {
  title: 'Code',

  samples: [
    {
      title: 'Default',
      app: `
        import dedent from 'dedent';

        import { Code } from 'fansjs/ui';
        
        const content = dedent(\`
          import os

          os.system('echo "hello world"')
        \`);
        
        export const App = () => (
          <Code>{content}</Code>
        );
      `,
    },
  ],
};
