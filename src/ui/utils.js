import _ from 'lodash';

export function getKey(d) {
  return d.key || d.name || d.label;
}

export function getLabel(d) {
  return d.label || _.capitalize(d.name) || d.key;
}

export function getPath(d) {
  return d.path || `/${d.name}`;
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

  // normalize type (e.g. password -> input, submit -> button)
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

  // normalize attr (e.g. button -> nolabel)
  switch (field.type) {
    case 'input':
      if (field.enter == null) {
        field.enter = true;
      }
      break;
    case 'button':
      field.nolabel = true;
      break;
    default:
      break;
  }
  
  field.key = getKey(field);
  field.label = getLabel(field);

  return field;
}

export function Noop({children}) {
  return children;
}
