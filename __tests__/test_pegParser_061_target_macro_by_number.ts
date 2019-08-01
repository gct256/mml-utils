import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`=*` と数字でマクロ対象となること', () => {
  expect(parse('=*42')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NO,
    value: { no: 42 },
  });
});

test('`=` を複数置いても正当であること', () => {
  expect(parse('====*42')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NO,
    value: { no: 42 },
  });
});

test('`=` を後ろに置いても正当であること', () => {
  expect(parse('====*42====')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NO,
    value: { no: 42 },
  });
});

test('`*` + 数字の前後に空白をおけること', () => {
  expect(parse('=   *42   =')[0]).toMatchObject({
    type: MmlType.TARGET_MACRO_BY_NO,
    value: { no: 42 },
  });
});

test('後ろに演奏データを置けること', () => {
  expect(parse('=*42 _')[2]).toMatchObject({
    type: MmlType.QUICK_REST,
    value: { count: 1 },
  });
});

test('`*` と数字・カッコの間には何も置けないこと', () => {
  expect(() => parse('== * 42')).toThrow();
  expect(() => parse('== * == 42 ==')).toThrow();
});
