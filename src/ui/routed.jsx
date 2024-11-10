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

export function Routed({children = []}) {
  const router = useMemo(() => {
    return createBrowserRouter(children.map(page => {
      return {
        path: page.path,
        element: page.comp,
      };
    }), {
      future: {
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    });
  }, [children]);
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
