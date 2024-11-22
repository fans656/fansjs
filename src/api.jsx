import React, { useState, useEffect, useCallback, useMemo } from 'react';
import qs from 'qs';
import _ from 'lodash';
import { notification } from 'antd';

import { Code, message } from 'fansjs/ui';

const MODULE = 'fansjs.api';

export class API {
  constructor(
    // e.g. https://auth.fans656.me
    // default will request to same domain
    host = '',  // 
  ) {
    this.host = host;
    
    this.use = () => {
    };
    
    this.use.get
  }
  
  /*
  Sample usage:
  
      // path only
      await get('/api/users');
      
      // params
      await get('/api/users', {params: {offset: 100, limit: 50}});
      
      // conf
      await get('/api/users', {res: 'raw'});
  */
  async get(path, conf) {
    return this.request(path, {...conf, method: 'GET'});
  }
  
  /*
  Sample usage:
  
      // path only
      await post('/api/login');
      
      // data
      await post('/api/login', {data: {username: 'foo', password: 'bar'}});
      
      // params
      await post('/api/login', {params: {grant_type: 'code'}});
      
      // conf
      await post('/api/login', {res: 'raw'});
  */
  async post(path, conf) {
    return this.request(path, {...conf, method: 'POST'});
  }
  
  async request(
    /*
    string - request path, e.g. '/api/lgoin'
    */
    path,

    /*
    request configuration: {

      method: string - request method, e.g. 'GET' / 'POST'

      params: object - request query parameters

      data: union { - request body data
        object - JSON data
      }

      parse: string|bool - way to parse response body
        'json' - `return await (await fetch()).json()`
        false - `return await fetch()`
    }
    */
    conf = {},
  ) {
    const fetchArgs = [
      makeFetchResource(this.host, path, conf.params),
      makeFetchOptions(conf),
    ];
    console.debug(`${MODULE} fetch`, ...fetchArgs);
    try {
      const res = await fetch(...fetchArgs);
      return await handleResult(res, conf);
    } catch (exc) {
      console.debug(`${MODULE} fetch failed`, exc);
      throw exc;
    }
  }

  /*
  Sample usage:
  
      // path only
      const res = useGet('/api/users');
      
      // deps
      const res = useGet('/api/users', {deps: [nonce]});
      
      // controller
      const [res, controller] = useGet('/api/users', {controller: true});
      controller.refresh();
  */
  useGet = (path, {deps = [], ...conf} = {}) => {
    const [res, set_res] = useState();

    const refresh = useCallback(() => {
      (async () => {
        set_res(await this.get(path, conf));
      })();
    }, [path, ...deps]);

    const controller = useMemo(() => {
      return {
        refresh,
      };
    }, [refresh]);

    useEffect(() => {
      refresh();
    }, [refresh]);

    return conf.controller ? [res, controller] : res;
  }
}

function makeFetchResource(host, path, params) {
  let url = host + path;
  if (params) {
    url += '?' + qs.stringify(params);
  }
  return url;
}

// TODO: more types of data (e.g. blob, etc)
// see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#setting_a_body
function makeFetchOptions({method = 'GET', data} = {}) {
  const options = {
    method,
    headers: new Headers(),
  };
  if (data) {
    if (_.isObject(data)) {
      options.body = JSON.stringify(data);
      options.headers.append('Content-Type', 'application/json');
    } else {
      throw Error(`unsupported data type ${typeof data}`);
    }
  }
  return options;
}

async function handleResult(res, conf) {
  const {parse = 'json'} = conf;
  if (!parse) {
    return res;
  }
  switch (parse) {
    case 'json':
      return await handleJsonResult(res, {...conf, parse});
    default:
      throw `unsupported parse type ${parse}`
  }
}

async function handleJsonResult(res, conf) {
  if (res.status === 200) {
    try {
      return await res.json();
    } catch (exc) {
      console.log(`${MODULE} error parsing json`, exc);
      throw exc;
    }
  } else {
    const error = await getError(res, conf);
    await handleError(error);
    throw res;  // allow caller to catch error res
  }
}

function handleError(error) {
  switch (error.type) {
    case 'text':
      if (typeof document !== 'undefined') {
        message.error(error.value);
      }
      return true;
    case 'json':
      if (typeof document !== 'undefined') {
        notification.error({
          description: (
            <Code>{JSON.stringify(error.value, null, 2)}</Code>
          ),
          duration: null,
        });
      }
      return true;
    default:
      return false;
  }
}

async function getError(res, {parse}) {
  if (parse === 'json') {
    try {
      const detail = (await res.json()).detail;
      if (detail) {
        if (_.isString(detail)) {
          return {type: 'text', value: errorText};
        } else {
          return {type: 'json', value: detail};
        }
      }
    } catch (exc) {
      // noop
    }
  }
  return {type: 'text', value: res.statusText};
}

// unit test
export {
  makeFetchResource,
  makeFetchOptions,
};
