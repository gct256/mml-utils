import {
  defaultExpandLoopOptions,
  ExpandLoopOptions,
} from '../filters/ExapndLoop';
import {
  defaultExpandMacroOptions,
  ExpandMacroOptions,
} from '../filters/ExpandMacro';
import {
  defaultResolveLengthOptions,
  ResolveLengthOptions,
} from '../filters/ResolveLength';
import { Filter } from '../types/Filter';
import { MacroSet } from '../types/MacroSet';
import { MmlNode } from '../types/MmlNode';
import { MacroTrack, RhythmTrack, SongTrack } from '../types/Track';
import { Translator } from '../types/Translator';

/** JavaScriptオブジェクト変換オプション */
export interface JsObjectOptions
  extends ExpandLoopOptions,
    ExpandMacroOptions,
    ResolveLengthOptions {
  /** マクロを含めるか */
  includeMacro: boolean;

  /** 適用するフィルタ生成コールバック */
  makeFilters(): Filter[];
}

/** JavaScriptオブジェクト変換デフォルトオプション */
export const defaultJsObjectOptions: JsObjectOptions = {
  ...defaultExpandLoopOptions,
  ...defaultExpandMacroOptions,
  ...defaultResolveLengthOptions,
  includeMacro: false,
  makeFilters: () => [],
};

/** 結果 */
interface JsObjectResult {
  songs: object;
  rhythms: object;
  macro?: object;
}

/**
 * ノードからlocationを削除
 *
 * @param node ノード
 */
const removeLocation = (node: MmlNode): Partial<MmlNode> => {
  const result: Partial<MmlNode> = { ...node };

  delete result.location;

  return result;
};

/**
 * JavaScriptオブジェクトへのデータ変換
 */
export class JsObject extends Translator<JsObjectResult> {
  /** オプション */
  private options: JsObjectOptions;

  private songs: SongTrack[];

  private rhythms: RhythmTrack[];

  public constructor(
    options: Partial<JsObjectOptions> = defaultJsObjectOptions,
  ) {
    super();

    this.options = { ...defaultJsObjectOptions, ...options };
    this.songs = [];
    this.rhythms = [];
    this.macroSet = MacroSet.EMPTY;
  }

  // override
  protected getFilters(): Filter[] {
    return this.options.makeFilters();
  }

  // override
  protected getResult(): JsObjectResult {
    const result: JsObjectResult = {
      songs: this.songs.map((song: SongTrack) =>
        song.getNodes().map(removeLocation),
      ),
      rhythms: this.rhythms.map((rhythm: RhythmTrack) =>
        rhythm.getNodes().map(removeLocation),
      ),
    };

    if (this.options.includeMacro) {
      result.macro = this.macroSet.getAllMacros().map((macro: MacroTrack) =>
        macro.isNamed()
          ? {
              name: macro.name,
              nodes: macro.getNodes().map(removeLocation),
            }
          : {
              no: macro.no,
              nodes: macro.getNodes().map(removeLocation),
            },
      );
    }

    return result;
  }

  // override
  protected onBeforeSong(song: SongTrack): void {
    this.songs.push(song);
  }

  // override
  protected onBeforeRhythm(rhythm: RhythmTrack): void {
    this.rhythms.push(rhythm);
  }
}
