// NOTE: DO NOT MODIFY! (This is auto generated)
import { doc as doc0 } from '../ui/routed.doc.js';
import { doc as doc1 } from '../ui/layout.doc.js';
import { doc as doc2 } from '../ui/form.doc.js';
import { doc as doc3 } from '../ui/code.doc.js';

import { App as app0 } from '../doc/testcases.generated/ui.form__fields_are_correct_html_elements.jsx';
import { App as app1 } from '../doc/testcases.generated/ui.form__submit_can_collect_field_values.jsx';

import { App as sampleApp0 } from '../doc/samples.generated/ui.form__sample_0.jsx';
import { App as sampleApp1 } from '../doc/samples.generated/ui.code__sample_0.jsx';

import { Docs } from './doc';

export const docs = new Docs({
  docs: [
    {id: 'ui.routed', ...doc0},
    {id: 'ui.layout', ...doc1},
    {id: 'ui.form', ...doc2},
    {id: 'ui.code', ...doc3},
  ],
  testcaseApps: {
    'ui.form__fields_are_correct_html_elements': app0,
    'ui.form__submit_can_collect_field_values': app1,
  },
  sampleApps: {
    'ui.form__sample_0': sampleApp0,
    'ui.code__sample_0': sampleApp1,
  },
});