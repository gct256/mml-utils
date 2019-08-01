import FractionJs from 'fraction.js';

import { controls } from '../constants/controls';
import { defaults } from '../constants/defaults';
import { Filter } from '../types/Filter';
import { Length } from '../types/Length';
import * as MmlNode from '../types/MmlNode';
import * as MmlType from '../types/MmlType';

/**
 * 長さの解決フィルタのオプション
 */
export interface ResolveLengthOptions {
  /** 秒間フレーム数 */
  fps: number;
}

/**
 * 長さの解決フィルタのデフォルトオプション
 */
export const defaultResolveLengthOptions: ResolveLengthOptions = {
  fps: defaults.fps,
};

/**
 * 長さの解決フィルタ（音符の長さをフレーム数に変換）
 */
export class ResolveLength extends Filter {
  /** オプション */
  private options: ResolveLengthOptions;

  /** 現在のテンポ */
  private tempo: number;

  /** 現在の省略時長さ */
  private length: Length;

  /** 現在の位置 */
  private total: FractionJs;

  /**
   * コンストラクタ
   *
   * @param options.fps 秒間フレーム数
   */
  public constructor(
    options: Partial<ResolveLengthOptions> = defaultResolveLengthOptions,
  ) {
    super();

    this.options = { ...defaultResolveLengthOptions, ...options };
    this.tempo = defaults.tempo;
    this.length = new Length(defaults.duration, 0, 0);
    this.total = new FractionJs(0);
  }

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.tempo = defaults.tempo;
    this.length = new Length(defaults.duration, 0, 0);
    this.total = new FractionJs(0);

    return [];
  }

  // override
  protected onControl(node: MmlNode.ControlNode): MmlNode.MmlNode[] {
    if (node.value.name === controls.tempo) {
      // テンポ変更
      MmlNode.getNodeArg(node, 0, {
        foundNumber: (x: number) => {
          this.tempo = x;
        },
      });

      return [];
    }

    return [node];
  }

  // override
  protected onNote(node: MmlNode.NoteNode): MmlNode.MmlNode[] {
    const { note, offset, accent } = node.value;
    const value: MmlNode.NoteNode['value'] = {
      note,
      frames: this.getFrames(node),
    };

    if (offset !== undefined) value.offset = offset;

    if (accent !== undefined) value.accent = accent;

    return [
      {
        value,
        type: MmlType.NOTE,
        location: node.location,
      },
    ];
  }

  // override
  protected onLength(node: MmlNode.LengthNode): MmlNode.MmlNode[] {
    this.length = Length.fromNode(node, this.length);

    return [];
  }

  // override
  protected onDirectNote(node: MmlNode.DirectNoteNode): MmlNode.MmlNode[] {
    const { direct, accent } = node.value;
    const value: MmlNode.DirectNoteNode['value'] = {
      direct,
      frames: this.getFrames(node),
    };

    if (accent !== undefined) value.accent = accent;

    return [
      {
        value,
        type: MmlType.DIRECT_NOTE,
        location: node.location,
      },
    ];
  }

  // override
  protected onRest(node: MmlNode.RestNode): MmlNode.MmlNode[] {
    return [
      {
        type: MmlType.REST,
        value: {
          frames: this.getFrames(node),
        },
        location: node.location,
      },
    ];
  }

  // override
  protected onTempo(node: MmlNode.TempoNode): MmlNode.MmlNode[] {
    this.tempo = node.value.tempo;

    return [];
  }

  // override
  protected onQuickRest(node: MmlNode.QuickRestNode): MmlNode.MmlNode[] {
    return [
      {
        type: MmlType.REST,
        value: {
          frames: this.getFrames(node, this.length, node.value.count),
        },
        location: node.location,
      },
    ];
  }

  // override
  protected onPart(node: MmlNode.PartNode): MmlNode.MmlNode[] {
    const { parts } = node.value;
    const value: MmlNode.PartNode['value'] = {
      parts,
      frames: this.getFrames(node),
    };

    return [
      {
        value,
        type: MmlType.PART,
        location: node.location,
      },
    ];
  }

  /**
   * ノードの長さをフレーム数に変換
   *
   * @param node ノード
   * @param length 省略時長さ
   * @param repeat 繰り返し数
   */
  private getFrames(
    node: MmlNode.MmlNode,
    length?: Length,
    repeat: number = 1,
  ): number {
    const len =
      length === undefined ? Length.fromNode(node, this.length) : length;
    const frames = len.getFrames(this.options.fps, this.tempo, 0).mul(repeat);
    const next = this.total.add(frames);
    // テンポずれが極力起こらないようfractionライブラリで計算
    const intFrames = next.round().valueOf() - this.total.round().valueOf();

    this.total = next;

    return intFrames;
  }
}
