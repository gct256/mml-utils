import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`L` と数値でデフォルト長さとなること', () => {
  expect(parse('l16')[0]).toMatchObject({
    type: MmlType.LENGTH,
    value: { duration: 16 },
  });
  expect(parse('L16')[0]).toMatchObject({
    type: MmlType.LENGTH,
    value: { duration: 16 },
  });
  expect(parse('l%12')[0]).toMatchObject({
    type: MmlType.LENGTH,
    value: { frames: 12 },
  });
});

test('付点をつけられること', () => {
  expect(parse('l4..')[0]).toMatchObject({
    type: MmlType.LENGTH,
    value: { duration: 4, dots: 2 },
  });
});

test('数値未指定はエラーとなること', () => {
  expect(() => parse('l')).toThrow();
  expect(() => parse('l..')).toThrow();
});
