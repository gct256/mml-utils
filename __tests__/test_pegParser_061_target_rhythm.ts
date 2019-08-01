import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`=` と`r` でリズム対象となること', () => {
  expect(parse('=r')[0]).toMatchObject({
    type: MmlType.TARGET_RHYTHM,
    value: { channel: 1 },
  });
});

test('r` の後ろに数字をおけること', () => {
  expect(parse('=r42')[0]).toMatchObject({
    type: MmlType.TARGET_RHYTHM,
    value: { channel: 42 },
  });
});

test('`=` を後ろに置いても正当であること', () => {
  expect(parse('=r=')[0]).toMatchObject({
    type: MmlType.TARGET_RHYTHM,
    value: { channel: 1 },
  });
});

test('`=` を複数置いても正当であること', () => {
  expect(parse('====r====')[0]).toMatchObject({
    type: MmlType.TARGET_RHYTHM,
    value: { channel: 1 },
  });
});

test('`r` + 数字の前後に空白をおけること', () => {
  expect(parse('=   r   =')[0]).toMatchObject({
    type: MmlType.TARGET_RHYTHM,
    value: { channel: 1 },
  });
});

test('後ろに演奏データを置けること', () => {
  expect(parse('=r _')[2]).toMatchObject({
    type: MmlType.QUICK_REST,
    value: { count: 1 },
  });
});

test('`=` の間に一つの数字以外は置けないこと', () => {
  expect(() => parse('== == r')).toThrow();
  expect(() => parse('==== r ==== 2')).toThrow();
  expect(() => parse('==== r 2 ====')).toThrow();
});
