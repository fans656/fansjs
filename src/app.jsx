import {
  Routed, Layout, Toc, Code,
} from 'fansjs/ui';

import { docs } from 'src/doc';

const pages = [
  {
    path: '/testcase/:id',
    comp: (
      <Testcase/>
    ),
  },
  {
    path: '/testcase',
    comp: (
      <Page>
        <Testcases/>
      </Page>
    ),
  },
  {
    path: '/',
    comp: (
      <Page>
        <Docs/>
      </Page>
    ),
  },
];

export default function App() {
  return (
    <Routed>
      {pages}
    </Routed>
  );
}

function Page({children}) {
  return (
    <Layout>
      <Layout.Header
        links={[
          {title: 'Doc', key: '/'},
          {title: 'Testcase', key: '/testcase'},
        ]}
      />
      {children}
    </Layout>
  );
}

function Testcases() {
  return (
    <div>
      {docs.docs.map(doc => (
        <div key={doc.id}>
          <h3 key={doc.id}>{doc.title}</h3>
          <div>
            {Object.values(doc.testcases).map(testcase => (
              <div key={testcase.id} style={{display: 'flex'}}>
                <div style={{width: '40em', fontFamily: 'Consolas'}}>
                  <Routed.Link to={`/testcase/${testcase.id}`}>
                    {testcase.id}
                  </Routed.Link>
                </div>
                <div>{testcase.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Testcase() {
  const {id} = Routed.useParams();
  const testcase = docs.testcases[id];
  return testcase ? <testcase.App/> : null;
}

function Docs() {
  const {cur} = Routed.useQuery();
  return (
    <Layout>
      <Layout.Left>
        <Toc
          data={docs.docs.map(doc => ({
            key: doc.id,
            title: doc.title,
            href: `?cur=${doc.id}`,
          }))}
          selected={cur}
        />
      </Layout.Left>
      <Layout.Content style={{padding: '0 1em'}}>
        <Doc doc={docs[cur]}/>
      </Layout.Content>
    </Layout>
  );
}

function Doc({doc}) {
  return doc ? (
    <div>
      {doc.samples.map(sample => (
        <Sample key={sample.id} sample={sample}/>
      ))}
    </div>
  ) : null;
}

function Sample({sample}) {
  return (
    <div>
      <h3>{sample.title}</h3>
      {sample.norender ? null : (
        <div
          style={{
            border: '1px solid #6495ED',
          }}
        >
          <sample.App/>
        </div>
      )}
      <Code>{sample.app}</Code>
    </div>
  );
}
