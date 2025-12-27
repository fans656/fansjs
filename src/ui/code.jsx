import styleInject from 'style-inject';
import clsx from 'clsx';

export function Code({children, className, style}) {
  return (
    <pre
      className={clsx('fansui-code', className)}
      style={style}
    >
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
