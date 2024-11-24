import { Auth, Layout, Routed } from 'fansjs/ui';

import { getLabel, getPath } from './utils';

export function App({
  children,
}) {
  const links = children.map(toLink);
  const routes = children.map(d => toRoute(d, links));
  return (
    <Auth>
      <Routed>
        {routes}
      </Routed>
    </Auth>
  );
}

function Page({links = [], children}) {
  return (
    <Layout>
      <Layout.Header
        links={links}
        auth={true}
      />
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  );
}

function toRoute(spec, links) {
  return {
    path: getPath(spec),
    comp: (
      <Page links={links}>
        {spec.comp}
      </Page>
    ),
  };
}

function toLink(spec) {
  return {
    label: getLabel(spec),
    path: getPath(spec),
  };
}
