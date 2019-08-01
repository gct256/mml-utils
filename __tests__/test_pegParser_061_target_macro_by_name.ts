import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`=*` `(` 名前 `)` でマクロ対象となること', () => {
  expect(parse('=*(foo)')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NAME,
    value: { name: 'foo' },
  });
});

test('名前は小文字となること', () => {
  expect(parse('=*(FOO)')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NAME,
    value: { name: 'foo' },
  });
});

test('`=` を複数置いても正当であること', () => {
  expect(parse('====*(foo)')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NAME,
    value: { name: 'foo' },
  });
});

test('`=` を後ろに置いても正当であること', () => {
  expect(parse('====*(foo)====')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NAME,
    value: { name: 'foo' },
  });
});

test('`*` + 数字の前後に空白をおけること', () => {
  expect(parse('=   *(foo)   =')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NAME,
    value: { name: 'foo' },
  });
});

test('後ろに演奏データを置けること', () => {
  expect(parse('=*(foo) _')[2]).toMatchObject({
    type: MmlType.QUICK_REST,
    value: { count: 1 },
  });
});

test('`*` と数字・カッコの間には何も置けないこと', () => {
  expect(() => parse('== * (foo)')).toThrow();
  expect(() => parse('== * == (foo) ==')).toThrow();
});
