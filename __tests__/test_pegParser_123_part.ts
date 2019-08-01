import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`{` と `}` の間の `n` 以外のアルファベットは楽器名となること', () => {
  expect(parse('{abcdefghijklmopqrstuvwxyz}')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
        { name: 'f' },
        { name: 'g' },
        { name: 'h' },
        { name: 'i' },
        { name: 'j' },
        { name: 'k' },
        { name: 'l' },
        { name: 'm' },
        { name: 'o' },
        { name: 'p' },
        { name: 'q' },
        { name: 'r' },
        { name: 's' },
        { name: 't' },
        { name: 'u' },
        { name: 'v' },
        { name: 'w' },
        { name: 'x' },
        { name: 'y' },
        { name: 'z' },
      ],
      frames: NaN,
    },
  });
  expect(parse('{a b C D}')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }],
      frames: NaN,
    },
  });
});

test('`N` と数値での直接指定ができること', () => {
  expect(parse('{n32 N64}')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [{ direct: 32 }, { direct: 64 }],
      frames: NaN,
    },
  });
});

test('長さを指定できること', () => {
  expect(parse('{a}4..')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [{ name: 'a' }],
      frames: NaN,
      duration: 4,
      dots: 2,
    },
  });
  expect(parse('{a}%42')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [{ name: 'a' }],
      frames: 42,
    },
  });
});

test('付点を指定できること', () => {
  expect(parse('{a}..')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [{ name: 'a' }],
      frames: NaN,
      dots: 2,
    },
  });
});

test('各楽器にアクセントを指定できること', () => {
  expect(parse('{a! b~ n32! n64~}')[0]).toMatchObject({
    type: MmlType.PART,
    value: {
      parts: [
        { name: 'a', accent: 1 },
        { name: 'b', accent: -1 },
        { direct: 32, accent: 1 },
        { direct: 64, accent: -1 },
      ],
      frames: NaN,
    },
  });
});
