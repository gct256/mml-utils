import { Accent } from './Accent';
import { Location } from './Location';
import * as MmlType from './MmlType';
import { RhythmPart } from './RhyhtmPart';

/** ノードの値：名前 */
export interface MmlNodeValueName {
  /** 名前 */
  name: string;
}

/** ノードの値：文字列 */
export interface MmlNodeValueString {
  /** 文字列 */
  str: string;
}

/** ノードの引数 */
export type MmlNodeArgument = number | MmlNodeValueName | MmlNodeValueString;

/** ノード：コメント */
export interface CommentNode {
  type: typeof MmlType.COMMENT;
  value: {
    comment: string;
  };
  location: Location;
}

/** ノード：制御 */
export interface ControlNode {
  type: typeof MmlType.CONTROL;
  value: {
    name: string;
    args: MmlNodeArgument[];
  };
  location: Location;
}

/** ノード：定義 */
export interface DefineNode {
  type: typeof MmlType.DEFINE;
  value: {
    name: string;
    args: MmlNodeArgument[];
  };
  location: Location;
}

/** ノード：対象指定（ソングトラック） */
export interface TargetSongNode {
  type: typeof MmlType.TARGET_SONG;
  value: {
    channel: number;
  };
  location: Location;
}

/** ノード：対象指定（リズムトラック） */
export interface TargetRhythmNode {
  type: typeof MmlType.TARGET_RHYTHM;
  value: {
    channel: number;
  };
  location: Location;
}

/** ノード：対象指定（番号マクロ） */
export interface TargetMacroByNoNode {
  type: typeof MmlType.TARGET_MACRO_BY_NO;
  value: {
    no: number;
  };
  location: Location;
}

/** ノード：対象指定（名前マクロ） */
export interface TargetMacroByNameNode {
  type: typeof MmlType.TARGET_MACRO_BY_NAME;
  value: {
    name: string;
  };
  location: Location;
}

/** ノード：スラー・タイ */
export interface SlurNode {
  type: typeof MmlType.SLUR;
  value: {};
  location: Location;
}

/** ノード：マクロ展開 */
export interface ExpandMacroNode {
  type: typeof MmlType.EXPAND_MACRO;
  value: {
    no: number;
  };
  location: Location;
}

/** ノード：名前付きマクロ展開 */
export interface ExpandNamedMacroNode {
  type: typeof MmlType.EXPAND_NAMED_MACRO;
  value: {
    name: string;
  };
  location: Location;
}

/** ノード：簡易相対オクターブ */
export interface QuickOctaveLtNode {
  type: typeof MmlType.QUICK_OCTAVE_LT;
  value: {
    count: number;
  };
  location: Location;
}

/** ノード：簡易相対オクターブ */
export interface QuickOctaveGtNode {
  type: typeof MmlType.QUICK_OCTAVE_GT;
  value: {
    count: number;
  };
  location: Location;
}

/** ノード：簡易音色指定 */
export interface QuickVoiceNode {
  type: typeof MmlType.QUICK_VOICE;
  value: {
    no: number;
  };
  location: Location;
}

/** ノード：簡易音色指定（名前） */
export interface QuickNamedVoiceNode {
  type: typeof MmlType.QUICK_NAMED_VOICE;
  value: {
    name: string;
  };
  location: Location;
}

/** ノード：任意のコマンド */
export interface CommandNode {
  type: typeof MmlType.COMMAND;
  value: {
    name: string;
    args: MmlNodeArgument[];
  };
  location: Location;
}

/** ノード：発音（音階の名前指定） */
export interface NoteNode {
  type: typeof MmlType.NOTE;
  value: {
    note: number;
    frames: number;
    offset?: number;
    duration?: number;
    dots?: number;
    accent?: Accent;
  };
  location: Location;
}

/** ノード：省略時長さ */
export interface LengthNode {
  type: typeof MmlType.LENGTH;
  value: {
    duration: number;
    dots?: number;
    frames: number;
  };
  location: Location;
}

/** ノード：発音（音階の直接指定） */
export interface DirectNoteNode {
  type: typeof MmlType.DIRECT_NOTE;
  value: {
    direct: number;
    frames: number;
    duration?: number;
    dots?: number;
    accent?: Accent;
  };
  location: Location;
}

/** ノード：オクターブ */
export interface OctaveNode {
  type: typeof MmlType.OCTAVE;
  value: {
    octave: number;
  };
  location: Location;
}

/** ノード：相対オクターブ */
export interface RelOctaveNode {
  type: typeof MmlType.REL_OCTAVE;
  value: {
    offset: number;
  };
  location: Location;
}

/** ノード：音長比 */
export interface QuantizeNode {
  type: typeof MmlType.QUANTIZE;
  value: {
    rate: number;
  };
  location: Location;
}

/** ノード：休符 */
export interface RestNode {
  type: typeof MmlType.REST;
  value: {
    frames: number;
    duration?: number;
    dots?: number;
  };
  location: Location;
}

/** ノード：テンポ */
export interface TempoNode {
  type: typeof MmlType.TEMPO;
  value: {
    tempo: number;
  };
  location: Location;
}

/** ノード：音量 */
export interface VolumeNode {
  type: typeof MmlType.VOLUME;
  value: {
    volume: number;
  };
  location: Location;
}

/** ノード：相対音量 */
export interface RelVolumeNode {
  type: typeof MmlType.REL_VOLUME;
  value: {
    offset: number;
  };
  location: Location;
}

/** ノード：楽器の音量 */
export interface PartVolumeNode {
  type: typeof MmlType.PART_VOLUME;
  value: {
    parts: RhythmPart[];
    volume: number;
  };
  location: Location;
}

