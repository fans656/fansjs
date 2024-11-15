import styleInject from 'style-inject';

import { Routed } from 'fansjs/ui';

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
                history.pushState(
                  "",
                  document.title,
                  window.location.pathname + window.location.search,
                );
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
  item = normalizedItem(item);
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
        {item.label}
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

function normalizedItem(item) {
  item = {...item};
  item.label = item.label || item.name || item.key;
  return item;
}

styleInject(`
  .fansui-toc ul {
    list-style: none;
    padding: 0 1.4em;
  }

  .fansui-toc li {
    margin-top: .4em;
    font-size: .9em;
  }

  .fansui-toc > ul {
    padding: 0 .8em;
  }

  .fansui-toc .fansui-toc-link, .fansui-heading-link {
    color: inherit;
    text-decoration: inherit;
  }
`);

// for unit test
export { normalizedItem };
