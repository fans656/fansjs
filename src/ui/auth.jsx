import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import * as jose from 'jose';
import { Modal } from 'antd';

import { API, noop } from 'fansjs';
import { Form, Action, message } from 'fansjs/ui';

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
      <div>Username: {user.username}</div>
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

Auth.Login = ({user, done = noop, ...props}) => {
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
        // TODO: login using given auth provider
        const res = await new API().post('/api/login', {
          data: {username, password},
          parse: false,
        });
        switch (res.status) {
          case 200:
            user.refresh();
            message.success('Logged in');
            done();
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
    return {...data, refresh, logout};
  }, [data, refresh, logout]);
  
  return user;
}
