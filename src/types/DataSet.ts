import { controls } from '../constants/controls';

import { ExMap } from './ExMap';
import { MacroSet } from './MacroSet';
import * as MmlNode from './MmlNode';
import { MmlNodeVisitor } from './MmlNodeVisitor';
import { MacroTrack, RhythmTrack, SongTrack, Track } from './Track';
import { TrackSet } from './TrackSet';

/** データセット */
export interface DataSet {
  /** トラックセット */
  trackSet: TrackSet;
  /** マクロセット */
  macroSet: MacroSet;
  /** 定義ノードの配列 */
  defineNodes: MmlNode.DefineNode[];
}

/**
 * データセット生成クラス
 */
export class DataSetProcessor extends MmlNodeVisitor<void> {
  /** ソング記録用マップ */
  private songMap: ExMap<number, SongTrack>;

  /** リズム記録用マップ */
  private rhythmMap: ExMap<number, RhythmTrack>;

  /** マクロ記録用マップ */
  private macroMap: ExMap<number, MacroTrack>;

  /** 名前付きマクロ記録用マップ */
  private namedMacroMap: ExMap<string, MacroTrack>;

  /** 制御ノードの配列 */
  private controlNodes: MmlNode.ControlNode[];

  /** 定義ノードの配列 */
  private defineNodes: MmlNode.DefineNode[];

  /** 現在のアクティブなトラック */
  private activeTrack: Track;

  /** スキップフラグ */
  private skip: boolean = false;

  /** 完了フラグ */
  private end: boolean = false;

  public constructor() {
    super();

    this.songMap = new ExMap(
      (no: number) => new SongTrack(no, this.controlNodes),
    );
    this.rhythmMap = new ExMap(
      (no: number) => new RhythmTrack(no, this.controlNodes),
    );
    this.macroMap = new ExMap((no: number) => new MacroTrack(no));
    this.namedMacroMap = new ExMap((name: string) => new MacroTrack(name));

    this.controlNodes = [];
    this.defineNodes = [];
    this.activeTrack = this.songMap.getOrCreate(1);
  }

  /**
   * 生成されたデータセットを返す
   */
  public getDataSet(): DataSet {
    return {
      trackSet: new TrackSet(this.songMap, this.rhythmMap),
      macroSet: new MacroSet(this.macroMap, this.namedMacroMap),
      defineNodes: this.defineNodes,
    };
  }

  /**
   * 完了フラグチェック
   */
  public isEnd(): boolean {
    return this.end;
  }

  // override
  // eslint-disable-next-line class-methods-use-this
  protected getDefaultReturnValue(_node: MmlNode.MmlNode): void {}

  // override
  protected onBeforeNode(_node: MmlNode.MmlNode): void {
    this.skip = false;
  }

  // override
  protected onAfterNode(node: MmlNode.MmlNode): void {
    if (!this.skip) this.activeTrack.addNode(node);
  }

  // override
  protected onComment(_node: MmlNode.CommentNode): void {
    this.skip = true;
  }

  // override
  protected onControl(node: MmlNode.ControlNode): void {
    this.controlNodes.push(node);
    this.songMap.forEach((song) => song.addNode(node));
    this.rhythmMap.forEach((rhythm) => rhythm.addNode(node));

    switch (node.value.name) {
      case controls.end:
        this.end = true;
        break;

      case controls.start:
        this.stripNotes();
        break;

      default:
        break;
    }

    this.skip = true;
  }

  // override
  protected onDefine(node: MmlNode.DefineNode): void {
    this.defineNodes.push(node);

    this.skip = true;
  }

  // override
  protected onTargetSong(node: MmlNode.TargetSongNode): void {
    this.activeTrack = this.songMap.getOrCreate(node.value.channel);

    this.skip = true;
  }

  // override
  protected onTargetRhythm(node: MmlNode.TargetRhythmNode): void {
    this.activeTrack = this.rhythmMap.getOrCreate(node.value.channel);

    this.skip = true;
  }

  // override
  protected onTargetMacroByNo(node: MmlNode.TargetMacroByNoNode): void {
    this.activeTrack = this.macroMap.getOrCreate(node.value.no);

    this.skip = true;
  }

  // override
  protected onTargetMacroByName(node: MmlNode.TargetMacroByNameNode): void {
    this.activeTrack = this.namedMacroMap.getOrCreate(node.value.name);

    this.skip = true;
  }

  // override
  // eslint-disable-next-line class-methods-use-this
  protected onExpandNamedMacro(_node: MmlNode.ExpandNamedMacroNode): void {}

  // override
  // eslint-disable-next-line class-methods-use-this
  protected onQuickNamedVoice(_node: MmlNode.QuickNamedVoiceNode): void {}

  // override
  // eslint-disable-next-line class-methods-use-this
  protected onCommand(_node: MmlNode.CommandNode): void {}

  // override
  protected onWs(_node: MmlNode.WsNode): void {
    this.skip = true;
  }

  // override
  protected onEol(_node: MmlNode.EolNode): void {
    this.skip = true;
  }

  /**
   * すべてのトラックから長さを持つノードを削除する
   */
  private stripNotes(): void {
    this.songMap.forEach((song) => song.stripNotes());
    this.rhythmMap.forEach((rhythm) => rhythm.stripNotes());
  }
}
