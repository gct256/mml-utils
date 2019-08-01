import {
  defaultExpandLoopOptions,
  ExpandLoopOptions,
} from '../filters/ExapndLoop';
import {
  defaultExpandMacroOptions,
  ExpandMacroOptions,
} from '../filters/ExpandMacro';
import { filters } from '../filters/filters';
import {
  defaultResolveLengthOptions,
  ResolveLengthOptions,
} from '../filters/ResolveLength';
import { SyntaxError } from '../parse/pegParser/pegParser';
import { DataSet } from '../types/DataSet';
import { Filter } from '../types/Filter';
import * as MmlNode from '../types/MmlNode';
import { RhythmPart } from '../types/RhyhtmPart';
import { RhythmTrack, SongTrack } from '../types/Track';
import { Translator } from '../types/Translator';
import { clamp } from '../utils/clamp';

/** FM-BIOS変換オプション */
export interface FMBiosOptions
  extends ExpandLoopOptions,
    ExpandMacroOptions,
    ResolveLengthOptions {
  /** リズムの使用 */
  useRhythm: boolean;

  /** 音色データの配置アドレス */
  voiceDataOrigin: number;
}

/** FM-BIOS変換デフォルトオプション */
export const defaultFMBiosOptions: FMBiosOptions = {
  ...defaultExpandLoopOptions,
  ...defaultExpandMacroOptions,
  ...defaultResolveLengthOptions,
  useRhythm: true,
  voiceDataOrigin: 0,
};

/** FM-BIOS変換で使用可能なコマンド */
const fmbiosCommands = {
  /** サスティン指定 / 0でoff / 0以外でon */
  sustain: 'sustain',
};
/** FM-BIOS変換で使用可能な定義 */
const fmbiosDefinitions = {
  /** 音色定義 */
  voice: 'fmbios_voice',
};

/**
 * 長さの調整
 *
 * @param length 長さ（フレーム数）
 */
const translateLength = (length?: number): number[] => {
  if (length === undefined) return [0];

  if (length < 255) return [length];

  return [255, ...translateLength(length - 255)];
};

/**
 * 音階番号の調整
 *
 * @param noteNumber 音階番号
 */
const translateNoteNumber = (noteNumber: number): number => {
  // 下側の範囲外を丸める（O1Cはない）
  if (noteNumber < 1) return translateNoteNumber(noteNumber + 12);

  // 上側の範囲外を丸める
  if (noteNumber > 0x5f) return translateNoteNumber(noteNumber - 12);

  return noteNumber;
};

/**
 * 音量の調整
 *
 * @param volume 音量
 */
const filterVolume = (volume: number): number => {
  return clamp(volume, 0, 15);
};

/**
 * 楽器名を数値に変換
 *
 * @param name 楽器名
 */
const getPartNumberByName = (name: string): number => {
  switch (name) {
    case 'b':
      return 16;

    case 'c':
      return 2;

    case 'h':
      return 1;

    case 'm':
      return 4;

    case 's':
      return 8;

    default:
      return 0;
  }
};

/**
 * 楽器番号を数値に変換
 *
 * @param direct 楽器番号
 */
const getPartNumberByDirect = (direct: number): number => {
  switch (direct) {
    case 1:
    // fallthrough

    case 2:
    // fallthrough

    case 4:
    // fallthrough

    case 8:
    // fallthrough

    case 16:
      return direct;

    default:
      return 0;
  }
};

/**
 * リズムパートの数値作成
 *
 * @param parts リズムパート
 */
const getPartsNumber = (parts: RhythmPart[]): number => {
  const numbers: number[] = [];

  parts.forEach((part) => {
    if ('name' in part) {
      numbers.push(getPartNumberByName(part.name));
    } else {
      numbers.push(getPartNumberByDirect(part.direct));
    }
  });

  return numbers.reduce((x: number, y: number) => x + y, 0);
};

/**
 * 音色データ作成
 *
 * @param data 音色データ
 */
const getVoiceData = (data: number[]): number[] => {
  //   TL,FB
  //   AR,DR,SL,RR,KL,MT,AM,VB,EG,KR,DT  [MO]
  //   AR,DR,SL,RR,KL,MT,AM,VB,EG,KR,DT  [CA]
  //    0, 1
  //    2, 3, 4, 5, 6, 7, 8, 9,10,11,12
  //   13,14,15,16,17,18,19,20,21,22,23

  // [ 7] [ 6] [ 5] [ 4] [ 3] [ 2] [ 1] [ 0]
  // [AM] [VB] [EG] [KR] [     MULTIPLE    ]  Mod
  // [AM] [VB] [EG] [KR] [     MULTIPLE    ]  Car
  // [   KL  ] [  TL                       ]  Mod
  // [   KL  ] [  ] [DC] [DM] [    FB      ]
  // [       AR        ] [        DR       ]  Mod
  // [       AR        ] [        DR       ]  Car
  // [       SL        ] [        RR       ]  Mod
  // [       SL        ] [        RR       ]  Car

  /* eslint-disable no-bitwise */
  return [
    ((data[8] & 0x1) << 7) |
      ((data[9] & 0x1) << 6) |
      ((data[10] & 0x1) << 5) |
      ((data[11] & 0x1) << 4) |
      (data[7] & 0xf),
    ((data[19] & 0x1) << 7) |
      ((data[20] & 0x1) << 6) |
      ((data[21] & 0x1) << 5) |
      ((data[22] & 0x1) << 4) |
      (data[18] & 0xf),
    ((data[6] & 0x3) << 6) | (data[0] & 0x3f),
    ((data[17] & 0x3) << 6) |
      ((data[12] & 0x1) << 4) |
      ((data[23] & 0x1) << 3) |
      (data[1] & 0x7),
    ((data[2] & 0xf) << 4) | (data[3] & 0xf),
    ((data[13] & 0xf) << 4) | (data[14] & 0xf),
    ((data[4] & 0xf) << 4) | (data[5] & 0xf),
    ((data[15] & 0xf) << 4) | (data[16] & 0xf),
  ];
  /* eslint-enable no-bitwise */
};

