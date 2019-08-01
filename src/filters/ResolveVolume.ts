import { commands } from '../constants/commands';
import { defaults } from '../constants/defaults';
import { Accent, ACCENT_STRONG, ACCENT_WEAK } from '../types/Accent';
import { Filter } from '../types/Filter';
import { Location } from '../types/Location';
import * as MmlNode from '../types/MmlNode';
import * as MmlType from '../types/MmlType';
import { getRhythmPart, RhythmPart, RhythmPartKey } from '../types/RhyhtmPart';

/**
 * パート音量用のコンテナ
 */
class VolumeMap {
  private map: Map<number, RhythmPartKey[]> = new Map();

  /**
   * 音量を追加
   *
   * @param volume 音量
   * @param key キー
   */
  public add(volume: number, key: RhythmPartKey): void {
    const keys = this.map.get(volume);

    if (keys === undefined) {
      this.map.set(volume, [key]);
    } else {
      this.map.set(volume, [...keys, key]);
    }
  }

  /**
   * 追加した音量を音量ごとにノードにまとめる
   *
   * @param location  ノード位置
   */
  public getNodes(location: Location): MmlNode.MmlNode[] {
    const nodes: MmlNode.MmlNode[] = [];

    this.map.forEach((keys, volume) => {
      nodes.push({
        location,
        type: MmlType.PART_VOLUME,
        value: {
          volume,
          parts: keys.map(
            (key: RhythmPartKey): RhythmPart => getRhythmPart(key),
          ),
        },
      });
    });

    return nodes;
  }
}

/**
 * 音量の解決フィルタ
 */
export class ResolveVolume extends Filter {
  /** 現在の設定音量 */
  private volume: number = 0;

  /** 現在の実質音量 */
  private currentVolume: number = 0;

  /** 現在のリズムパートの音量 */
  private partVolumes: Map<RhythmPartKey, number> = new Map();

  /** 現在のリズムパートの実質音量 */
  private currentPartVolumes: Map<RhythmPartKey, number> = new Map();

  /** アクセント（強め）補正値 */
  private volumeStrong: number = 0;

  /** アクセント（弱め）補正値 */
  private volumeWeak: number = 0;

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.volume = defaults.volume;
    this.currentVolume = this.volume;

    this.partVolumes.clear();
    this.currentPartVolumes.clear();

    this.volumeStrong = defaults.volumeStrong;
    this.volumeWeak = defaults.volumeWeak;

