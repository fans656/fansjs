import { useMemo } from 'react';
import { Layout as AntdLayout, ConfigProvider, Menu, theme } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import clsx from 'clsx';
import styleInject from 'style-inject';

import { Header } from './header';

const headerHeight = 34;

export function Layout({
  style = {},
  id,
  className,
  children,
}) {
  const headerBg = style.background || '#222';
  const headerColor = style.color || '#ccc';
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

Layout.Header = Header;

Layout.Left = ({
  style = {},
  children,
  ...attrs
}) => {
  return (
    <Layout.Sider
      style={{
        borderRight: '1px solid #eee',
        position: 'sticky',
        top: headerHeight,
        left: 0,
        height: '100vh',
        overflow: 'auto',
        ...style,
      }}
      {...attrs}
    >
      {children}
    </Layout.Sider>
  );
}

Layout.Right = ({
  style = {},
  children,
  ...attrs
}) => {
  return (
    <Layout.Sider
      style={{
        borderLeft: '1px solid #eee',
        position: 'sticky',
        top: headerHeight,
        right: 0,
        height: '100vh',
        overflow: 'auto',
        ...style,
      }}
      {...attrs}
    >
      {children}
    </Layout.Sider>
  );
}

Layout.Sider = ({
  style,
  children,
  ...attrs
}) => {
  return (
    <AntdLayout.Sider
      style={{
        background: 'inherit',
        ...style
      }}
      {...attrs}
    >
      {children}
    </AntdLayout.Sider>
  );
}

Layout.Content = ({
  center,
  className,
  children,
  ...attrs
}) => {
  return (
    <AntdLayout.Content
      className={clsx(
        className,
        'fansui-layout-content',
        center && 'center',
      )}
      {...attrs}
    >
      {children}
    </AntdLayout.Content>
  );
}

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

