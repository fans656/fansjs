import { Auth, Layout, Routed } from 'fansjs/ui';

import { getLabel, getPath } from './utils';

export function App({
  auth = true,
  children,
}) {
  const links = children.map(toLink);
  if (auth !== '/') {
    children = [
      {name: 'grant', comp: <Auth.Grant/>, path: '/grant'},
      ...children,
    ];
  }
  const routes = children.map(d => toRoute(d, links, {auth}));
  return (
    <Auth>
      <Routed>
        {routes}
      </Routed>
    </Auth>
  );
}

function Page({links = [], auth, children}) {
  return (
    <Layout>
      <Layout.Header
        links={links}
        auth={auth}
      />
      <Layout.Content>
        {children}
      </Layout.Content>
    </Layout>
  );
}

function toRoute(spec, links, {auth}) {
  return {
    path: getPath(spec),
    comp: (
      <Page links={links} auth={auth}>
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
