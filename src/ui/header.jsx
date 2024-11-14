import { useMemo } from 'react';
import { Layout as AntdLayout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import { Routed } from './routed';
import { normalizedLink } from './utils';

export function Header({
  links = [],
  style = {},
  children,
}) {
  links = links.map(normalizedLink);
  const location = Routed.useLocation();
  const selectedKeys = useMemo(() => {
    const link = links.filter(d => d.path.startsWith(location.pathname))[0];
    return link ? [link.path] : [];
  }, [links, location.pathname]);
  if (links && !children) {
    children = (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        items={links.map(link => ({
          key: link.key,
          label: (
            <Link to={link.path}>
              {link.label}
            </Link>
          ),
          onClick: () => {
            if (link.path) {
              window.location.href = link.path;
            }
          },
        }))}
        style={{ flex: 1, minWidth: 0 }}
      />
    );
  }
  return (
    <AntdLayout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: style.zIndex == null ? 1 : style.zIndex,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </AntdLayout.Header>
  );
}
