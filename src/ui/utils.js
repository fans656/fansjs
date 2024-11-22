import _ from 'lodash';

export function getKey(d) {
  return d.key || d.name || d.label;
}

export function getLabel(d) {
  return d.label || _.capitalize(d.name) || d.key;
}

export function normalizedLink(d) {
  return {
    ...d,
    key: d.key || d.path || d.href || d.name || d.label || d.title || '',
    path: d.path || d.href || d.key || '',
    label: d.label || d.name || '',
  };
}

export function normalizedFormField(field) {
  field = {...field};

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
  
  field.key = field.key || field.name || field.label;
  field.label = field.label || field.name || field.key;

  return field;
}

export function Noop({children}) {
  return children;
}
