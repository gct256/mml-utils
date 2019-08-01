import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`N` と数値で直接音階指定となること', () => {
  expect(parse('n36')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN },
  });
  expect(parse('N36')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN },
  });
});

test('0を指定できること', () => {
  expect(parse('n0')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 0, frames: NaN },
  });
});

test('負の値を指定できること', () => {
  expect(parse('n-36')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: -36, frames: NaN },
  });
});

test('小数は指定できないこと', () => {
  expect(() => parse('n4.2')[0]).toThrow();
});

test('アクセントを指定できること', () => {
  expect(parse('n36!')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, accent: 1 },
  });
  expect(parse('n36~')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, accent: -1 },
  });
});

test('長さを省略して付点を指定できること', () => {
  expect(parse('n36..')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, dots: 2 },
  });
});

test('空白区切りで長さを指定できること', () => {
  expect(parse('n36 4..')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, duration: 4, dots: 2 },
  });
  expect(parse('n36 %42')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: 42 },
  });
});

test('長さがフレーム数指定の場合は空白がなくてもよいこと', () => {
  expect(parse('n36%42')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: 42 },
  });
});

test('アクセントありの場合は長さの前の空白は不要なこと', () => {
  expect(parse('n36!4')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, duration: 4, accent: 1 },
  });

  expect(parse('n36~4')[0]).toMatchObject({
    type: MmlType.DIRECT_NOTE,
    value: { direct: 36, frames: NaN, duration: 4, accent: -1 },
  });
});

describe('記述順', () => {
  test('N数値 アクセント 長さの順が正しいこと', () => {
    expect(() => parse('n36!4..')).not.toThrow();
    expect(() => parse('n36!%42')).not.toThrow();
  });
  test('N数値 アクセント 長さの順以外はエラーとなること', () => {
    expect(() => parse('n36 4..!')).toThrow();
  });
});
