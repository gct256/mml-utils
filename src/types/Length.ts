import FractionJs from 'fraction.js';

import { MmlNode } from './MmlNode';
import * as NodeType from './MmlType';

/**
 * 長さクラス
 */
export class Length {
  /** 音符の長さ */
  public readonly duration: number;

  /** 付点の数 */
  public readonly dots: number;

  /** フレーム数 */
  public readonly frames: number;

  /**
   *
   * @param duration 音符の長さ / 数値でない場合・0未満は長さ省略と解釈
   * @param dots 付点の数 / 数値でない場合・0未満は付点なしと解釈
   * @param frames フレーム数 / 数値でない場合・0未満は長さ省略と解釈
   */
  public constructor(duration?: number, dots?: number, frames?: number) {
    this.duration =
      typeof duration === 'number' && Number.isFinite(duration) && duration >= 0
        ? duration
        : NaN;
    this.dots =
      typeof dots === 'number' && Number.isFinite(dots) && dots >= 0 ? dots : 0;
    this.frames =
      typeof frames === 'number' && Number.isFinite(frames) && frames >= 0
        ? frames
        : NaN;
  }

  /**
   * ノードから長さを生成
   *
   * @param node ノード
   * @param defaultLength 省略時長さ
   */
  public static fromNode(node: MmlNode, defaultLength: Length): Length {
    switch (node.type) {
      case NodeType.LENGTH:
        // 省略時長さ
        return new Length(
          node.value.duration,
          node.value.dots,
          node.value.frames,
        );

      case NodeType.NOTE:
      // fallthrough

      case NodeType.DIRECT_NOTE:
      // fallthrough

      case NodeType.REST:
      // fallthrough

      case NodeType.PART: {
        const { duration, dots, frames } = node.value;

        if (duration === undefined || !Number.isFinite(duration)) {
          if (frames === undefined || !Number.isFinite(frames)) {
            // 音符長さもフレーム数も数値でなければ省略あつかい
            if (Number.isFinite(defaultLength.duration)) {
              // デフォルト長さがフレーム数でない場合
              return new Length(
                defaultLength.duration,
                // 省略時でも付点は追加される場合がある
                defaultLength.dots + (dots !== undefined ? dots : 0),
                0,
              );
            }

            // デフォルト長さがフレーム数の場合付点は無視
            return new Length(defaultLength.duration, 0, defaultLength.frames);
          }

          // フレーム数
          return new Length(undefined, 0, frames);
        }

        // 音符の長さ＋付点
        return new Length(duration, dots, 0);
      }

      default:
        return defaultLength;
    }
  }

  /**
   * 省略された長さかどうか
   */
  public isDefault(): boolean {
    return !this.hasDuration() && !this.hasFrames();
  }

  /**
   * 音符の長さを持つかどうか
   */
  public hasDuration(): boolean {
    return Number.isFinite(this.duration);
  }

  /**
   * フレーム数を持つかどうか
   */
  public hasFrames(): boolean {
    return Number.isFinite(this.frames);
  }

  /**
   * 条件下でのフレーム数
   *
   * @param fps 秒間フレーム数
   * @param tempo テンポ
   * @param addDots 追加付点
   */
  public getFrames(fps: number, tempo: number, addDots: number): FractionJs {
    if (Number.isFinite(this.duration)) {
      // 音符の長さの場合はFPSベースで計算
      const factor = new FractionJs(fps).mul(240).div(tempo);

      let frames = factor.div(this.duration);

      // 付点
      let d = this.duration * 2;

      for (let i = 0; i < this.dots + addDots; i += 1) {
        frames = frames.add(factor.div(d));
        d *= 2;
      }

      return frames;
    }

    // フレーム数の場合はそのまま
    return new FractionJs(this.frames);
  }
}
