export function normalizedLink(d) {
  return {
    key: d.key || d.path || d.href || d.name || d.label || d.title || '',
    path: d.path || d.href || d.key || '',
    label: d.label || d.name || '',
  };
}
