import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`@` と数字で音色指定となること', () => {
  expect(parse('@42')[0]).toMatchObject({
    type: MmlType.QUICK_VOICE,
    value: { no: 42 },
  });
});

test('`@` と(名前)で音色指定となること', () => {
  expect(parse('@(foo)')[0]).toMatchObject({
    type: MmlType.QUICK_NAMED_VOICE,
    value: { name: 'foo' },
  });
});

test('名前は小文字となること', () => {
  expect(parse('@(FOO)')[0]).toMatchObject({
    type: MmlType.QUICK_NAMED_VOICE,
    value: { name: 'foo' },
  });
});

test('`@` のみはエラーとなること', () => {
  expect(() => parse('@')).toThrow();
});
