import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`*` と数字でマクロ展開となること', () => {
  expect(parse('*1')[0]).toMatchObject({
    type: MmlType.EXPAND_MACRO,
    value: { no: 1 },
  });
});

test('`*` と(名前)でマクロ展開となること', () => {
  expect(parse('*(foo)')[0]).toMatchObject({
    type: MmlType.EXPAND_NAMED_MACRO,
    value: { name: 'foo' },
  });
});

test('名前は小文字となること', () => {
  expect(parse('*(FOO)')[0]).toMatchObject({
    type: MmlType.EXPAND_NAMED_MACRO,
    value: { name: 'foo' },
  });
});

test('`*` のみはエラーとなること', () => {
  expect(() => parse('*')).toThrow();
});
