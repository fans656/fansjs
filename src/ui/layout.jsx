import { useMemo } from 'react';
import { Layout as AntdLayout, ConfigProvider, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import './layout.css';

import { Routed } from './routed';

export function Layout({
  style = {},
  children,
}) {
  style.background = style.background || 'inherit';
  const headerBg = '#222';
  const headerColor = '#ccc';
  const headerHeight = 34;
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerHeight: headerHeight,
            headerBg: headerBg,
            headerColor: headerColor,
            headerPadding: 0,
            siderBg: style.background,
            bodyBg: style.background,
          },
          Menu: {
            darkItemBg: headerBg,
            darkItemColor: headerColor,
            horizontalLineHeight: headerHeight,
            itemHeight: headerHeight,
          },
        }
      }}
    >
      <AntdLayout>
        {children}
      </AntdLayout>
    </ConfigProvider>
  );
}

export function Header({
  links = [],
  children,
}) {
  const location = Routed.useLocation();
  const selectedKeys = useMemo(() => {
    // use first match
    const link = links.filter(d => getHref(d).startsWith(location.pathname))[0];
    return link ? [getHref(link)] : [];
  }, [links, location.pathname]);
  if (links && !children) {
    children = (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        items={links.map(link => ({
          key: getKey(link),
          label: (
            <Link to={getHref(link)}>
              {getTitle(link)}
            </Link>
          ),
          onClick: () => {
            if (link.href) {
              window.location.href = link.href;
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
        // borderBottom: '1px solid #eee',
      }}
    >
      {children}
    </AntdLayout.Header>
  );
}

export function Left({
  children,
}) {
  return (
    <Sider
      style={{
        borderRight: '1px solid #eee',
      }}
    >
      {children}
    </Sider>
  );
}

export function Right({
  children,
}) {
  return (
    <Sider
      style={{
        borderLeft: '1px solid #eee',
      }}
    >
      {children}
    </Sider>
  );
}

export function Sider({
  style,
  children,
}) {
  return (
    <AntdLayout.Sider
      style={{
        background: 'inherit',
        ...style
      }}
    >
      {children}
    </AntdLayout.Sider>
  );
}

export function Content({
  style = {},
  children,
}) {
  return (
    <AntdLayout.Content
      style={{
        padding: style.padding == null ? '0 1em' : style.padding,
      }}
    >
      {children}
    </AntdLayout.Content>
  );
}

const getKey = d => d.key || d.href || d.name || d.label || d.title;
const getHref = d => d.href || d.key;
const getTitle = d => d.title || d.label || d.name || d.key;
