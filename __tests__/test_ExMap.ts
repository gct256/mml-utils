import { ExMap } from '../src/types/ExMap';

const createMap = () =>
  new ExMap<string, string[]>(
    (key: string, map: ExMap<string, string[]>): string[] => [key, typeof map],
  );

describe('overwrite', () => {
  test('overwriteで新しいデータが返されること', () => {
    const map = createMap();

    expect(map.overwrite('foo')).toEqual(['foo', 'object']);
  });
  test('既存キーに対するoverwriteで上書きになること', () => {
    const map = createMap();
    const foo = map.overwrite('foo');

    expect(map.overwrite('foo')).toEqual(foo);
    expect(map.overwrite('foo')).not.toBe(foo);
  });
  test('overwriteのあとのgetでは同じオブジェクトが返されること', () => {
    const map = createMap();
    const foo = map.overwrite('foo');

    expect(map.get('foo')).toBe(foo);
  });
});

describe('getOrCreate', () => {
  test('getの場合はキーがなければundefinedとなること', () => {
    const map = createMap();

    expect(map.get('foo')).toBe(undefined);
  });

  test('getOrCreateでキーがなくても新しいデータが返されること', () => {
    const map = createMap();

    expect(map.getOrCreate('foo')).toEqual(['foo', 'object']);
  });

  test('getOrCreateを二回呼んだ場合は同じオブジェクトが返されること', () => {
    const map = createMap();
    const foo = map.getOrCreate('foo');

    expect(map.getOrCreate('foo')).toBe(foo);
  });

  test('getOrCreateのあとのgetでは同じオブジェクトが返されること', () => {
    const map = createMap();
    const foo = map.getOrCreate('foo');

    expect(map.get('foo')).toBe(foo);
  });
});
