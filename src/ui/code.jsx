import './code.css';

export function Code({children}) {
  return (
    <pre className="fansui-code"><code>
      {children}
    </code></pre>
  );
}
