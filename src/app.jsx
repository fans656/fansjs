import { Routed, Layout, Header, Left, Content } from 'fansjs/ui';

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
      <Header
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
