import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import * as jose from 'jose';

import { API } from 'fansjs';
import { Form, message } from 'fansjs/ui';

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

Auth.Profile = ({user}) => {
  user = user || Auth.useUser();
  return (
    <div>
      <div>Username: {user.username}</div>
    </div>
  );
};

Auth.Login = ({user, done, ...props}) => {
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
            if (done) {
              done();
            }
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
