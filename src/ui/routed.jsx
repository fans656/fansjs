import { useMemo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { Layout } from './layout';

export function Routed({children = [], ...options}) {
  const router = useMemo(() => {
    return createBrowserRouter(children.map(page => {
      const element = getPageElement(page, options);
      return {
        path: page.path,
        element: element,
      };
    }), {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    });
  }, []);
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}

function getPageElement(page, options) {
  const content = getContent(page);
  if (page.raw) {
    return content;
  }

  const Wrapper = getWrapper(options);
  if (Wrapper) {
    return <Wrapper>{content}</Wrapper>;
  } else {
    return content;
  }
}

function getContent(page) {
  return page.comp;
}

function getWrapper(options) {
  if (options.header) {
    return ({children}) => (
      <Layout>
        <Layout.Header links={options.header}/>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    );
  }
}

Routed.Link = Link;

Routed.useParams = useParams;
Routed.useLocation = useLocation;
Routed.useQuery = () => {
  const [query, setQuery] = useSearchParams();
  const ret = {};
  for (const [key, value] of query.entries()) {
    ret[key] = value;
  }
  return ret;
};
