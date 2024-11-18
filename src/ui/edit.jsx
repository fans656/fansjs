import React, { useMemo, useState, useEffect, useCallback } from 'react';
import yaml from 'js-yaml';
import { Input } from 'antd';

import { Actions } from 'fansjs/ui';

export function Edit({data, save, ...props}) {
  const [text, set_text] = useState();
  
  const reset = useCallback(() => {
    set_text(yaml.dump(data));
  }, [data]);

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="vert margin">
      <Input.TextArea
        autoSize={true}
        value={text}
        onChange={({target}) => set_text(target.value)}
        {...props}
      />
      <div className="horz right">
        <Actions actions={[
          {label: 'Reset', done: () => reset()},
          {label: 'Save', done: () => {
            save(yaml.load(text));
          }},
        ]}/>
      </div>
    </div>
  );
}
