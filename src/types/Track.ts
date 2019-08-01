import { SyntaxError } from '../parse/pegParser/pegParser';

import { isNodeHasLength, MmlNode } from './MmlNode';
import * as NodeType from './MmlType';

/** 空トラックの番号 */
const EMPTY_NO = -1;
/** 名前付きマクロの番号 */
const NAMED_MACRO_NO = -2;

/** トラック */
export class Track {
  /** 番号 */
  public readonly no: number;

  /** 名前 */
  public readonly name: string;

  /** トラック種別名 */
  public readonly trackKindName: string;

  /** 含まれるノード */
  private nodes: MmlNode[];

  /** 空データ（ダミーデータ） */
  public static EMPTY = new Track(EMPTY_NO, '', '');

  /**
   * コンストラクタ
   *
   * @param no 番号
   * @param name 名前
   * @param trackKindName トラック種別名
   * @param nodes 初期ノード
   */
  public constructor(
    no: number,
    name: string,
    trackKindName: string,
    nodes: MmlNode[] = [],
  ) {
    this.no = no;
    this.name = no === EMPTY_NO ? 'EMPTY' : name;
    this.trackKindName = no === EMPTY_NO ? 'EMPTY' : trackKindName;

    this.nodes = [...nodes];
  }

  /**
   * 空トラックかどうか
   */
  public isEmpty(): boolean {
    return this.no === EMPTY_NO;
  }

  /**
   * ノード追加
   *
   * @param node ノード
   */
  public addNode(node: MmlNode): void {
    if (!this.isTargetNode(node)) {
      throw new SyntaxError(
        `このノード種別（${node.type}）は${this.trackKindName}トラックで使用できません`,
        '',
        '',
        node.location,
      );
    }

    this.nodes.push(node);
  }

  /**
   * 含まれるノードの配列を返す
   */
  public getNodes(): MmlNode[] {
    return this.nodes;
  }

  /**
   * 対象のノードかどうか
   *
   * @param node ノード
   */
  // eslint-disable-next-line class-methods-use-this
  public isTargetNode(_node: MmlNode): boolean {
    return true;
  }

  /**
   * 長さを持つノードを削除する
   */
  public stripNotes(): void {
    this.nodes = this.nodes.filter((node: MmlNode) => !isNodeHasLength(node));
  }
}

/** ソングトラック */
export class SongTrack extends Track {
  /**
   * コンストラクタ
   *
   * @param no 番号
   * @param nodes 初期ノード
   */
  public constructor(no: number, nodes: MmlNode[] = []) {
    super(no, `song#${no}`, 'ソング', nodes);
  }

  /** 空データ（ダミーデータ） */
  public static EMPTY = new SongTrack(EMPTY_NO);

  // overwrite
  // eslint-disable-next-line class-methods-use-this
  public isTargetNode(node: MmlNode): boolean {
    switch (node.type) {
      case NodeType.PART_VOLUME:
      // fallthrough

      case NodeType.PART_REL_VOLUME:
      // fallthrough

      case NodeType.PART:
        return false;

      default:
        return true;
    }
  }
}

/** リズムトラック */
export class RhythmTrack extends Track {
  /**
   * コンストラクタ
   *
   * @param no 番号
   * @param nodes 初期ノード
   */
  public constructor(no: number, nodes: MmlNode[] = []) {
    super(no, `rhythm#${no}`, 'リズム', nodes);
  }

  /** 空データ（ダミーデータ） */
  public static EMPTY = new RhythmTrack(EMPTY_NO);

  // overwrite
  // eslint-disable-next-line class-methods-use-this
  public isTargetNode(node: MmlNode): boolean {
    switch (node.type) {
      case NodeType.SLUR:
      // fallthrough

      case NodeType.QUICK_OCTAVE_LT:
      // fallthrough

      case NodeType.QUICK_OCTAVE_GT:
      // fallthrough

      case NodeType.NOTE:
      // fallthrough

      case NodeType.DIRECT_NOTE:
      // fallthrough

      case NodeType.OCTAVE:
      // fallthrough

      case NodeType.REL_OCTAVE:
      // fallthrough

      case NodeType.QUANTIZE:
      // fallthrough

      case NodeType.RANGE_SLUR:
        return false;

      default:
        return true;
    }
  }
}

/** マクロトラック */
export class MacroTrack extends Track {
  /**
   * コンストラクタ
   *
   * @param noOrName 番号または名前
   * @param nodes 初期ノード
   */
  public constructor(noOrName: number | string, nodes: MmlNode[] = []) {
    if (typeof noOrName === 'number') {
      super(noOrName, `macro#${noOrName}`, 'マクロ', nodes);
    } else {
      super(NAMED_MACRO_NO, `macro:${noOrName}`, '名前付きマクロ', nodes);
    }
  }

  /**
   * 名前付きマクロかどうか
   */
  public isNamed(): boolean {
    return this.no === NAMED_MACRO_NO;
  }
}
