import React, { useState, useEffect, useCallback, useMemo } from 'react';
import qs from 'qs';
import _ from 'lodash';

import { message } from 'fansjs/ui';

const MODULE = 'fansjs.api';

export class API {
  constructor(
    // e.g. https://auth.fans656.me
    // default will request to same domain
    host = '',  // 
  ) {
    this.host = host;
  }
  
  async get(path, args, conf) {
    return this.request('GET', path, {...conf, args});
  }
  
  useGet(...args) {
    const {res} = useGetController(...args);
    return res;
  }

  useGetController(path, args, {deps, ...conf} = {}) {
    const [res, set_res] = useState();

    const refresh = useCallback(() => {
      (async () => {
        set_res(await this.get(path, args, conf));
      })();
    }, []);

    const controller = useMemo(() => {
      return {
        refresh,
      };
    }, [refresh]);

    useEffect(() => {
      refresh();
    }, [...(deps || [])]);

    return {res, controller};
  }
  
  async post(path, data, conf) {
    return this.request('POST', path, {...conf, data});
  }
  
  async request(
    // string - 'GET' | 'POST'
    method,
    // string - e.g. '/api/lgoin'
    path,
    // dict - conf
    {
      // object - request query parameters
      args,
      
      // object - request body
      data,

      // string - expected result type
      // 'json' to get `(await fetch()).json()` result
      // 'raw' to get raw `fetch()` result
      res: resultType = 'json',
    },
  ) {
    const url = makeURL(this.host, path, args);
    const options = makeOptions(method, {data});
    console.debug(`${MODULE} fetch`, url, options);
    try {
      const res = await fetch(url, options);
      if (resultType === 'raw') {
        return res;
      }
      if (res.status === 200) {
        const contentType = res.headers.get('Content-Type');
        if (contentType === 'application/json') {
          try {
            return await res.json();
          } catch (exc) {
            console.log(`${MODULE} error parsing json`, exc);
          }
        } else {
          // TODO: other content type
          throw Error(`todo: content type ${contentType}`);
        }
      } else {
        // TODO: how to ensure res is fastapi?
        let errorText = res.statusText;
        try {
          const detail = (await res.json()).detail;
          if (detail) {
            errorText = _.isString(detail) ? detail : JSON.stringify(detail);
          }
        } catch (exc) {
          // noop
        }
        message.error(errorText);
        throw res;
      }
      return res;
    } catch (exc) {
      // TODO: use onError handler
      console.log(`${MODULE} fetch failed`, exc);
      throw exc;
    }
  }
}

export function makeURL(host, path, args) {
  let url = host + path;
  if (args) {
    url += '?' + qs.stringify(args);
  }
  return url;
}

export function makeOptions(method, conf) {
  const options = {
    method,
    headers: new Headers(),
  };
  if (conf.data) {
    // TODO: more types of data
    // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#setting_a_body
    if (_.isObject(conf.data)) {
      options.body = JSON.stringify(conf.data);
      options.headers.append('Content-Type', 'application/json');
    } else {
      throw Error(`unsupported data type ${typeof conf.data}`);
    }
  }
  return options;
}
