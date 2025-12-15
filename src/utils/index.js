import _ from 'lodash';

import { env } from 'fansjs/env';

export { useInitialQuery, useQuery, getQuery, setQuery } from './params';

export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY = {};

export function getKey(item) {
  if (_.isObject(item)) {
    for (const keyField of env.keyFields) {
      const key = item[keyField];
      if (key != null) {
        return key;
      }
    }
    return item;
  } else {
    return item;
  }
}
