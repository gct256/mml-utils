import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`=` と数字でソング対象となること', () => {
  expect(parse('=1')[0]).toMatchObject({
    type: MmlType.TARGET_SONG,
    value: { channel: 1 },
  });
});

test('`=` を後ろに置いても正当であること', () => {
  expect(parse('=1=')[0]).toMatchObject({
    type: MmlType.TARGET_SONG,
    value: { channel: 1 },
  });
});

test('`=` を複数置いても正当であること', () => {
  expect(parse('====1====')[0]).toMatchObject({
    type: MmlType.TARGET_SONG,
    value: { channel: 1 },
  });
});

test('数字の前後に空白をおけること', () => {
  expect(parse('=   1   =')[0]).toMatchObject({
    type: MmlType.TARGET_SONG,
    value: { channel: 1 },
  });
});

test('後ろに演奏データを置けること', () => {
  expect(parse('=1 _')[2]).toMatchObject({
    type: MmlType.QUICK_REST,
    value: { count: 1 },
  });
});

test('`=` の間に一つの数字以外は置けないこと', () => {
  expect(() => parse('== == 1')).toThrow();
  expect(() => parse('==== 1 ==== 2')).toThrow();
  expect(() => parse('==== 1 2 ====')).toThrow();
});
