import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Tabs as AntdTabs } from 'antd';
import Mousetrap from 'mousetrap';

import colors from 'fansjs/colors';

import { useUIContext } from 'fansjs/ui/context';

export function Tabs({
  children,
  defaultActiveKey,
  queryKey = 'tab',
  shortcutPrefix = 'alt',
  args,
}) {
  const uiContext = useUIContext();
  const tabs = normalizedTabs({tabs: children});
  const query = uiContext.useQuery();

  const [activeTabKey, _set_activeTabKey] = useState(
    query[queryKey] || defaultActiveKey || tabs[0] && tabs[0].key
  );
  const set_activeTabKey = useCallback((key) => {
    _set_activeTabKey(key);
    if (queryKey) {
      uiContext.setQuery({[queryKey]: key === tabs[0].key ? undefined : key});
    }
  }, []);

  useEffect(() => {
    if (shortcutPrefix) {
      tabs.forEach((tab, index) => {
        Mousetrap.bind(`${shortcutPrefix}+${index + 1}`, () => {
          const key = tabs[index].key
          set_activeTabKey(key);
        });
      });
      return () => {
        tabs.forEach((tab, index) => {
          Mousetrap.unbind(`${shortcutPrefix}+${index + 1}`);
        });
      };
    }
  }, [shortcutPrefix]);
  return (
    <AntdTabs
      size="small"
      activeKey={activeTabKey}
      onChange={activeTabKey => set_activeTabKey(activeTabKey)}
      tabBarStyle={{
        marginBottom: 0,
      }}
      items={tabs.map(tab => ({
        key: tab.key,
        label: tab.title,
        children: !!tab.render && tab.render(...(args || [])),
      }))}
    />
  );
}

function normalizedTabs({tabs}) {
  return (tabs || []).map(tab => ({
    key: tab.key || tab.name || tab.title,
    title: tab.title || tab.name,
    render: tab.render,
  }));
}

