import { message as antdMessage } from 'antd';

export const message = {
  success: (content) => {
    antdMessage.open({
      type: 'success',
      content: content,
    });
  },

  error: (content) => {
    antdMessage.open({
      type: 'error',
      content: content,
    });
  },
};
