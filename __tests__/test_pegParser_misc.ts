import { parse } from '../src/parse/pegParser/pegParser';
import * as MmlType from '../src/types/MmlType';

describe('& : slur', () => {
  test('`&` がスラーとなること', () => {
    expect(parse('&')[0]).toMatchObject({ type: MmlType.SLUR, value: {} });
  });
});

describe('< : quick octave lt', () => {
  test('`<` が簡易オクターブとなること', () => {
    expect(parse('<')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_LT,
      value: { count: 1 },
    });
  });
  test('連続した場合はその数が反映されること', () => {
    expect(parse('<<<')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_LT,
      value: { count: 3 },
    });
  });
  test('間に空白が入った場合は区切られること', () => {
    expect(parse('<< <<')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_LT,
      value: { count: 2 },
    });
  });
});

describe('> : quick octave gt', () => {
  test('`>` が簡易オクターブとなること', () => {
    expect(parse('>')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_GT,
      value: { count: 1 },
    });
  });
  test('連続した場合はその数が反映されること', () => {
    expect(parse('>>>')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_GT,
      value: { count: 3 },
    });
  });
  test('間に空白が入った場合は区切られること', () => {
    expect(parse('>> >>')[0]).toMatchObject({
      type: MmlType.QUICK_OCTAVE_GT,
      value: { count: 2 },
    });
  });
});

describe('[ : begin loop', () => {
  test('`[` と数値で数値分のループ開始となること', () => {
    expect(parse('[42')[0]).toMatchObject({
      type: MmlType.LOOP_BEGIN,
      value: { count: 42 },
    });
    expect(parse('[0')[0]).toMatchObject({
      type: MmlType.LOOP_BEGIN,
      value: { count: 0 },
    });
  });
  test('数値省略時はNaN回となること', () => {
    expect(parse('[')[0]).toMatchObject({
      type: MmlType.LOOP_BEGIN,
      value: { count: NaN },
    });
  });
});

describe('] : end loop', () => {
  test('`]` と数値で数値分のループ終了となること', () => {
    expect(parse(']42')[0]).toMatchObject({
      type: MmlType.LOOP_END,
      value: { count: 42 },
    });
    expect(parse(']0')[0]).toMatchObject({
      type: MmlType.LOOP_END,
      value: { count: 0 },
    });
  });
  test('数値省略時はNaN回となること', () => {
    expect(parse(']')[0]).toMatchObject({
      type: MmlType.LOOP_END,
      value: { count: NaN },
    });
  });
});

describe('/ : loop break', () => {
  test('`/` がループ中断となること', () => {
    expect(parse('/')[0]).toMatchObject({
      type: MmlType.LOOP_BREAK,
      value: {},
    });
  });
});

describe('_ : quick rest', () => {
  test('`_` が簡易休符となること', () => {
    expect(parse('_')[0]).toMatchObject({
      type: MmlType.QUICK_REST,
      value: { count: 1 },
    });
  });
  test('複数連ねた場合はその数が入ること', () => {
    expect(parse('_____')[0]).toMatchObject({
      type: MmlType.QUICK_REST,
      value: { count: 5 },
    });
  });
});
