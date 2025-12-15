import React from 'react';

import { env } from 'fansjs/env';
import * as utils from 'fansjs/utils';

export const UIContext = React.createContext({
  useQuery: utils.useInitialQuery,
  getQuery: utils.getQuery,
  setQuery: utils.setQuery,
});

export function useUIContext() {
  return React.useContext(UIContext);
}