/** 音色指定 */
type Voice = string | number;

/** FM-BIOS変換の結果 */
interface FMBiosResult {
  music: Buffer;
  voice: Buffer;
}

/**
 * MSX-MUSIC の FM-BIOS 用のデータ変換
 */
export class FMBios extends Translator<FMBiosResult> {
  /** オプション */
  private options: FMBiosOptions;

  /** ソング用の作業バッファ */
  private buffer: number[];

  /** 全ソング用のバッファ */
  private buffers: number[][];

  /** リズム用の作業バッファ */
  private rhythmBuffer: number[];

  /** 音色 -> データ のマップ */
  private voiceMap: Map<Voice, number[]>;

  /** チャンネル -> 位置 -> 音色 のマップ */
  private voiceOffsetMap: Map<number, Map<number, Voice>>;

  /** スラーフラグ */
  private slur: boolean;

  /** スラー発見フラグ */
  private slurFound: boolean;

  /** 最後の音階の位置 */
  private noteIndex: number;

  /**
   * コンストラクタ
   *
   * @param options.useRhythm リズム使用フラグ
   * @param options.origin メモリ配置位置 / ユーザー音色不使用であればなんでもよい
   */
  public constructor(options: Partial<FMBiosOptions> = defaultFMBiosOptions) {
    super();

    this.options = { ...defaultFMBiosOptions, ...options };
    this.buffer = [];
    this.buffers = [];
    this.rhythmBuffer = [];
    this.voiceMap = new Map();
    this.voiceOffsetMap = new Map();
    this.slur = false;
    this.slurFound = false;
    this.noteIndex = -1;
  }

  // override
  protected getFilters(): Filter[] {
    return [
      filters.validate(),
      filters.addInitialNodes(),
      filters.expandLoop(this.options),
      filters.expandMacro(this.options),
      filters.resolveLength(this.options),
      filters.resolveNote(),
      filters.resolveRange(),
      filters.resolveVolume(),
    ];
  }

  // override
  protected getResult(): FMBiosResult {
    // 演奏データの長さ
    const musicLength =
      0 +
      // リズムのヘッダ長さ
      (this.options.useRhythm ? 2 : 0) +
      // ソングのヘッダ長さ
      this.buffers.length * 2 +
      // リズムのデータ長さ
      (this.options.useRhythm ? this.rhythmBuffer.length : 0) +
      // ソングのデータ長さ
      this.buffers.reduce((x: number, y: number[]) => x + y.length, 0);
    // 音色データの長さ
    const voiceLength = this.voiceMap.size * 8;
    const music: Buffer = Buffer.alloc(musicLength);
    const voice: Buffer = Buffer.alloc(voiceLength);

    let position = 0;
    let address = (this.buffers.length + (this.options.useRhythm ? 1 : 0)) * 2;

    const addHeader = (buffer: number[]): void => {
      music.writeUInt16LE(address, position);
      position += 2;
      address += buffer.length;
    };

    const addBody = (buffer: Buffer): void => {
      buffer.copy(music, position);
      position += buffer.length;
    };

    // ヘッダ部
    if (this.options.useRhythm) addHeader(this.rhythmBuffer);

    this.buffers.forEach((buffer) => addHeader(buffer));

    // ボディ部
    if (this.options.useRhythm) addBody(Buffer.from(this.rhythmBuffer));

    this.buffers.forEach((b, i) => {
      const buffer = Buffer.from(b);
      // 音色差し替え
      const offsetMap = this.voiceOffsetMap.get(i);

      if (offsetMap !== undefined) {
        offsetMap.forEach((name, offset) => {
          const num = Array.from(this.voiceMap.keys()).indexOf(name);

          buffer.writeUInt16LE(this.options.voiceDataOrigin + num * 8, offset);
        });
      }

      addBody(buffer);
    });

    // 音色データ
    position = 0;

    this.voiceMap.forEach((data) => {
      Buffer.from(data).copy(voice, position);
      position += data.length;
    });

    return { music, voice };
  }

  // override
  protected getTargetSongs(dataSet: DataSet): SongTrack[] {
    return dataSet.trackSet.findSongTracks(this.options.useRhythm ? 6 : 9);
  }

