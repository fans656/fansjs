import styleInject from 'style-inject';

export function Code({children}) {
  return (
    <pre className="fansui-code">
      <code>
        {children}
      </code>
    </pre>
  );
}

styleInject(`
  .fansui-code {
    background: #eee;
    font-size: 12px;
    padding: 1em;
  }

  .fansui-code > code {
    font-family: Consolas, Courier, monospace;
  }
`);
