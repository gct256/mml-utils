import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`T` と数値でテンポとなること', () => {
  expect(parse('t120')[0]).toMatchObject({
    type: MmlType.TEMPO,
    value: { tempo: 120 },
  });
  expect(parse('T150')[0]).toMatchObject({
    type: MmlType.TEMPO,
    value: { tempo: 150 },
  });
});

test('テンポには小数を指定できること', () => {
  expect(parse('t112.5')[0]).toMatchObject({
    type: MmlType.TEMPO,
    value: { tempo: 112.5 },
  });
});
