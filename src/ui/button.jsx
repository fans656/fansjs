import React from 'react';
import { Button as AntdButton } from 'antd';
import clsx from 'clsx';

import { TableContext } from './contexts';

export function Button({
  children,
  className,
  ...attrs
}) {
  const inTable = React.useContext(TableContext);
  return (
    <AntdButton
      className={clsx('fansui-button', className)}
      size={inTable ? 'small' : null}
      {...attrs}
    >
      {children}
    </AntdButton>
  );
}
