import _ from 'lodash';
import { message as antdMessage, notification } from 'antd';

import { Code } from 'fansjs/ui';

/*
Sample usage:

    // text
    message.success('Logged in');
    
    // object
    message.error({"type": "missing", "loc": ["body", "password"]});
*/
export const message = {
  success: (content, conf) => {
    showMessage('success', content, conf);
  },

  error: (content, conf) => {
    showMessage('error', content, conf);
  },
};

function showMessage(type, content, conf) {
  if (_.isString(content)) {
    antdMessage.open({
      type,
      content,
    });
  } else {
    notification.open({
      type,
      description: (
        <Code>{JSON.stringify(content, null, 2)}</Code>
      ),
      duration: null,
    });
  }
}
