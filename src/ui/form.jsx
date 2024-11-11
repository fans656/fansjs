import React from 'react';
import { Form as AntdForm, Input } from 'antd';

import { Button } from 'fansjs/ui';

export function Form({
  size = 'default',
  fields = [],
  submit = () => {},
  prefix = '',
  style = {},
}) {
  const conf = confs[size] || (() => {
    console.warn(`invalid size: ${size}`);
    return confs['default'];
  })();
  const [form] = AntdForm.useForm();
  return (
    <AntdForm
      form={form}
      labelCol={{span: conf.labelSpan}}
      wrapperCol={{span: conf.wrapperSpan}}
      onFinish={submit}
      style={style}
    >
      {fields.map((field, index) => (
        <Field
          key={field.name || index}
          field={field}
          conf={conf}
          form={form}
          prefix={prefix}
        />
      ))}
    </AntdForm>
  );
}

function Field({field, conf, form, prefix}) {
  field = normalizeField(field);

  let comp = null;
  switch (field.type) {
    case 'input':
      comp = (
        <Input
          type={field.password ? 'password' : null}
          onPressEnter={field.enter ? form.submit : null}
        />
      );
      break;
    case 'button':
      comp = (
        <Button
          type={field.primary ? 'primary' : null}
          onClick={field.submit ? form.submit : null}
        >
          {field.label || field.name}
        </Button>
      );
      break;
    default:
      break;
  }
  let wrapperCol;
  if (field.nolabel) {
    wrapperCol = {offset: conf.labelSpan, span: conf.wrapperSpan};
  }
  return (
    <AntdForm.Item
      name={prefix + field.name}
      label={field.nolabel ? null : field.label || field.name}
      wrapperCol={wrapperCol}
    >
      {comp}
    </AntdForm.Item>
  );
}

function normalizeField(field) {
  switch (field.type) {
    case 'password':
      field.type = 'input';
      field.password = true;
      break;
    case 'submit':
      field.type = 'button';
      field.submit = true;
      field.primary = true;
      field.nolabel = true;
      break;
    default:
      break;
  }

  switch (field.type) {
    case 'button':
      field.nolabel = true;
      break;
    default:
      break;
  }

  return field;
}

const confs = {
  // 'small': {
  //   labelSpan: 2,
  //   wrapperSpan: 4,
  // },
  'default': {
    labelSpan: 8,
    wrapperSpan: 16,
  },
  // 'large': {
  //   labelSpan: 6,
  //   wrapperSpan: 8,
  // },
};
