import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

test('`V` `{` `}` 数値で楽器の音量となること', () => {
  expect(parse('v{ab c n32}15')[0]).toMatchObject({
    type: MmlType.PART_VOLUME,
    value: {
      parts: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { direct: 32 }],
      volume: 15,
    },
  });

  expect(parse('V{AB C N32}15')[0]).toMatchObject({
    type: MmlType.PART_VOLUME,
    value: {
      parts: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { direct: 32 }],
      volume: 15,
    },
  });
});

test('音量には負の値を指定できること', () => {
  expect(parse('v{n32 n64}-15')[0]).toMatchObject({
    type: MmlType.PART_VOLUME,
    value: { parts: [{ direct: 32 }, { direct: 64 }], volume: -15 },
  });
});

test('`V` `{` `}` `:` 相対数値で楽器の相対音量となること', () => {
  expect(parse('v{ab C n32}:-15')[0]).toMatchObject({
    type: MmlType.PART_REL_VOLUME,
    value: {
      parts: [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { direct: 32 }],
      offset: -15,
    },
  });
  expect(parse('v{n32 n64}:+15')[0]).toMatchObject({
    type: MmlType.PART_REL_VOLUME,
    value: { parts: [{ direct: 32 }, { direct: 64 }], offset: 15 },
  });
  expect(parse('v{A n32}:0')[0]).toMatchObject({
    type: MmlType.PART_REL_VOLUME,
    value: { parts: [{ name: 'a' }, { direct: 32 }], offset: 0 },
  });
});

test('相対値の正の値には `+` が必要なこと', () => {
  expect(() => parse('v{A n32}:4')).toThrow();
});
