import React, { useState, useEffect, useCallback } from 'react'
import _ from 'lodash';
import clsx from 'clsx';
import { List as AntdList } from 'antd';

import { Button } from 'fansjs/ui/button';
import { useUIContext } from 'fansjs/ui/context';
import { getKey as defaultGetKey, EMPTY_ARRAY, EMPTY_OBJECT } from 'fansjs/utils';

function defaultRender(value) {
  if (_.isString(value)) {
    return value;
  } else {
    return JSON.stringify(value);
  }
}

export function List({
  data,
  children,
  render = defaultRender,
  domain = null,
  actions = undefined,
  style = EMPTY_OBJECT,
  onSelected = _.noop,
  getKey = defaultGetKey,
  hoverBackground = 'aliceblue',
  selectedBackground = '#E7F3FD',
  size = "small",
  bordered = true,
}) {
  data = data || children || EMPTY_ARRAY;
  
  const uiContext = useUIContext();
  const [curItem, set_curItem] = useCurItem({domain, uiContext, getKey, onSelected});

  useSyncCurItemFromQuery({domain, data, curItem, set_curItem, getKey, uiContext});

  return (
    <AntdList
      dataSource={data}
      renderItem={item => {
        const selected = curItem && getKey(curItem) == getKey(item);
        return (
          <AntdList.Item
            className={clsx('hover-background', selected && 'selected')}
            style={{
              background: selected ? selectedBackground : null,
              '--hover-background': hoverBackground,
            }}
            actions={normalizedActions(actions, item)}
            onClick={() => set_curItem(selected ? null : item)}
          >
            {render(item)}
          </AntdList.Item>
        );
      }}
      bordered={bordered}
      size={size}
      style={style}
    />
  );
}

function useCurItem({domain, uiContext, getKey, onSelected}) {
  const [curItem, _set_curItem] = useState(null);
  const set_curItem = useCallback(item => {
    _set_curItem(item);
    onSelected(item);
    uiContext.setQuery({[domain]: item ? getKey(item) : undefined});
  }, [domain]);
  return [curItem, set_curItem];
}

function useSyncCurItemFromQuery({domain, data, curItem, set_curItem, getKey, uiContext}) {
  const query = uiContext.useQuery();
  useEffect(() => {
    if (domain && curItem == null) {
      const item = data.filter(item => getKey(item) == query[domain])[0];
      if (item) {
        set_curItem(item);
      }
    }
  }, [data, query[domain]]);
}

function normalizedActions(actions, item) {
  if (_.isFunction(actions)) {
    return actions(item);
  } else if (_.isObject(actions)) {
    return Object.entries(actions).map(([actionName, onAction]) => {
      return (
        <Button onClick={() => onAction(item)} size="small" type="link">
          {actionName}
        </Button>
      );
    });
  } else {
    return actions;
  }
}
