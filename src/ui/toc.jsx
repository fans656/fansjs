import { Routed } from 'fansjs/ui';

import './toc.css';

export function Toc({
  data = [],
  selected = undefined,
}) {
  return (
    <div className='fansui-toc'
      style={{
        //paddingLeft: '1.5em',
      }}
    >
      {false && (
        <>
          <a href="#" className="heading-link"
            onClick={(ev) => {
              setTimeout(() => {
                history.pushState("", document.title, window.location.pathname + window.location.search);
              });
            }}
          ><h3>Contents</h3></a>
        </>
      )}
      <ul>
        {data.map((d, idx) => (
          <TocItem
            key={idx}
            item={d}
            selected={selected}
          />
        ))}
      </ul>
    </div>
  );
}

function TocItem({item, selected}) {
  const href = item.href || `#${item.fragment || item.name || item.title}`;
  const highlighted = selected === item.key;
  return (
    <li>
      <Routed.Link
        className="fansui-toc-link"
        to={href}
        style={{
          fontWeight: highlighted ? 'bold' : null,
        }}
      >
        {item.title || item.name}
      </Routed.Link>
      {item.children ? (
        <ul>
          {item.children.map((d, idx) => (
            <TocItem
              key={idx}
              item={d}
              selected={selected}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