  // override
  protected getTargetRhythms(dataSet: DataSet): RhythmTrack[] {
    return dataSet.trackSet.findRhythmTracks(this.options.useRhythm ? 1 : 0);
  }

  // override
  protected onBeforeSong(_song: SongTrack): void {
    this.voiceOffsetMap.set(this.buffers.length, new Map());
    this.buffer = [];
    this.buffers.push(this.buffer);
    this.slur = false;
    this.slurFound = false;
    this.noteIndex = -1;
  }

  // override
  protected onAfterSong(_song: SongTrack): void {
    this.buffer.push(0xff);
  }

  // override
  protected onBeforeRhythm(_rhythm: RhythmTrack): void {
    this.rhythmBuffer = [];
    this.buffer = this.rhythmBuffer;
  }

  // override
  protected onAfterRhythm(_rhythm: RhythmTrack): void {
    this.rhythmBuffer.push(0xff);
  }

  // override
  protected onDefine(node: MmlNode.DefineNode): void {
    switch (node.value.name) {
      case fmbiosDefinitions.voice:
        MmlNode.getNodeArg(node, 0, {
          foundNumber: (no: number) => this.defineVoice(no, node),
          foundName: (name: string) => this.defineVoice(name, node),
        });
        break;

      default:
        break;
    }
  }

  // override
  protected onSlur(_node: MmlNode.SlurNode): void {
    // スラー発見フラグ立てる
    this.slurFound = true;

    // スラーフラグ立っていなければ立てて
    // 直前の音階の前にデータを割り込ませる
    if (!this.slur) {
      if (this.noteIndex >= 0) {
        this.buffer.splice(this.noteIndex, 0, 0x85);
      }

      this.slur = true;
    }
  }

  // override
  protected onQuickVoice(node: MmlNode.QuickVoiceNode): void {
    const { no } = node.value;

    if (no >= 0 && no <= 15) {
      this.buffer.push(0x70 + no);
    } else if (no <= 63) {
      this.buffer.push(0x82, no);
    } else {
      this.addVoice(no);
    }
  }

  // override
  protected onQuickNamedVoice(node: MmlNode.QuickNamedVoiceNode): void {
    this.addVoice(node.value.name);
  }

  // override
  protected onCommand(node: MmlNode.CommandNode): void {
    switch (node.value.name) {
      case fmbiosCommands.sustain:
        if (node.value.args[0] === 0) {
          this.buffer.push(0x81);
        } else {
          this.buffer.push(0x80);
        }
        break;

      default:
        break;
    }
  }

  // override
  protected onDirectNote(node: MmlNode.DirectNoteNode): void {
    // スラー発見されておらずスラーフラグ立っていなければ
    // 直前の音階の前にデータを割り込ませる
    if (!this.slurFound && this.slur && this.noteIndex >= 0) {
      this.buffer.splice(this.noteIndex, 0, 0x84);
      this.slur = false;
    }

    this.slurFound = false;

    // 音階の位置を記録
    this.noteIndex = this.buffer.length;

    this.buffer.push(
      translateNoteNumber(node.value.direct),
      ...translateLength(node.value.frames),
    );
  }

  // override
  protected onQuantize(node: MmlNode.QuantizeNode): void {
    this.buffer.push(0x86, node.value.rate);
  }

  // override
  protected onRest(node: MmlNode.RestNode): void {
    this.buffer.push(0, ...translateLength(node.value.frames));
  }

  // override
  protected onVolume(node: MmlNode.VolumeNode): void {
    if (!this.isSong()) return;

    this.buffer.push(0x6f - filterVolume(node.value.volume));
  }

  // override
  protected onPartVolume(node: MmlNode.PartVolumeNode): void {
    if (!this.isRhythm()) return;

    const num = getPartsNumber(node.value.parts);

    if (num !== 0) {
      this.buffer.push(0xa0 + num);
      this.buffer.push(0x0f - filterVolume(node.value.volume));
    }
  }

  // override
  protected onPart(node: MmlNode.PartNode): void {
    const num = getPartsNumber(node.value.parts);

    if (num !== 0) {
      this.buffer.push(0x20 + num);
      this.buffer.push(...translateLength(node.value.frames));
    }
  }

  /**
   * 音色定義の追加
   *
   * @param voice 音色指定
   * @param node 定義ノード
   */
  private defineVoice(voice: Voice, node: MmlNode.DefineNode): void {
    if (typeof voice === 'number') {
      if (voice <= 63) {
        throw new SyntaxError(
          '音色番号は64以降を使用してください',
          '',
          '',
          node.location,
        );
      }
    }

    this.voiceMap.set(
      voice,
      getVoiceData(MmlNode.getNodeArgsAsNumbers(node, 1, 24)),
    );
  }

  /**
   * 音色使用部分の追加
   *
   * @param voice 音色指定
   */
  private addVoice(voice: Voice): void {
    const map = this.voiceOffsetMap.get(this.buffers.length - 1);

    if (map !== undefined) {
      map.set(this.buffer.length + 1, voice);
      this.buffer.push(0x83, 0x00, 0x00);
    }
  }
}
