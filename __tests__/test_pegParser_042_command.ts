import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('引数なしパースできること', () => {
  expect(parse('@cmd')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd' },
  });
});

test('空の引数でパースできること', () => {
  expect(parse('@cmd()')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd' },
  });
});

test('引数有りでパースできること', () => {
  expect(parse('@cmd(120)')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd', args: [120] },
  });
  expect(parse('@cmd(120,foo,"bar",\'qux\')')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
});

test('引数の文字列のエスケープが機能すること', () => {
  expect(parse('@cmd("\\\\\\"",\'\\\\\\\'\')')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [{ str: '\\"' }, { str: "\\'" }],
    },
  });
});

test('左括弧直後の改行は許容されること', () => {
  expect(
    parse(`@cmd(
1,2)`)[0],
  ).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [1, 2],
    },
  });
});

test('カンマ前後の改行は許容されること', () => {
  expect(
    parse(`@cmd(1
,
2)`)[0],
  ).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [1, 2],
    },
  });
});

test('右括弧直前の改行は許容されること', () => {
  expect(
    parse(`@cmd(1,2
)`)[0],
  ).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [1, 2],
    },
  });
});

test('間の空白は無視されること', () => {
  expect(parse('@  cmd  (  )')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd' },
  });
  expect(parse('@  cmd  (  120  )')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd', args: [120] },
  });
  expect(
    parse('@  cmd  (  120  ,  foo  ,  "bar"  ,  \'qux\'  )')[0],
  ).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [120, { name: 'foo' }, { str: 'bar' }, { str: 'qux' }],
    },
  });
  expect(
    parse(`@  cmd  (${'  '}
  1${'  '}
  ,${'  '}
  2  )`)[0],
  ).toMatchObject({
    type: MmlType.COMMAND,
    value: {
      name: 'cmd',
      args: [1, 2],
    },
  });
});

test('名前は小文字になること', () => {
  expect(parse('@CMD(FOO)')[0]).toMatchObject({
    type: MmlType.COMMAND,
    value: { name: 'cmd', args: [{ name: 'foo' }] },
  });
});

test('閉じカッコがなければエラーとなること', () => {
  expect(() => parse('@cmd(')).toThrow();
});
test('引数に値がなければエラーとなること', () => {
  expect(() => parse('@cmd(42,)')).toThrow();
  expect(() => parse('@cmd(,42)')).toThrow();
  expect(() => parse('@cmd(,)')).toThrow();
});
test('文字列が閉じていなければエラーとなること', () => {
  expect(() => parse("@cmd('foo)")).toThrow();
  expect(() => parse("@cmd(foo')")).toThrow();
  expect(() => parse('@cmd("foo)')).toThrow();
  expect(() => parse('@cmd(foo")')).toThrow();
});
