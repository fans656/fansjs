import React, { useEffect } from 'react';
import qs from 'qs';

import { Routed, Layout, Toc, Code } from 'fansjs/ui';

import { docs, apps } from 'src/__generated__/docs';

export default function App() {
  const query = qs.parse(window.location.search.substring(1));
  if (query.__app__) {
    const app = apps[query.__app__];
    if (app) {
      return (
        <RenderedApp app={app}/>
      );
    } else {
      return (
        <div>app {query.__app__} not found</div>
      );
    }
  } else {
    return (
      <Routed header={header}>{pages}</Routed>
    );
  }
}

const header = [
  {label: 'Docs', path: '/'},
  //{label: 'Testcases', path: '/testcase'},
];

const pages = [
  //{
  //  path: '/testcase/:id',
  //  comp: (
  //    <Testcase/>
  //  ),
  //  raw: true,
  //},
  //{
  //  path: '/testcase',
  //  comp: (
  //    <Page>
  //      <Testcases/>
  //    </Page>
  //  ),
  //},
  {
    path: '/',
    comp: <Docs/>,
  },
];

//function Testcases() {
//  return (
//    <div>
//      {docs.docs.map(doc => (
//        <div key={doc.id}>
//          <h3 key={doc.id}>{doc.title}</h3>
//          <div>
//            {Object.values(doc.testcases).map(testcase => (
//              <div key={testcase.id} style={{display: 'flex'}}>
//                <div style={{width: '40em', fontFamily: 'Consolas'}}>
//                  <Routed.Link to={`/testcase/${testcase.id}`}>
//                    {testcase.id}
//                  </Routed.Link>
//                </div>
//                <div>{testcase.desc}</div>
//              </div>
//            ))}
//          </div>
//        </div>
//      ))}
//    </div>
//  );
//}
//
//function Testcase() {
//  const {id} = Routed.useParams();
//  const testcase = docs.testcases[id];
//  return testcase ? <testcase.App/> : null;
//}

function Docs() {
  const query = Routed.useQuery();
  const currentDoc = docs[query.cur];
  return (
    <Layout>
      <Layout.Left>
        <Toc
          data={Object.values(docs).map(doc => ({
            key: doc.id,
            label: doc.title,
            href: `?cur=${doc.id}`,
          }))}
          selected={query.cur}
        />
      </Layout.Left>
      <Layout.Content style={{padding: '0 1em'}}>
        {!!currentDoc && <Doc doc={currentDoc}/>}
      </Layout.Content>
      {!!currentDoc && (
        <Layout.Right>
          <Toc
            data={currentDoc.samples.map(sample => ({
              key: sample.id,
              label: sample.title,
            }))}
          />
        </Layout.Right>
      )}
    </Layout>
  );
}

function Doc({doc}) {
  return (
    <div>
      <h2>{doc.title}</h2>
      <div>{doc.desc}</div>
      <div>
        {doc.samples.map(sample => (
          <Sample key={sample.id} sample={sample}/>
        ))}
      </div>
    </div>
  );
}

function Sample({sample}) {
  return (
    <section id={sample.id}>
      <h3>{sample.title}</h3>
      <div>{sample.desc}</div>
      <div className="horz margin stretch">
        {sample.inplace === false ? (
          <a href={`/?__app__=${sample.id}`} target="_blank">Demo app</a>
        ) : (
          <div
            style={{
              minWidth: '40em',
              border: '1px solid #6495ED',
              padding: 10,
            }}
          >
            <sample.App/>
          </div>
        )}
        <Code style={{minWidth: '40em'}}>{sample.app}</Code>
      </div>
    </section>
  );
}

function RenderedApp({app}) {
  useEffect(() => {
    if (app.conf.stayInApp) {
      document.querySelectorAll("a").forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('__app__', qs.parse(window.location.search.substring(1)).__app__);
        link.href = url.toString();
      });
    }
  }, []);
  return (
    <app.App/>
  );
}
