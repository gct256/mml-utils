import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('引数なしパースできること', () => {
  expect(parse('?control')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control' },
  });
});

test('空の引数でパースできること', () => {
  expect(parse('?control()')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control' },
  });
});

test('引数有りでパースできること', () => {
  expect(parse('?control(120)')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control', args: [120] },
  });
  expect(parse('?control(120,foo,"bar",\'qux\')')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
});

test('引数の文字列のエスケープが機能すること', () => {
  expect(parse('?control("\\\\\\"",\'\\\\\\\'\')')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [{ str: '\\"' }, { str: "\\'" }],
    },
  });
});

test('左括弧直後の改行は許容されること', () => {
  expect(
    parse(`?control(
1,2)`)[0],
  ).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [1, 2],
    },
  });
});

test('カンマ前後の改行は許容されること', () => {
  expect(
    parse(`?control(1
,
2)`)[0],
  ).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [1, 2],
    },
  });
});

test('右括弧直前の改行は許容されること', () => {
  expect(
    parse(`?control(1,2
)`)[0],
  ).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [1, 2],
    },
  });
});

test('間の空白は無視されること', () => {
  expect(parse('?  control  (  )')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control' },
  });
  expect(parse('?  control  (  120  )')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control', args: [120] },
  });
  expect(
    parse('?  control  (  120  ,  foo  ,  "bar"  ,  \'qux\'  )')[0],
  ).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
  expect(
    parse(`?  control  (${'  '}
  1${'  '}
  ,${'  '}
  2  )`)[0],
  ).toMatchObject({
    type: MmlType.CONTROL,
    value: {
      name: 'control',
      args: [1, 2],
    },
  });
});

test('名前は小文字になること', () => {
  expect(parse('?CONTROL(FOO)')[0]).toMatchObject({
    type: MmlType.CONTROL,
    value: { name: 'control', args: [{ name: 'foo' }] },
  });
});

test('閉じカッコがなければエラーとなること', () => {
  expect(() => parse('?control(')).toThrow();
});
test('引数に値がなければエラーとなること', () => {
  expect(() => parse('?control(42,)')).toThrow();
  expect(() => parse('?control(,42)')).toThrow();
  expect(() => parse('?control(,)')).toThrow();
});
test('文字列が閉じていなければエラーとなること', () => {
  expect(() => parse("?control('foo)")).toThrow();
  expect(() => parse("?control(foo')")).toThrow();
  expect(() => parse('?control("foo)')).toThrow();
  expect(() => parse('?control(foo")')).toThrow();
});
