import React, { useEffect } from 'react';
import { BrowserRouter, useInRouterContext, useNavigate } from 'react-router-dom';

import { env } from 'fansjs/env';

export function Root({children}) {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return (
      <_Root>{children}</_Root>
    );
  } else {
    // use BrowserRouter for simplicity, can be changed
    return (
      <BrowserRouter>
        <_Root>{children}</_Root>
      </BrowserRouter>
    );
  }
}

function _Root({children}) {
  useEnvSetup();
  return children;
}

function useEnvSetup() {
  env.navigate = useNavigate();
}
