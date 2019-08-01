import { SyntaxError } from '../parse/pegParser/pegParser';
import { Filter } from '../types/Filter';
import * as MmlNode from '../types/MmlNode';
import * as MmlType from '../types/MmlType';

/**
 * データの正当性チェックフィルタ
 */
export class Validate extends Filter {
  /** 音階があるかどうか */
  private hasNote: boolean = false;

  /** ループ開始ノード */
  private loops: MmlNode.LoopBeginNode[] = [];

  /** 範囲かどうか */
  private range: MmlNode.MmlNode | null = null;

  /** デフォルト長さがフレーム数かどうか */
  private useDefaultFrames: boolean = false;

  // override
  protected onFilterPrepare(): MmlNode.MmlNode[] {
    this.hasNote = false;
    this.loops = [];
    this.range = null;
    this.useDefaultFrames = false;

    return [];
  }

  // override
  protected onFilterFinish(): MmlNode.MmlNode[] {
    if (this.loops.length > 0) {
      this.errorOccured(
        this.loops[this.loops.length - 1],
        '対応するループ末尾がありません',
      );
    }

    if (this.range !== null) {
      this.errorOccured(this.range, '対応する範囲末尾がありません');
    }

    return [];
  }

  // override
  protected onBeforeNode(node: MmlNode.MmlNode): void {
    switch (node.type) {
      case MmlType.NOTE:

      // fallthrough
      case MmlType.DIRECT_NOTE:
        this.hasNote = true;
        break;

      default:
        break;
    }
  }

  // override
  protected onSlur(node: MmlNode.SlurNode): MmlNode.MmlNode[] {
    // スラーの前に一つも発音データがなければエラー
    if (!this.hasNote) {
      this.errorOccured(node, 'スラー・タイは音階の後ろにある必要があります');
      this.hasNote = false;

      return [];
    }

    this.hasNote = false;

    return [node];
  }

  // override
  protected onExpandMacro(node: MmlNode.ExpandMacroNode): MmlNode.MmlNode[] {
    // 対応するマクロがなければエラー
    try {
      this.macroSet.getMacro(node.value.no); // macroSetが例外投げる
    } catch (er) {
      this.errorOccured(node, er.message);

      return [];
    }

    return [node];
  }

  // override
  protected onExpandNamedMacro(
    node: MmlNode.ExpandNamedMacroNode,
  ): MmlNode.MmlNode[] {
    // 対応するマクロがなければエラー
    try {
      this.macroSet.getMacro(node.value.name); // macroSetが例外投げる
    } catch (er) {
      this.errorOccured(node, er.message);

      return [];
    }

    return [node];
  }

  // override
  protected onNote(node: MmlNode.NoteNode): MmlNode.MmlNode[] {
    this.checkLength(node);

    return [node];
  }

  // override
  protected onLength(node: MmlNode.LengthNode): MmlNode.MmlNode[] {
    // デフォルト長さがフレーム数かどうかを記録する
    this.useDefaultFrames = !Number.isFinite(node.value.duration);

    return [node];
  }

  // override
  protected onQuantize(node: MmlNode.QuantizeNode): MmlNode.MmlNode[] {
    // 100より大きい場合はエラー
    if (node.value.rate > 100) {
      this.errorOccured(node, '音長比が100を超えています');
    }

    return [node];
  }

  // override
  protected onRest(node: MmlNode.RestNode): MmlNode.MmlNode[] {
    this.checkLength(node);

    return [node];
  }

  // override
  protected onLoopBegin(node: MmlNode.LoopBeginNode): MmlNode.MmlNode[] {
    // ループ開始を記録する
    this.loops.push(node);

    return [node];
  }

  // override
  protected onLoopEnd(node: MmlNode.LoopEndNode): MmlNode.MmlNode[] {
    // ループが開始していなければエラー
    if (this.loops.length === 0) {
      this.errorOccured(node, 'ループが開始されていません');
    }

    this.loops.pop();

    return [node];
  }

  // override
  protected onLoopBreak(node: MmlNode.LoopBreakNode): MmlNode.MmlNode[] {
    // ループ内でなければエラー
    if (this.loops.length === 0) {
      this.errorOccured(node, 'ループ中断がループ以外の場所で使用されました');

      return [];
    }

    return [node];
  }

  // override
  protected onPart(node: MmlNode.PartNode): MmlNode.MmlNode[] {
    this.checkLength(node);

    return [node];
  }

  // override
  protected onRangeStrong(node: MmlNode.RangeStrongNode): MmlNode.MmlNode[] {
    // すでに範囲内であればエラー
    if (this.range !== null) {
      this.errorOccured(node, '範囲を入れ子にすることはできません');
    }

    this.range = node;

    return [node];
  }

  // override
  protected onRangeSlur(node: MmlNode.RangeSlurNode): MmlNode.MmlNode[] {
    // すでに範囲内であればエラー
    if (this.range !== null) {
      this.errorOccured(node, '範囲を入れ子にすることはできません');
    }

    this.range = node;

    return [node];
  }

  // override
  protected onRangeWeak(node: MmlNode.RangeWeakNode): MmlNode.MmlNode[] {
    // すでに範囲内であればエラー
    if (this.range !== null) {
      this.errorOccured(node, '範囲を入れ子にすることはできません');
    }

    this.range = node;

    return [node];
  }

  // override
  protected onRangeEnd(node: MmlNode.RangeEndNode): MmlNode.MmlNode[] {
    // 範囲が開始していなければエラー
    if (this.range === null) {
      this.errorOccured(node, '範囲が開始していません');
    }

    this.range = null;

    return [node];
  }

  /**
   * エラーを投げる
   *
   * @param node 元となるノード
   * @param message メッセージ
   */
  // eslint-disable-next-line class-methods-use-this
  private errorOccured(node: MmlNode.MmlNode, message: string): void {
    throw new SyntaxError(message, '', '', node.location);
  }

  /**
   * デフォルト長さがフレーム数の場合に付点が使われていないかチェック
   *
   * @param node 調査するノード
   */
  private checkLength(
    node: MmlNode.NoteNode | MmlNode.RestNode | MmlNode.PartNode,
  ): void {
    if (!this.useDefaultFrames) return;

    const { duration, dots, frames } = node.value;

    if (duration === undefined || !Number.isFinite(duration)) {
      if (frames === undefined || !Number.isFinite(frames)) {
        if (dots !== undefined && dots !== 0) {
          this.errorOccured(
            node,
            '省略時長さがフレーム数の場合には長さを省略した付点を使用できません',
          );
        }
      }
    }
  }
}
