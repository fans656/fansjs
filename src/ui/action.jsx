import React, { useMemo } from 'react';
import { Modal, Popconfirm, Dropdown } from 'antd';
import _ from 'lodash';

import { Edit, Button } from 'fansjs/ui';

import { getKey, getLabel, Noop } from './utils';

/*
action - object {
  type - string: 'button' | 'more' | 'confirm' | 'edit'

data - object 
}
*/
export function Action({action, data}) {
  if (_.isFunction(data)) {
    data = data();
  }
  action = normalizedAction(action);
  const Wrapper = getActionWrapper(action, data);
  const Trigger = getActionTrigger(action);
  return (
    <Wrapper>
      <a onClick={() => handleOnClick({action, data})}>
        {getLabel(action)}
      </a>
    </Wrapper>
  );
}

export function Actions({actions, data}) {
  return (
    <div className="horz xs-margin">
      {actions.map(action => (
        <Action key={getKey(action)} action={action} data={data}/>
      ))}
    </div>
  );
}

function normalizedAction(action) {
  action = {...action};

  if (!action.type) {
    if (action.actions) {
      action.type = 'more';
    } else {
      action.type = 'button';
    }
  }

  return action;
}

function getActionWrapper(action, data) {
  switch (action.type) {
    case 'confirm':
      return ({children}) => (
        <Popconfirm
          title={action.title}
          description={action.desc || 'Are you sure?'}
          onConfirm={() => action.done(data)}
        >
          {children}
        </Popconfirm>
      );
    case 'more':
      return ({children}) => (
        <Dropdown
          menu={{items: (action.actions || []).map(subAction => ({
            key: getKey(subAction),
            danger: subAction.danger,
            label: (
              <Action key={getKey(subAction)} action={subAction} data={data}/>
            ),
          }))}}
        >
          {children}
        </Dropdown>
      );
    default:
      return Noop;
  }
}

function getActionTrigger(action) {
  switch (action.type) {
    case 'button':
      return Button;
    default:
      return ({props, children}) => <a {...props}>{children}</a>;
  }
}

function handleOnClick({action, data}) {
  switch (action.type) {
    case 'edit':
      const modal = Modal.info({
        title: action.title,
        content: (
          <Edit
            data={data}
            save={(data) => {
              if (action.done) {
                action.done(data);
              }
              modal.destroy();
            }}
          />
        ),
        icon: null,
        footer: null,
        maskClosable: true,
        width: '60em',
      });
      break;
    default:
      if (action.done) {
        action.done(data);
      }
      break;
  }
}
