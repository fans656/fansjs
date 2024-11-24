import React from 'react';
import { Modal } from 'antd';

export const dialog = {
  open: openDialog,
};

function openDialog({
  title,
  content,
}) {
  Modal.info({
    title: title,
    content: content,
    footer: null,
    maskClosable: true,
    icon: null,
  });
}
