import React, { useEffect, useState } from 'react';

import { Button, List } from 'fansjs/ui';

import { api } from './api';

export default function Jober({
  origin = '',
}) {
  api.useOrigin(origin);
  
  return (
    <Dashboard/>
  );
}

function Dashboard() {
  const [curJob, set_curJob] = useState(null);
  const [curRun, set_curRun] = useState(null);

  const {jobs} = useJobs();
  const {runs} = useRuns(curJob);

  return (
    <div className="horz margin stretch">
      <JobsList jobs={jobs} set_curJob={set_curJob}/>
      <div className="flex-1" style={{marginLeft: '1em'}}>
        {curJob ? (
          <JobDetail
            job={curJob}
            run={curRun}
            runs={runs}
            set_curRun={set_curRun}
          />
        ) : (
          <div>dashboard</div>
        )}
      </div>
    </div>
  );
}

function JobsList({jobs, curJob, set_curJob}) {
  return (
    <List
      data={jobs}
      render={job => <JobListItem job={job}/>}
      domain="job"
      onSelected={set_curJob}
      style={{minWidth: '30em'}}
    />
  );
}

function JobListItem({job}) {
  return (
    <div>
      <div>{job.name}</div>
      <div className="gray small mono">{job.id}</div>
    </div>
  );
}

function getJobListItemActions(job) {
  return [
    <a>Run</a>,
    <a>Stop</a>,
  ];
}

function JobDetail({job, run, runs, set_curRun}) {
  return (
    <div className="flex-1 vert margin" style={{minHeight: '100%'}}>
      <div className="horz margin center">
        <h3>{job.name}</h3>
        <div className="horz xs-margin small">
          <div>ID: {job.id}</div>
        </div>
      </div>
      <div className="small mono">
        <pre><code>{JSON.stringify(job, null, 2)}</code></pre>
      </div>
      <div className="horz margin flex-1">
        <RunOutput job={job} run={run || runs[0]}/>
        <RunsList
          runs={runs}
          set_curRun={set_curRun}
        />
      </div>
    </div>
  );
}

function RunOutput({job, run}) {
  const [text, set_text] = useState('');
  useEffect(() => {
    if (job && run) {
      (async () => {
        const text = await api.get('/api/logs', {
          params: {
            job_id: job.id,
            run_id: run.run_id,
          },
          parse: 'text',
        });
        set_text(text);
      })();
    }
  }, [run && run.run_id]);
  return (
    <div
      className="flex-1 small mono"
      style={{
        border: '1px solid #ccc',
        padding: '.5em',
      }}
    >
      <pre style={{margin: 0, padding: 0}}>{text}</pre>
    </div>
  );
}

function RunsList({runs=[], set_curRun}) {
  return (
    <List
      data={runs}
      render={run => <RunListItem run={run}/>}
      onSelected={set_curRun}
      getItemId={d => d.run_id}
      domain="run"
      style={{minWidth: '20em'}}
    />
  );
}

function RunListItem({run}) {
  return (
    <div>
      <div>{run.run_id}</div>
    </div>
  );
}

function useJobs() {
  const [jobs, set_jobs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/api/jobs');
      console.log(res);
      set_jobs(res.data);
    })();
  }, []);
  
  return {jobs};
}

function useRuns(job) {
  const [runs, set_runs] = useState([]);
  useEffect(() => {
    if (job && job.id) {
      (async () => {
        const res = await api.get('/api/runs', {params: {job_id: job.id}});
        console.log('runs', res);
        set_runs(res.data.reverse());
      })();
    }
  }, [job && job.id]);
  return {runs};
}
