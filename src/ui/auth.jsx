import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import * as jose from 'jose';
import { Modal } from 'antd';

import { API, noop } from 'fansjs';
import { Form, Action, Routed, message } from 'fansjs/ui';

const UserContext = React.createContext();

export function Auth({children}) {
  const user = useUser();
  return user.refreshed ? (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  ) : null;
}

Auth.useUser = () => {
  return React.useContext(UserContext);
};

Auth.Profile = ({user, done = noop, ...props}) => {
  user = user || Auth.useUser();
  return (
    <div className="vert xs-margin" {...props}>
      <div>Username: <span className="username">{user.username}</span></div>
      <div>
        <Action
          action={{
            name: 'Change password',
            done: () => {
              const modal = Modal.info();
              modal.update({
                title: 'Change password',
                content: <ChangePassword user={user} done={modal.destroy}/>,
                icon: null,
                footer: null,
                maskClosable: true,
              });
            },
          }}
        />
      </div>
      <div>
        <Action
          action={{
            name: 'Log out',
            id: 'logout',
            done: () => {
              user.logout();
              message.success('Logged out');
              done();
            },
          }}
        />
      </div>
    </div>
  );
};

Auth.Login = ({user, req = {}, done = noop, ...props}) => {
  user = user || Auth.useUser();
  return (
    <Form
      {...props}
      fields={[
        {name: 'username', label: 'Username', type: 'input'},
        {name: 'password', label: 'Password', type: 'password'},
        {name: 'login', label: 'Login', type: 'submit'},
      ]}
      submit={async ({username, password}) => {
        const res = await new API().post('/api/login', {
          data: {
            username,
            password,
            ...req,
          },
          parse: false,
        });
        switch (res.status) {
          case 200:
            user.refresh();
            message.success('Logged in');
            done({res});
            break;
          case 400:
            message.error((await res.json()).detail);
            break;
          case 422:
            message.error('Invalid input');
            break;
          default:
            message.error('Unknown error');
            console.log(res);
            break;
        }
      }}
    />
  );
};

Auth.Grant = () => {
  const query = Routed.useQuery();
  const grantRef = React.useRef();
  useEffect(() => {
    if (query.grant !== grantRef.current) {
      grantRef.current = query.grant;
      if (grantRef.current) {
        (async () => {
          await new API().post('/api/grant', {data: {
            auth_server: query.auth_server,
            grant: query.grant,
          }});
          window.location.href = query.redirect_uri;
        })();
      }
    }
  }, [query.grant]);
  return (
    <div>
      grant
    </div>
  );
};

function ChangePassword({user, done = noop}) {
  return (
    <Form
      fields={[
        {name: 'old_password', label: 'Old password', type: 'password'},
        {name: 'new_password', label: 'New password', type: 'password'},
        {name: 'confirmed_new_password', label: 'Confirm', type: 'password'},
        {name: 'submit', label: 'Submit', type: 'submit'},
      ]}
      submit={async (values) => {
        if (values.new_password === values.confirmed_new_password) {
          await new API().post('/api/change-password', {data: {
            username: user.username,
            old_password: values.old_password,
            new_password: values.new_password,
          }})
          message.success('Changed');
          done();
        } else {
          message.error('Mismatch');
        }
      }}
    />
  );
}

function useUser() {
  const [data, set_data] = useState();
  
  const refresh = useCallback(() => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const data = jose.decodeJwt(token);
        set_data({
          username: data.username,
          admin: data.admin,
          refreshed: true,
        });
      } catch (e) {
        console.error('user.refresh exception', e);
        set_data({username: undefined, refreshed: true});
      }
    } else {
      set_data({username: undefined, refreshed: true});
    }
  }, []);
  
  const logout = useCallback(() => {
    Cookies.remove('token');
    refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, []);

  const user = useMemo(() => {
    return {
      ...data,
      valid: data && data.username != null,
      refresh,
      logout,
    };
  }, [data, refresh, logout]);
  
  return user;
}
