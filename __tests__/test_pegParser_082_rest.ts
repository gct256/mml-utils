import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`R` で休符となること', () => {
  expect(parse('r')[0]).toMatchObject({
    type: MmlType.REST,
    value: { frames: NaN },
  });
});
test('長さを指定できること', () => {
  expect(parse('r4')[0]).toMatchObject({
    type: MmlType.REST,
    value: { frames: NaN, duration: 4 },
  });
  expect(parse('r4..')[0]).toMatchObject({
    type: MmlType.REST,
    value: { frames: NaN, duration: 4, dots: 2 },
  });
  expect(parse('r..')[0]).toMatchObject({
    type: MmlType.REST,
    value: { frames: NaN, dots: 2 },
  });
  expect(parse('r%42')[0]).toMatchObject({
    type: MmlType.REST,
    value: { frames: 42 },
  });
});
