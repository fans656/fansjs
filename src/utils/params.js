import React, { useMemo, useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import qs from 'qs';
import { useLocation } from 'react-router-dom';

import { env } from 'fansjs/env';

export function useQuery() {
  const location = useLocation();
  return React.useMemo(() => parseQuery(location), [location]);
}

export function getQuery() {
  return parseQuery((window || {}).location);
}

export const useInitialQuery = getQuery;

export function parseQuery(location) {
  return _parseQuery(location ? location.search.substring(1) : '');
}

export function setQuery(fields, { clear = false, replace = false } = {}) {
  if (_.isFunction(fields)) {
    fields = fields(getQuery());
  }

  if (!fields) return;

  let params = {};
  if (!clear) {
    params = _parseQuery(window.location.search.substring(1));
  }

  for (const [key, value] of Object.entries(fields)) {
    if (params[key] !== value) {
      if (value == null) {
        delete params[key];
      } else {
        params[key] = value;
      }
    }
  }

  const search = qs.stringify(params, _qs_options);

  let url = window.location.pathname;
  if (search) {
    url += '?' + search;
  }

  env.navigate(url, {replace: replace});
}

function _parseQuery(queryText) {
  return qs.parse(queryText, _qs_options);
}

const _qs_options = {
  encode: false,
  arrayFormat: 'comma',
  commaRoundTrip: true,
  allowEmptyArrays: true,
  decoder: (str, defaultDecoder, charset, type) => {
    if (type === 'value') {
      if (str === 'true') return true;
      if (str === 'false') return false;
    }
    return defaultDecoder(str, defaultDecoder, charset);
  },
};
