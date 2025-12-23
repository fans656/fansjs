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
  const [hoveringItem, set_hoveringItem] = useState(null);

  useSyncCurItemFromQuery({domain, data, curItem, set_curItem, getKey, uiContext});

  return (
    <AntdList
      dataSource={data}
      renderItem={item => {
        const selected = curItem && getKey(curItem) == getKey(item);
        const hovering = hoveringItem && getKey(hoveringItem) == getKey(item);
        return (
          <AntdList.Item
            className={clsx('hover-background', selected && 'selected')}
            style={{
              background: selected ? selectedBackground : null,
              '--hover-background': hoverBackground,
            }}
            actions={normalizedActions(actions, item, {hovering})}
            onClick={() => set_curItem(selected ? null : item)}
            onMouseEnter={() => {
              set_hoveringItem(item);
            }}
            onMouseLeave={() => {
              set_hoveringItem(null);
            }}
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

function normalizedActions(actions, item, {hovering}) {
  if (actions == null) {
    return undefined;
  }
  
  if (React.isValidElement(actions)) {
    return [actions];
  }

  if (_.isFunction(actions)) {
    actions = actions(item, {hovering});
  }

  if (_.isObject(actions)) {
    actions = Object.entries(actions).map(([name, action]) => {
      if (_.isFunction(action)) {
        return {name, onAction: action};
      } else if (React.isValidElement(action)) {
        return {name, custom: true, comp: action};
      } else if (_.isObject(action)) {
        return {name, ...action};
      } else {
        console.warning('invalid List action', name, action);
        return {name, onAction: _.noop};
      }
    });
  }

  if (!_.isArray(actions)) {
    console.error('invalid List actions', actions);
    actions = [];
  }

  actions = actions.map(action => {
    if (React.isValidElement(action)) {
      return {custom: true, comp: action};
    } else {
      return action;
    }
  });

  return actions.map(action => {
    if (action.hover && !hovering) {
      return null;
    }

    if (action.custom) {
      return action.comp;
    } else {
      return (
        <Button
          className={`list-action-${action.name}`}
          onClick={() => action.onAction(item)}
          size="small"
          type="link"
        >
          {action.name}
        </Button>
      );
    }
  });
}
