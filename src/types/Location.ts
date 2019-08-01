/** MMLの位置情報 */
export interface Location {
  /** 始端 */
  start: {
    /** 全体の位置 */
    offset: number;
    /** 行番号 */
    line: number;
    /** 行中の位置 */
    column: number;
  };
  /** 終端 */
  end: {
    /** 全体の位置 */
    offset: number;
    /** 行番号 */
    line: number;
    /** 行中の位置 */
    column: number;
  };
}

/**
 * 仮の位置情報作成
 */
export const createDummyLocation = (): Location => {
  return {
    start: {
      offset: 0,
      line: 0,
      column: 0,
    },
    end: {
      offset: 0,
      line: 0,
      column: 0,
    },
  };
};

/**
 * 位置情報を合成する
 *
 * @param locations 位置情報
 */
export const mergeLocation = (...locations: Location[]): Location => {
  if (locations.length === 0) return createDummyLocation();

  let { start } = locations[0];
  let { end } = locations[0];

  locations.slice(1).forEach(({ start: s, end: e }) => {
    if (start.offset > s.offset) start = s;

    if (end.offset < e.offset) end = e;
  });

  return { start, end };
};
