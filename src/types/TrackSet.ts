import { RhythmTrack, SongTrack, Track } from './Track';

/** ソート用比較関数 */
const compare = (a: [number, Track], b: [number, Track]): number => {
  if (a[0] < b[0]) return -1;

  if (a[0] > b[0]) return 1;

  return 0;
};

/**
 * トラックセット
 */
export class TrackSet {
  /** ソングマップ */
  protected readonly songMap: Map<number, SongTrack>;

  /** リズムマップ */
  protected readonly rhythmMap: Map<number, RhythmTrack>;

  /**
   * コンストラクタ
   *
   * @param songMap ソングマップ
   * @param rhythmMap リズムマップ
   */
  public constructor(
    songMap: Map<number, SongTrack>,
    rhythmMap: Map<number, RhythmTrack>,
  ) {
    this.songMap = songMap;
    this.rhythmMap = rhythmMap;
  }

  /** 空データ（ダミーデータ） */
  public static EMPTY = new TrackSet(new Map(), new Map());

  /**
   * ソングトラックを返す
   *
   * @param no トラック番号
   */
  public getSongTrack(no: number): Track {
    const track = this.songMap.get(no);

    if (track === undefined) {
      throw new Error(`ソングトラック #${no} は存在しません`);
    }

    return track;
  }

  /**
   * リズムトラックを返す
   *
   * @param no トラック番号
   */
  public getRhythmTrack(no: number): Track {
    const track = this.rhythmMap.get(no);

    if (track === undefined) {
      throw new Error(`リズムトラック #${no} は存在しません`);
    }

    return track;
  }

  /**
   * すべてのソングトラックを返す
   */
  public getAllSongTracks(): SongTrack[] {
    const all = Array.from(this.songMap.entries());

    all.sort(compare);

    return all.map(([_no, track]) => track);
  }

  /**
   * すべてのリズムトラックを返す
   */
  public getAllRhythmTracks(): RhythmTrack[] {
    const all = Array.from(this.rhythmMap.entries());

    all.sort(compare);

    return all.map(([_no, track]) => track);
  }

  /**
   * トラック番号順にソングトラックをトラック数分返す
   * 足りない分は空トラックが入る
   *
   * @param count トラック数
   */
  public findSongTracks(count: number): SongTrack[] {
    return [
      ...this.getAllSongTracks(),
      ...Array(count).fill(SongTrack.EMPTY),
    ].slice(0, count);
  }

  /**
   * トラック番号順にリズムトラックをトラック数分返す
   * 足りない分は空トラックが入る
   *
   * @param count トラック数
   */
  public findRhythmTracks(count: number): RhythmTrack[] {
    return [
      ...this.getAllRhythmTracks(),
      ...Array(count).fill(RhythmTrack.EMPTY),
    ].slice(0, count);
  }
}
