import styleInject from 'style-inject';

export function Code({children, style}) {
  return (
    <pre className="fansui-code" style={style}>
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
    margin: 0;
  }

  .fansui-code > code {
    font-family: Consolas, Courier, monospace;
  }
`);
