import React, { useEffect, useState, useMemo, useCallback } from 'react';
import _ from 'lodash';

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
  const jobs = useCollection({
    source: async (set_data) => {
      const res = await api.get('/api/jobs');
      set_data(res.data);
    },
  });
  const runs = useCollection({
    source: async (set_data) => {
      if (jobs.current) {
        const res = await api.get('/api/runs', {params: {job_id: jobs.current.id}});
        set_data(res.data.reverse());
      }
    },
  }, [jobs.current]);
  
  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    eventSource.onmessage = (event) => {
      event = JSON.parse(event.data);
      switch (event.type) {
        case 'run_status':
          jobs.update(event.job_id, {'status': event.status});
          break;
      }
      //console.log(event);
    };
    return () => eventSource.close();
  }, []);

  return (
    <div className="horz margin stretch">
      <JobsList jobs={jobs.data} set_curJob={jobs.set_current}/>
      <div className="flex-1" style={{marginLeft: '1em'}}>
        {jobs.current ? (
          <JobDetail
            job={jobs.current}
            run={runs.current}
            runs={runs.data}
            set_curRun={runs.set_current}
          />
        ) : (
          <div>dashboard</div>
        )}
      </div>
    </div>
  );
}

function JobsList({jobs, set_curJob}) {
  return (
    <List
      data={jobs}
      render={job => job.name}
      domain="job"
      onSelected={set_curJob}
      style={{minWidth: '30em'}}
      actions={(job) => {
        return {
          'Stop': {hover: true, onAction: () => console.log('stop', job)},
          'Status': (
            <div
              className="small mono"
              style={{
                width: '7ch',
                color: getJobStatusColor(job.status),
              }}
            >
              {_.capitalize(job.status)}
            </div>
          ),
        };
      }}
    />
  );
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

function getJobStatusColor(status) {
  switch (status) {
    case 'running':
      return 'green';
    case 'error':
      return 'red';
  }
}

function useCollection({
  source = undefined,
  key = 'id',
}, deps = []) {
  const [source_items, set_source_items] = useState([]);
  
  const refresh = useCallback(async () => {
    if (source) {
      await source(set_source_items);
    }
  }, [...deps]);
  
  // initial load
  useEffect(() => {
    refresh();
  }, [...deps]);
  
  const mapping = useMemo(() => {
    return Object.fromEntries(source_items.map((item, index) => [item[key], index]));
  }, [source_items, ...deps]);
  
  const [items, set_items] = useState([]);
  useEffect(() => {
    set_items(source_items);
  }, [source_items, ...deps]);
  
  const [currentKey, set_currentKey] = useState();
  const current = useMemo(() => items[mapping[currentKey]], [items, mapping, currentKey, ...deps]);
  const set_current = useCallback(item => set_currentKey(item ? item[key] : null), [mapping, ...deps]);
  
  const update = useCallback((key, fields) => {
    const index = mapping[key];
    if (index != null) {
      set_items([
        ...source_items.slice(0, index),
        Object.assign({}, source_items[index], fields),
        ...source_items.slice(index + 1, source_items.length),
      ]);
    }
  }, [source_items, mapping, ...deps]);
  
  const ref = React.useRef({});

  ref.current.data = items;
  ref.current.current = current;
  ref.current.set_current = set_current;
  ref.current.refresh = refresh;
  ref.current.update = update;
  
  return ref.current;
}
