import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`O` と数字で絶対オクターブ指定となること', () => {
  expect(parse('o4')[0]).toMatchObject({
    type: MmlType.OCTAVE,
    value: { octave: 4 },
  });
  expect(parse('O4')[0]).toMatchObject({
    type: MmlType.OCTAVE,
    value: { octave: 4 },
  });
});
test('オクターブに0を指定できること', () => {
  expect(parse('o0')[0]).toMatchObject({
    type: MmlType.OCTAVE,
    value: { octave: 0 },
  });
});
test('オクターブに負の値を指定できること', () => {
  expect(parse('o-4')[0]).toMatchObject({
    type: MmlType.OCTAVE,
    value: { octave: -4 },
  });
});

test('`O` と `:` と相対数値で相対オクターブ指定となること', () => {
  expect(parse('o:-4')[0]).toMatchObject({
    type: MmlType.REL_OCTAVE,
    value: { offset: -4 },
  });
  expect(parse('O:+4')[0]).toMatchObject({
    type: MmlType.REL_OCTAVE,
    value: { offset: 4 },
  });
  expect(parse('o:0')[0]).toMatchObject({
    type: MmlType.REL_OCTAVE,
    value: { offset: 0 },
  });
});

test('相対値の正の値には `+` が必要なこと', () => {
  expect(() => parse('o:4')).toThrow();
});
