import React, { useMemo } from 'react';
import { Table as AntdTable } from 'antd';

import { Actions } from 'fansjs/ui';

import { TableContext } from './contexts';

export function Table({
  data = [],
  cols,
  ...attrs
}) {
  const {dataSource, columns} = useMemo(() => {
    const dataSource = data.map((datum, index) => {
      return {
        key: index,
        ...datum,
        __data: datum,
      };
    });
    let columns;
    if (cols) {
      columns = cols.map(toAntdColumn);
    } else {
      columns = Object.entries(data[0]).map(([key, value]) => {
        return {
          key: key,
          dataIndex: key,
          title: key,
        };
      });
    }
    return {dataSource, columns};
  }, [data, cols]);
  return (
    <TableContext.Provider value={true}>
      <AntdTable
        dataSource={dataSource}
        columns={columns}
        bordered
        size="small"
        pagination={false}
        {...attrs}
      />
    </TableContext.Provider>
  );
}

function toAntdColumn(col, index) {
  return {
    title: col.label || col.name || index,
    dataIndex: col.name,
    key: col.name || col.label,
    render: toAntdRender(col),
  };
}

function toAntdRender(col) {
  if (col.render) {
    return (_, item) => col.render(item);
  } else if (col.actions) {
    return (_, item) => <Actions actions={col.actions} data={item.__data}/>;
  } else {
    return null;
  }
}
