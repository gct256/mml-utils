import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`|&` で範囲スラーの開始となること', () => {
  expect(parse('|&')[0]).toMatchObject({
    type: MmlType.RANGE_SLUR,
    value: {},
  });
});

test('`|!` で範囲強めの開始となること', () => {
  expect(parse('|!')[0]).toMatchObject({
    type: MmlType.RANGE_STRONG,
    value: {},
  });
});

test('`|&` で範囲弱めの開始となること', () => {
  expect(parse('|~')[0]).toMatchObject({
    type: MmlType.RANGE_WEAK,
    value: {},
  });
});

test('`|` で範囲終了となること', () => {
  expect(parse('|')[0]).toMatchObject({
    type: MmlType.RANGE_END,
    value: {},
  });
});
