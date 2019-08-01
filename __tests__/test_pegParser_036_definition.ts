import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('引数なしパースできること', () => {
  expect(parse('$def')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def' },
  });
});

test('空の引数でパースできること', () => {
  expect(parse('$def()')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def' },
  });
});

test('引数有りでパースできること', () => {
  expect(parse('$def(120)')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def', args: [120] },
  });
  expect(parse('$def(120,foo,"bar",\'qux\')')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
});

test('引数の文字列のエスケープが機能すること', () => {
  expect(parse('$def("\\\\\\"",\'\\\\\\\'\')')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [{ str: '\\"' }, { str: "\\'" }],
    },
  });
});

test('左括弧直後の改行は許容されること', () => {
  expect(
    parse(`$def(
1,2)`)[0],
  ).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [1, 2],
    },
  });
});

test('カンマ前後の改行は許容されること', () => {
  expect(
    parse(`$def(1
,
2)`)[0],
  ).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [1, 2],
    },
  });
});

test('右括弧直前の改行は許容されること', () => {
  expect(
    parse(`$def(1,2
)`)[0],
  ).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [1, 2],
    },
  });
});

test('間の空白は無視されること', () => {
  expect(parse('$  def  (  )')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def' },
  });
  expect(parse('$  def  (  120  )')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def', args: [120] },
  });
  expect(
    parse('$  def  (  120  ,  foo  ,  "bar"  ,  \'qux\'  )')[0],
  ).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
  expect(
    parse(`$  def  (${'  '}
  1${'  '}
  ,${'  '}
  2  )`)[0],
  ).toMatchObject({
    type: MmlType.DEFINE,
    value: {
      name: 'def',
      args: [1, 2],
    },
  });
});

test('名前は小文字になること', () => {
  expect(parse('$DEF(FOO)')[0]).toMatchObject({
    type: MmlType.DEFINE,
    value: { name: 'def', args: [{ name: 'foo' }] },
  });
});

test('閉じカッコがなければエラーとなること', () => {
  expect(() => parse('$def(')).toThrow();
});
test('引数に値がなければエラーとなること', () => {
  expect(() => parse('$def(42,)')).toThrow();
  expect(() => parse('$def(,42)')).toThrow();
  expect(() => parse('$def(,)')).toThrow();
});
test('文字列が閉じていなければエラーとなること', () => {
  expect(() => parse("$def('foo)")).toThrow();
  expect(() => parse("$def(foo')")).toThrow();
  expect(() => parse('$def("foo)')).toThrow();
  expect(() => parse('$def(foo")')).toThrow();
});
