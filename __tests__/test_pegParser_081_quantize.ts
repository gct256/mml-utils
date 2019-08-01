import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`Q` と数値で音長比となること', () => {
  expect(parse('q0')[0]).toMatchObject({
    type: MmlType.QUANTIZE,
    value: { rate: 0 },
  });
  expect(parse('q50')[0]).toMatchObject({
    type: MmlType.QUANTIZE,
    value: { rate: 50 },
  });
  expect(parse('q100')[0]).toMatchObject({
    type: MmlType.QUANTIZE,
    value: { rate: 100 },
  });
});

test('0を含む正の整数以外は指定できないこと', () => {
  expect(() => parse('q4.2')).toThrow();
  expect(() => parse('q-2')).toThrow();
});
