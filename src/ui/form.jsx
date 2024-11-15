import React from 'react';
import { Form as AntdForm, Input } from 'antd';

import { Button } from 'fansjs/ui';

import { normalizedFormField } from './utils';

export function Form({
  fields = [],
  submit = () => {},
  prefix = '',
  style = {},
  ...attrs
}) {
  const conf = {
    labelSpan: 8,
    wrapperSpan: 16,
  };
  const [form] = AntdForm.useForm();
  
  fields = fields.map(normalizedFormField);

  return (
    <AntdForm
      form={form}
      labelCol={{span: conf.labelSpan}}
      wrapperCol={{span: conf.wrapperSpan}}
      onFinish={submit}
      style={style}
      {...attrs}
    >
      {fields.map((field, index) => (
        <Field
          key={field.key || index}
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
      name={prefix + field.key}
      label={field.nolabel ? null : field.label}
      wrapperCol={wrapperCol}
    >
      {comp}
    </AntdForm.Item>
  );
}
