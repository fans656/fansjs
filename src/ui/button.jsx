import React from 'react';
import { Button as AntdButton } from 'antd';
import clsx from 'clsx';

import { TableContext } from './contexts';

export function Button({
  children,
  ...props
}) {
  const inTable = React.useContext(TableContext);
  return (
    <AntdButton
      className={clsx('fansui-button', props.className)}
      size={inTable ? 'small' : props.size}
      {...props}
    >
      {children}
    </AntdButton>
  );
}