/** ノード：楽器の相対音量 */
export interface PartRelVolumeNode {
  type: typeof MmlType.PART_REL_VOLUME;
  value: {
    parts: RhythmPart[];
    offset: number;
  };
  location: Location;
}

/** ノード：ループ始端 */
export interface LoopBeginNode {
  type: typeof MmlType.LOOP_BEGIN;
  value: {
    count: number;
  };
  location: Location;
}

/** ノード：ループ終端 */
export interface LoopEndNode {
  type: typeof MmlType.LOOP_END;
  value: {
    count: number;
  };
  location: Location;
}

/** ノード：ループ中断 */
export interface LoopBreakNode {
  type: typeof MmlType.LOOP_BREAK;
  value: {};
  location: Location;
}

/** ノード：簡易休符 */
export interface QuickRestNode {
  type: typeof MmlType.QUICK_REST;
  value: {
    count: number;
  };
  location: Location;
}

/** ノード：発音（リズム楽器） */
export interface PartNode {
  type: typeof MmlType.PART;
  value: {
    frames: number;
    parts: RhythmPart[];
    duration?: number;
    dots?: number;
  };
  location: Location;
}

/** ノード：範囲アクセント（強め） */
export interface RangeStrongNode {
  type: typeof MmlType.RANGE_STRONG;
  value: {};
  location: Location;
}

/** ノード：範囲スラー・タイ */
export interface RangeSlurNode {
  type: typeof MmlType.RANGE_SLUR;
  value: {};
  location: Location;
}

/** ノード：範囲アクセント（弱め） */
export interface RangeWeakNode {
  type: typeof MmlType.RANGE_WEAK;
  value: {};
  location: Location;
}

/** ノード：範囲終端 */
export interface RangeEndNode {
  type: typeof MmlType.RANGE_END;
  value: {};
  location: Location;
}

/** ノード：空白 */
export interface WsNode {
  type: typeof MmlType.WS;
  value: {
    ws: string;
  };
  location: Location;
}

/** ノード：行末 */
export interface EolNode {
  type: typeof MmlType.EOL;
  value: {};
  location: Location;
}

/** ノード */
export type MmlNode =
  | CommentNode
  | ControlNode
  | DefineNode
  | TargetSongNode
  | TargetRhythmNode
  | TargetMacroByNoNode
  | TargetMacroByNameNode
  | SlurNode
  | ExpandMacroNode
  | ExpandNamedMacroNode
  | QuickOctaveLtNode
  | QuickOctaveGtNode
  | QuickVoiceNode
  | QuickNamedVoiceNode
  | CommandNode
  | NoteNode
  | LengthNode
  | DirectNoteNode
  | OctaveNode
  | RelOctaveNode
  | QuantizeNode
  | RestNode
  | TempoNode
  | VolumeNode
  | RelVolumeNode
  | PartVolumeNode
  | PartRelVolumeNode
  | LoopBeginNode
  | LoopEndNode
  | LoopBreakNode
  | QuickRestNode
  | PartNode
  | RangeStrongNode
  | RangeSlurNode
  | RangeWeakNode
  | RangeEndNode
  | WsNode
  | EolNode;

/**
 * ノードが長さを持つ種別かどうかを判定
 *
 * @param node ノード
 */
export const isNodeHasLength = ({ type }: MmlNode): boolean => {
  switch (type) {
    case MmlType.NOTE:

    // fallthrough
    case MmlType.DIRECT_NOTE:

    // fallthrough
    case MmlType.REST:

    // fallthrough
    case MmlType.LOOP_BEGIN:

    // fallthrough
    case MmlType.LOOP_END:

    // fallthrough
    case MmlType.LOOP_BREAK:

    // fallthrough
    case MmlType.QUICK_REST:

    // fallthrough
    case MmlType.PART:
      return true;

    default:
      return false;
  }
};

/** ノート引数取得ハンドラ */
interface MmlNodeArgHandlers {
  foundNumber?(n: number): void;
  foundName?(name: string): void;
  foundString?(str: string): void;
  notFound?(): void;
}

/**
 * ノードの引数の種別に応じてコールバックを実行する
 *
 * @param node ノード
 * @param n 引数の位置
 * @param handlers.foundNumber 数値の場合のコールバック
 * @param handlers.foundName 名前の場合のコールバック
 * @param handlers.foundString 文字列の場合のコールバック
 * @param handlers.notFound 文字列の場合のコールバック
 */
export const getNodeArg = (
  node: MmlNode,
  n: number,
  handlers: MmlNodeArgHandlers,
): void => {
  if ('args' in node.value) {
    const arg = node.value.args[n];

    if (typeof arg === 'number') {
      if (handlers.foundNumber) handlers.foundNumber(arg);
    } else if (arg === undefined) {
      if (handlers.notFound) handlers.notFound();
    } else if ('name' in arg) {
      if (handlers.foundName) handlers.foundName(arg.name);
    } else if ('str' in arg) {
      if (handlers.foundString) handlers.foundString(arg.str);
    }
  }
};

/**
 * ノードの引数から数値の配列を取得する
 *
 * @param node ノード
 * @param begin 取得開始位置
 * @param end 取得終了位置 / 省略時は最後まで
 * @param defaultNumber 数値でない場合の値
 */
export const getNodeArgsAsNumbers = (
  node: MmlNode,
  begin: number,
  end?: number,
  defaultNumber: number = 0,
): number[] => {
  if (!('args' in node.value)) return [];

  const result: number[] = [];
  const e = end === undefined ? node.value.args.length - 1 : end;

  for (let i = begin; i <= e; i += 1) {
    const arg = node.value.args[i];

    result.push(typeof arg === 'number' ? arg : defaultNumber);
  }

  return result;
};
