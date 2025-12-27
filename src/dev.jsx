import React, { useEffect, useState } from 'react';
import _ from 'lodash';
//import { LazyLog } from "@melloware/react-logviewer";

import { Jober } from 'fansjs/jober';

//export default function() {
//  return (
//    <Jober/>
//  );
//}

export default function() {
  const [logs, set_logs] = useState([]);
  useEffect(() => {
    set_logs(_.range(10).map(i => `this is line ${i}`));
    //setInterval(() => {
    //  set_logs(logs => {
    //    return [...logs, `this is line ${logs.length + 1}`];
    //  });
    //}, 1000);
  }, []);
  //return (
  //  <LazyLog
  //    text={logs.join('\n')}
  //  />
  //);
  return <div>log viewer</div>;
}
