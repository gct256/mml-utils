import { defaults } from '../constants/defaults';
import { SyntaxError } from '../parse/pegParser/pegParser';
import { Filter } from '../types/Filter';
import * as MmlNode from '../types/MmlNode';

/**
 * マクロ展開フィルタのオプション
 */
export interface ExpandMacroOptions {
  /** マクロの入れ子の最大深さ */
  maxMacroDepth: number;
}

/**
 * マクロ展開フィルタのデフォルトオプション
 */
export const defaultExpandMacroOptions: ExpandMacroOptions = {
  maxMacroDepth: defaults.maxMacroDepth,
};

/**
 * マクロ展開フィルタ
 */
export class ExpandMacro extends Filter {
  /** オプション */
  private options: ExpandMacroOptions;

  /** 現在の展開深さ */
  private depth: number;

  /**
   * コンストラクタ
   *
   * @param options.maxMacroDepth マクロの入れ子の最大深さ
   */
  public constructor(
    options: Partial<ExpandMacroOptions> = defaultExpandMacroOptions,
  ) {
    super();

    this.options = { ...defaultExpandMacroOptions, ...options };
    this.depth = 0;
  }

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.depth = 0;

    return [];
  }

  // override
  protected onExpandMacro(node: MmlNode.ExpandMacroNode): MmlNode.MmlNode[] {
    const result: MmlNode.MmlNode[] = this.enterMacro(node);

    this.exitMacro();

    return result;
  }

  // override
  protected onExpandNamedMacro(
    node: MmlNode.ExpandNamedMacroNode,
  ): MmlNode.MmlNode[] {
    const result: MmlNode.MmlNode[] = this.enterMacro(node);

    this.exitMacro();

    return result;
  }

  /**
   * マクロ展開開始
   *
   * @param node マクロ展開のノード
   */
  private enterMacro(
    node: MmlNode.ExpandMacroNode | MmlNode.ExpandNamedMacroNode,
  ): MmlNode.MmlNode[] {
    if (this.depth > this.options.maxMacroDepth) {
      throw new SyntaxError(
        `マクロの入れ子数が上限（${this.options.maxMacroDepth}）を超えています`,
        '',
        '',
        node.location,
      );
    }

    this.depth += 1;

    return this.filter(
      this.macroSet
        .getMacro('name' in node.value ? node.value.name : node.value.no)
        .getNodes(),
      this.getCurrentNodes(),
    );
  }

  /**
   * マクロ展開終了
   */
  private exitMacro(): void {
    this.depth -= 1;
  }
}
