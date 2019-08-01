import { Filter } from '../types/Filter';

import { AddInitialNodes } from './AddInitialNodes';
import {
  defaultExpandLoopOptions,
  ExpandLoop,
  ExpandLoopOptions,
} from './ExapndLoop';
import {
  defaultExpandMacroOptions,
  ExpandMacro,
  ExpandMacroOptions,
} from './ExpandMacro';
import {
  defaultResolveLengthOptions,
  ResolveLength,
  ResolveLengthOptions,
} from './ResolveLength';
import { ResolveNote } from './ResolveNote';
import { ResolveRange } from './ResolveRange';
import { ResolveVolume } from './ResolveVolume';
import { Validate } from './Validate';

/**
 * 組み込みのフィルタ
 */
export const filters = {
  /**
   * デフォルト値の追加
   */
  addInitialNodes(): Filter {
    return new AddInitialNodes();
  },

  /**
   * ループ展開
   *
   * @param options.maxLoopDepth ループの入れ子の最大深さ
   */
  expandLoop(
    options: Partial<ExpandLoopOptions> = defaultExpandLoopOptions,
  ): Filter {
    return new ExpandLoop(options);
  },

  /**
   * マクロ展開
   *
   * @param options.maxMacroDepth マクロの入れ子の最大深さ
   */
  expandMacro(
    options: Partial<ExpandMacroOptions> = defaultExpandMacroOptions,
  ): Filter {
    return new ExpandMacro(options);
  },

  /**
   * 長さの解決（フレーム数に換算）
   *
   * @param options.fps 秒間フレーム数
   */
  resolveLength(
    options: Partial<ResolveLengthOptions> = defaultResolveLengthOptions,
  ): Filter {
    return new ResolveLength(options);
  },

  /**
   * 音階の解決
   */
  resolveNote(): Filter {
    return new ResolveNote();
  },

  /**
   * 範囲の解決
   */
  resolveRange(): Filter {
    return new ResolveRange();
  },

  /**
   * 音量の解決
   */
  resolveVolume(): Filter {
    return new ResolveVolume();
  },

  /**
   * データの正当性チェック
   */
  validate(): Filter {
    return new Validate();
  },
};
