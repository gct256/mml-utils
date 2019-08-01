import { defaultFMBiosOptions, FMBios, FMBiosOptions } from './FMBios';
import { defaultJsObjectOptions, JsObject, JsObjectOptions } from './JsObject';
import { Redirect } from './Redirect';

/**
 * 組み込みトランスレータ
 */
export const translators = {
  /**
   * MSX-MUSICのFM-BIOS形式に変換
   *
   * @param options.maxLoopDepth ループの入れ子の最大深さ
   * @param options.maxMacroDepth マクロの入れ子の最大深さ
   * @param options.fps 秒間フレーム数
   * @param options.useRhythm リズムの有無
   * @param options.origin メモリ配置位置 / ユーザー音色不使用であればなんでもよい
   */
  fmbios(options: Partial<FMBiosOptions> = defaultFMBiosOptions) {
    return new FMBios(options);
  },

  /**
   * JavaScriptオブジェクトに変換
   *
   * @param options.maxLoopDepth ループの入れ子の最大深さ
   * @param options.maxMacroDepth マクロの入れ子の最大深さ
   * @param options.fps 秒間フレーム数
   * @param options.includeMacro マクロを含めるか
   */
  jsObject(options: Partial<JsObjectOptions> = defaultJsObjectOptions) {
    return new JsObject(options);
  },

  /**
   * 変換しない
   */
  redirect() {
    return new Redirect();
  },
};
