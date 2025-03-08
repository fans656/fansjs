import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Layout as AntdLayout, Menu, Dropdown, Modal } from 'antd';
import Cookies from 'js-cookie';
import qs from 'qs';

import { API } from 'fansjs';
import { Routed, Code, Action, Form, Auth, message } from 'fansjs/ui';

import { normalizedLink } from './utils';

export function Header({
  links = [],
  style = {},

  /**
   * @param {bool|string} - Use authorization provider
   * 
   * true means use https://auth.fans656.me
   * '/' means dialog login form
   */
  auth = false,

  children,
}) {
  links = links.map(normalizedLink);
  const location = Routed.useLocation();
  const selectedKeys = useMemo(() => {
    const link = links.filter(d => d.path.startsWith(location.pathname))[0];
    return link ? [link.path] : [];
  }, [links, location.pathname]);
  const user = Auth.useUser();
  if (links && !children) {
    children = (
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        items={links.filter(link => {
          return !link.admin || user.admin;
        }).map(link => ({
          key: link.key,
          label: (
            <Routed.Link to={link.path}>
              {link.label}
            </Routed.Link>
          ),
        }))}
        style={{ flex: 1, minWidth: 0 }}
      />
    );
  }
  if (auth) {
    children = (
      <div className="horz space flex-1">
        <div className="horz flex-1">
          {children}
        </div>
        <AuthUser provider={auth}/>
      </div>
    );
  }
  return (
    <AntdLayout.Header
      className="header"
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

function AuthUser({provider}) {
  const user = Auth.useUser();
  return (
    <div style={{paddingRight: '1em'}}>
      {user.username ? (
        <span
          className="username clickable"
          onClick={() => {
            const modal = Modal.info();
            modal.update({
              title: 'Profile',
              content: <Auth.Profile user={user} done={modal.destroy}/>,
              icon: null,
              maskClosable: true,
            });
          }}
        >
          {user.username}
        </span>
      ) : (
        <span
          id="goto-login"
          className="clickable"
          onClick={ev => {
            if (provider === '/') {
              const modal = Modal.info();
              modal.update({
                title: 'Login',
                content: <Auth.Login user={user} done={modal.destroy}/>,
                icon: null,
                footer: null,
                maskClosable: true,
              });
            } else {
              window.open(makeLoginUrl(provider));
            }
          }}
        >
          Login
        </span>
      )}
    </div>
  );
}

function makeLoginUrl(provider) {
  if (provider === true) {
    provider = 'https://auth.fans656.me/login';
  }
  // TODO: custom grant endpoint
  const redirect_uri = `${window.location.origin}/grant?` + qs.stringify({
    'redirect_uri': window.location.href,
  });
  return `${provider}?` + qs.stringify({
    'redirect_uri': redirect_uri,
  });
}
