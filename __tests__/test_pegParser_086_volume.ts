import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`V` と数値で音量となること', () => {
  expect(parse('v15')[0]).toMatchObject({
    type: MmlType.VOLUME,
    value: { volume: 15 },
  });
  expect(parse('V0')[0]).toMatchObject({
    type: MmlType.VOLUME,
    value: { volume: 0 },
  });
});

test('音量には負の値を指定できること', () => {
  expect(parse('V-12')[0]).toMatchObject({
    type: MmlType.VOLUME,
    value: { volume: -12 },
  });
});

test('`V` と `:` と相対数値で相対音量指定となること', () => {
  expect(parse('v:-4')[0]).toMatchObject({
    type: MmlType.REL_VOLUME,
    value: { offset: -4 },
  });
  expect(parse('V:+4')[0]).toMatchObject({
    type: MmlType.REL_VOLUME,
    value: { offset: 4 },
  });
  expect(parse('v:0')[0]).toMatchObject({
    type: MmlType.REL_VOLUME,
    value: { offset: 0 },
  });
});

test('相対値の正の値には `+` が必要なこと', () => {
  expect(() => parse('v:4')).toThrow();
});
