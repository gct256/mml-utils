import { Accent } from './Accent';

/** 楽器名 */
export type RhythmPartName =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

/** 楽器データ：名前指定 */
interface RhythmPartByName {
  name: RhythmPartName;
  accent?: Accent;
}

/** 楽器データ：数値指定 */
interface RhythmPartDirect {
  direct: number;
  accent?: Accent;
}

/** 楽器データ */
export type RhythmPart = RhythmPartByName | RhythmPartDirect;

/** 楽器のキー */
export type RhythmPartKey = number | RhythmPartName;

/**
 * 楽器データの生成
 *
 * @param key 楽器のキー
 * @param accent アクセント
 */
export const getRhythmPart = (
  key: RhythmPartKey,
  accent?: Accent,
): RhythmPart => {
  const part: RhythmPart =
    typeof key === 'number' ? { direct: key } : { name: key };

  if (accent !== undefined) part.accent = accent;

  return part;
};
