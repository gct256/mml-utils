import { defaults } from '../constants/defaults';
import { SyntaxError } from '../parse/pegParser/pegParser';
import { Filter } from '../types/Filter';
import { Location, mergeLocation } from '../types/Location';
import * as MmlNode from '../types/MmlNode';

/** 内部ループ情報 */
interface Loop {
  /** ループ回数 */
  count: number;

  /** 開始位置 */
  start: number;

  /** 中断位置 */
  breakIndex: number;

  /** MML上での開始位置 */
  location: Location;
}

/**
 * ループ展開フィルタのオプション
 */
export interface ExpandLoopOptions {
  /** ループの入れ子の最大深さ */
  maxLoopDepth: number;
}

/**
 * ループ展開フィルタのデフォルトオプション
 */
export const defaultExpandLoopOptions: ExpandLoopOptions = {
  maxLoopDepth: defaults.maxLoopDepth,
};

/**
 * ループ展開フィルタ
 */
export class ExpandLoop extends Filter {
  /** オプション */
  private options: ExpandLoopOptions;

  /** ループ情報 */
  private loops: Loop[];

  /**
   * コンストラクタ
   *
   * @param options.maxLoopDepth ループの入れ子の最大深さ
   */
  public constructor(
    options: Partial<ExpandLoopOptions> = defaultExpandLoopOptions,
  ) {
    super();

    this.options = { ...defaultExpandLoopOptions, ...options };
    this.loops = [];
  }

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.loops = [];

    return [];
  }

  // override
  protected onLoopBegin(node: MmlNode.LoopBeginNode): MmlNode.MmlNode[] {
    if (this.loops.length > this.options.maxLoopDepth) {
      throw new SyntaxError(
        `ループの入れ子数が上限（${this.options.maxLoopDepth}）を超えています`,
        '',
        '',
        node.location,
      );
    }

    this.loops.push({
      count: node.value.count,
      start: this.getCurrentNodes().length,
      breakIndex: NaN,
      location: node.location,
    });

    return [];
  }

  // override
  protected onLoopEnd(node: MmlNode.LoopEndNode): MmlNode.MmlNode[] {
    const { count } = node.value;
    const loop = this.loops.pop();

    if (loop === undefined) return [];

    if (!Number.isFinite(loop.count)) {
      loop.count = Number.isFinite(count) ? count : defaults.loopCount;
    } else if (Number.isFinite(count)) {
      throw new SyntaxError(
        'ループ回数が二箇所に指定されています',
        '',
        '',
        mergeLocation(loop.location, node.location),
      );
    }

    if (loop.count === 0) {
      throw new SyntaxError(
        'ループを展開する場合は回数を0にすることはできません',
        '',
        '',
        mergeLocation(loop.location, node.location),
      );
    }

    const currentNodes = this.getCurrentNodes();
    const nodes: MmlNode.MmlNode[] = [];
    const hasBreak = Number.isFinite(loop.breakIndex);

    if (loop.count === 1 && hasBreak) {
      // ループ回数が1の場合 かつ 中断ありであれば中断位置で抜ける
      currentNodes.splice(loop.breakIndex, currentNodes.length);
    } else {
      for (let i = 1; i < loop.count; i += 1) {
        if (hasBreak && i === loop.count - 1) {
          // 中断ありであればループ最後の回で抜ける
          nodes.push(...currentNodes.slice(loop.start, loop.breakIndex));
        } else {
          nodes.push(...currentNodes.slice(loop.start));
        }
      }
    }

    return nodes;
  }

  // override
  protected onLoopBreak(_node: MmlNode.LoopBreakNode): MmlNode.MmlNode[] {
    const loop = this.loops[this.loops.length - 1];

    if (loop === undefined) return [];

    loop.breakIndex = this.getCurrentNodes().length;

    return [];
  }
}
