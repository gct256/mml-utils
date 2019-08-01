import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`A` - `G` が音階名となること', () => {
  expect(parse('a')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 9, frames: NaN },
  });
  expect(parse('b')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 11, frames: NaN },
  });
  expect(parse('c')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 0, frames: NaN },
  });
  expect(parse('d')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 2, frames: NaN },
  });
  expect(parse('e')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 4, frames: NaN },
  });
  expect(parse('f')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 5, frames: NaN },
  });
  expect(parse('g')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 7, frames: NaN },
  });

  expect(parse('A')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 9, frames: NaN },
  });
  expect(parse('B')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 11, frames: NaN },
  });
  expect(parse('C')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 0, frames: NaN },
  });
  expect(parse('D')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 2, frames: NaN },
  });
  expect(parse('E')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 4, frames: NaN },
  });
  expect(parse('F')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 5, frames: NaN },
  });
  expect(parse('G')[0]).toMatchObject({
    type: MmlType.NOTE,
    value: { note: 7, frames: NaN },
  });
});

describe('半音記号', () => {
  test('`-` でフラットとなること', () => {
    expect(parse('a-')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: -1 },
    });
    expect(parse('a---')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: -3 },
    });
  });
  test('`+` でシャープとなること', () => {
    expect(parse('a+')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: 1 },
    });
    expect(parse('a+++')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: 3 },
    });
  });
  test('`#` でシャープとなること', () => {
    expect(parse('a#')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: 1 },
    });
    expect(parse('a###')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, offset: 3 },
    });
  });
  test('半音記号は混在できないこと', () => {
    expect(() => parse('a-+')).toThrow();
    expect(() => parse('a-#')).toThrow();
    expect(() => parse('a+#')).toThrow();
  });
});

describe('アクセント', () => {
  test('`!` で強めとなること', () => {
    expect(parse('a!')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, accent: 1 },
    });
  });
  test('`~` で弱めとなること', () => {
    expect(parse('a~')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, accent: -1 },
    });
  });
  test('複数は指定できないこと', () => {
    expect(() => parse('a!!')).toThrow();
    expect(() => parse('a~~')).toThrow();
    expect(() => parse('a!~')).toThrow();
  });
});

describe('長さ', () => {
  test('数字が長さとなること', () => {
    expect(parse('a4')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, duration: 4 },
    });
    expect(parse('a4...')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, duration: 4, dots: 3 },
    });
  });
  test('付点をつけられること', () => {
    expect(parse('a...')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: NaN, dots: 3 },
    });
  });
  test('`%` と数字でフレーム数指定になること', () => {
    expect(parse('a%42')[0]).toMatchObject({
      type: MmlType.NOTE,
      value: { note: 9, frames: 42 },
    });
  });
  test('フレーム数指定に付点はつけられないこと', () => {
    expect(() => parse('a%42..')).toThrow();
  });
});

describe('記述順', () => {
  test('音階名 半音記号 アクセント 長さの順が正しいこと', () => {
    expect(() => parse('a++!4..')).not.toThrow();
    expect(() => parse('a++!%42')).not.toThrow();
  });
  test('音階名 半音記号 アクセント 長さの順以外はエラーとなること', () => {
    expect(() => parse('a++4..!')).toThrow();
    expect(() => parse('a!++4..')).toThrow();
    expect(() => parse('a!4..++')).toThrow();
    expect(() => parse('a4..!++')).toThrow();
    expect(() => parse('a4..++!')).toThrow();

    expect(() => parse('a++%42!')).toThrow();
    expect(() => parse('a!++%42')).toThrow();
    expect(() => parse('a!%42++')).toThrow();
    expect(() => parse('a%42!++')).toThrow();
    expect(() => parse('a%42++!')).toThrow();
  });
});