    return [];
  }

  // override
  protected onCommand(node: MmlNode.CommandNode): MmlNode.MmlNode[] {
    if (node.value.name === commands.accent) {
      // アクセント補正値の指定
      MmlNode.getNodeArg(node, 0, {
        foundNumber: (strong: number) => {
          this.volumeStrong = strong;
          MmlNode.getNodeArg(node, 1, {
            foundNumber: (weak: number) => {
              this.volumeWeak = weak;
            },
            foundName: () => {
              this.volumeWeak = -strong;
            },
            foundString: () => {
              this.volumeWeak = -strong;
            },
            notFound: () => {
              this.volumeWeak = -strong;
            },
          });
        },
      });
    }

    return [node];
  }

  // override
  protected onNote(node: MmlNode.NoteNode): MmlNode.MmlNode[] {
    const v = this.volume + this.getVolumeOffset(node.value.accent);
    const value = { ...node.value };

    delete value.accent;

    const newNode: MmlNode.NoteNode = {
      location: node.location,
      type: node.type,
      value,
    };

    if (this.currentVolume === v) return [newNode];

    this.currentVolume = v;

    return [
      {
        type: MmlType.VOLUME,
        value: {
          volume: v,
        },
        location: newNode.location,
      },
      newNode,
    ];
  }

  // override
  protected onDirectNote(node: MmlNode.DirectNoteNode): MmlNode.MmlNode[] {
    const v = this.volume + this.getVolumeOffset(node.value.accent);
    const value = { ...node.value };

    delete value.accent;

    const newNode: MmlNode.DirectNoteNode = {
      location: node.location,
      type: node.type,
      value,
    };

    if (this.currentVolume === v) return [newNode];

    this.currentVolume = v;

    return [
      {
        type: MmlType.VOLUME,
        value: {
          volume: v,
        },
        location: node.location,
      },
      newNode,
    ];
  }

  // override
  protected onVolume(node: MmlNode.VolumeNode): MmlNode.MmlNode[] {
    this.volume = node.value.volume;

    if (this.volume === this.currentVolume) return [];

    this.currentVolume = this.volume;

    return [node];
  }

  // override
  protected onRelVolume(node: MmlNode.RelVolumeNode): MmlNode.MmlNode[] {
    this.volume += node.value.offset;

    if (this.volume === this.currentVolume) return [];

    this.currentVolume = this.volume;

    return [
      {
        type: MmlType.VOLUME,
        value: {
          volume: this.volume,
        },
        location: node.location,
      },
    ];
  }

  // override
  protected onPartVolume(node: MmlNode.PartVolumeNode): MmlNode.MmlNode[] {
    const map: VolumeMap = new VolumeMap();
    const { volume } = node.value;

    node.value.parts.forEach((part) => {
      const key: RhythmPartKey = 'name' in part ? part.name : part.direct;
      const current = this.currentPartVolumes.get(key);

      if (current === undefined || volume !== current) {
        this.currentPartVolumes.set(key, volume);
        map.add(volume, key);
      }
    });

    return map.getNodes(node.location);
  }

  // override
  protected onPartRelVolume(
    node: MmlNode.PartRelVolumeNode,
  ): MmlNode.MmlNode[] {
    const map: VolumeMap = new VolumeMap();
    const { offset } = node.value;

    node.value.parts.forEach((part) => {
      const key: RhythmPartKey = 'name' in part ? part.name : part.direct;
      const volume = this.partVolumes.get(key);
      const current = this.currentPartVolumes.get(key);

      if (volume === undefined) {
        this.partVolumes.set(key, this.volume + offset);
        this.currentPartVolumes.set(key, this.volume + offset);
        map.add(this.volume + +offset, key);
      } else if (volume + offset !== current) {
        this.currentPartVolumes.set(key, volume + offset);
        map.add(volume + offset, key);
      }
    });

    return map.getNodes(node.location);
  }

  // override
  protected onPart(node: MmlNode.PartNode): MmlNode.MmlNode[] {
    const map: VolumeMap = new VolumeMap();

    node.value.parts.forEach((part) => {
      const key: RhythmPartKey = 'name' in part ? part.name : part.direct;
      const offset = this.getVolumeOffset(part.accent);
      const volume = this.partVolumes.get(key);
      const current = this.currentPartVolumes.get(key);

      if (volume === undefined) {
        // 音量がない場合
        this.partVolumes.set(key, this.volume);
        this.currentPartVolumes.set(key, this.volume + offset);
        map.add(this.volume + offset, key);
      } else if (current === undefined) {
        // 現在音量がない場合は入れる（このケースにはならないはずだが念の為）
        this.currentPartVolumes.set(key, volume + offset);

        if (offset !== 0) {
          map.add(volume + offset, key);
        }
      } else if (current !== volume + offset) {
        // 現在音量を更新する
        this.currentPartVolumes.set(key, volume + offset);
        map.add(volume + offset, key);
      }
    });

    return [...map.getNodes(node.location), node];
  }

  /**
   * アクセントの補正値を返す
   *
   * @param accent アクセントの値
   */
  private getVolumeOffset(accent?: Accent): number {
    switch (accent) {
      case ACCENT_STRONG:
        return this.volumeStrong;

      case ACCENT_WEAK:
        return this.volumeWeak;

      default:
        return 0;
    }
  }
}
