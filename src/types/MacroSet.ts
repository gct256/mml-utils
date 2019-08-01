import { MacroTrack, Track } from './Track';

/**
 * マクロセット
 */
export class MacroSet {
  /** マクロマップ */
  protected readonly macroMap: Map<number, MacroTrack>;

  /** 名前付きマクロマップ */
  protected readonly namedMacroMap: Map<string, MacroTrack>;

  /**
   * コンストラクタ
   *
   * @param macroMap マクロマップ
   * @param namedMacroMap 名前付きマクロマップ
   */
  public constructor(
    macroMap: Map<number, MacroTrack>,
    namedMacroMap: Map<string, MacroTrack>,
  ) {
    this.macroMap = macroMap;
    this.namedMacroMap = namedMacroMap;
  }

  /** 空データ（ダミーデータ） */
  public static EMPTY = new MacroSet(new Map(), new Map());

  /**
   * 指定したマクロを返す
   *
   * @param noOrName マクロ番号またはマクロ名
   */
  public getMacro(noOrName: number | string): Track {
    if (typeof noOrName === 'number') {
      const track = this.macroMap.get(noOrName);

      if (track === undefined) {
        throw new Error(`マクロ #${noOrName} は存在しません`);
      }

      return track;
    }

    const track = this.namedMacroMap.get(noOrName);

    if (track === undefined) {
      throw new Error(`名前付きマクロ '${noOrName}' は存在しません`);
    }

    return track;
  }

  /**
   * すべてのマクロを返す
   */
  public getAllMacros(): MacroTrack[] {
    return [
      ...Array.from(this.macroMap.values()),
      ...Array.from(this.namedMacroMap.values()),
    ];
  }
}
