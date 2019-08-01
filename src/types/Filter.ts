import { MacroSet } from './MacroSet';
import { MmlNode } from './MmlNode';
import { MmlNodeVisitor } from './MmlNodeVisitor';
import { RhythmTrack, SongTrack, Track } from './Track';

export type FilterSet = Filter[];

export type FilterSetList = (Filter | Filter[])[];

/**
 * フィルタクラス
 */
export class Filter extends MmlNodeVisitor<MmlNode[]> {
  /** 子フィルタ */
  protected children: Filter[];

  /** 現在参照中のトラック */
  protected track: Track;

  /** マクロセット */
  protected macroSet: MacroSet;

  /** 変換済みノード */
  protected currentNodes: MmlNode[];

  public constructor() {
    super();

    this.children = [];
    this.track = Track.EMPTY;
    this.macroSet = MacroSet.EMPTY;
    this.currentNodes = [];
  }

  /**
   * フィルタの配列を生成する
   *
   * @param setList フィルタおよびファイル他配列の配列
   */
  public static createFilterSet(setList: FilterSetList): Filter[] {
    const filterSet: Filter[] = [];

    setList.forEach((set) => {
      const filter = new Filter();

      if (Array.isArray(set)) {
        filter.children.push(...set);
      } else {
        filter.children.push(set);
      }

      filterSet.push(filter);
    });

    return filterSet;
  }

  /**
   * 任意のトラックのフィルタの前処理
   *
   * @param track 対象のトラック
   * @param macroSet マクロセット
   */
  public prepare(track: Track, macroSet: MacroSet): MmlNode[] {
    const nodes: MmlNode[] = [];

    this.track = track;
    this.macroSet = macroSet;
    nodes.push(...this.onFilterPrepare());

    this.children.forEach((child) => {
      nodes.push(...child.prepare(track, macroSet));
    });

    return nodes;
  }

  /**
   * ノードのフィルタ処理を実行する
   *
   * @param nodes ノード配列
   * @param currentNodes 変換済みノード
   */
  public filter(nodes: MmlNode[], currentNodes: MmlNode[]): MmlNode[] {
    this.currentNodes = currentNodes;

    const result: MmlNode[] = [];

    nodes.forEach((node) => {
      let filtered = this.visit(node);

      this.children.forEach((child) => {
        filtered = child.filter(filtered, result);
      });

      result.push(...filtered);
    });

    this.currentNodes = [];

    return result;
  }

  /** 任意のトラックのフィルタの後処理 */
  public finish(): MmlNode[] {
    const nodes: MmlNode[] = [];

    nodes.push(...this.onFilterFinish());

    this.children.forEach((child) => {
      nodes.push(...child.finish());
    });

    return nodes;
  }

  /**
   * 対象トラックがソングトラックかどうか
   */
  protected isSong(): boolean {
    return this.track instanceof SongTrack;
  }

  /**
   * 対象トラックがリズムトラックかどうか
   */
  protected isRhythm(): boolean {
    return this.track instanceof RhythmTrack;
  }

  /**
   * 現在の変換済みノードを返す
   */
  protected getCurrentNodes(): MmlNode[] {
    return this.currentNodes;
  }

  /** 前処理時のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onFilterPrepare(): MmlNode[] {
    return [];
  }

  /** 後処理時のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onFilterFinish(): MmlNode[] {
    return [];
  }

  // override
  // eslint-disable-next-line class-methods-use-this
  protected getDefaultReturnValue(node: MmlNode): MmlNode[] {
    return [node];
  }
}
