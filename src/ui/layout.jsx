import { useMemo } from 'react';
import { Layout as AntdLayout, ConfigProvider, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import clsx from 'clsx';
import styleInject from 'style-inject';

import { Routed } from './routed';

export function Layout({
  style = {},
  id,
  className,
  children,
}) {
  const headerBg = style.background || '#222';
  const headerColor = style.color || '#ccc';
  const headerHeight = style.height || 34;
  style.background = style.background || 'inherit';
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
      <AntdLayout
        id={id}
        className={className}
        style={style}
      >
        {children}
      </AntdLayout>
    </ConfigProvider>
  );
}

Layout.Header = ({
  links = [],
  children,
}) => {
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

Layout.Left = ({
  style = {},
  children,
}) => {
  return (
    <Layout.Sider
      style={{
        borderRight: '1px solid #eee',
        ...style,
      }}
    >
      {children}
    </Layout.Sider>
  );
}

Layout.Right = ({
  style = {},
  children,
}) => {
  return (
    <Layout.Sider
      style={{
        borderLeft: '1px solid #eee',
        ...style,
      }}
    >
      {children}
    </Layout.Sider>
  );
}

Layout.Sider = ({
  style,
  children,
}) => {
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

Layout.Content = ({
  center,
  style = {},
  className,
  children,
}) => {
  return (
    <AntdLayout.Content
      className={clsx(
        className,
        'fansui-layout-content',
        center && 'center',
      )}
      style={style}
    >
      {children}
    </AntdLayout.Content>
  );
}

const getKey = d => d.key || d.href || d.name || d.label || d.title;
const getHref = d => d.href || d.key;
const getTitle = d => d.title || d.label || d.name || d.key;

styleInject(`
  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
  }

  html, body {
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    display: flex;
    flex-direction: column;
  }

  body, #root {
    flex: 1;
  }

  .horz {
    display: flex;
  }

  .flex-1 {
    flex: 1;
  }

  .bordered {
    border: 0.5px solid #ccc;
  }

  .padding {
    padding: .5rem 1rem;
  }
  
  .fansui-layout-content.center {
    display: flex;
    justify-content: space-around;
  }
`);

