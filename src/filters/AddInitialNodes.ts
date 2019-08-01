import { commands } from '../constants/commands';
import { controls } from '../constants/controls';
import { defaults } from '../constants/defaults';
import { Filter } from '../types/Filter';
import { createDummyLocation } from '../types/Location';
import { MmlNode } from '../types/MmlNode';
import * as MmlType from '../types/MmlType';

/**
 * デフォルト値の追加
 */
export class AddInitialNodes extends Filter {
  // override
  protected onPrepare(): MmlNode[] {
    if (this.track.isEmpty() || this.track.getNodes().length === 0) return [];

    if (this.isSong()) return this.getInitialNodesForSong();

    if (this.isRhythm()) return this.getInitialNodesForRhythm();

    return [];
  }

  /**
   * ソングトラックの初期ノード
   */
  // eslint-disable-next-line class-methods-use-this
  private getInitialNodesForSong(): MmlNode[] {
    const location = createDummyLocation();

    return [
      {
        location,
        type: MmlType.CONTROL,
        value: { name: controls.tempo, args: [defaults.tempo] },
      },
      {
        location,
        type: MmlType.CONTROL,
        value: { name: controls.octaveMode, args: [defaults.octaveMode] },
      },
      {
        location,
        type: MmlType.QUICK_VOICE,
        value: { no: defaults.voice },
      },
      {
        location,
        type: MmlType.LENGTH,
        value: { duration: defaults.duration, frames: 0 },
      },
      {
        location,
        type: MmlType.OCTAVE,
        value: { octave: defaults.octave },
      },
      {
        location,
        type: MmlType.QUANTIZE,
        value: { rate: defaults.quantize },
      },
      {
        location,
        type: MmlType.VOLUME,
        value: { volume: defaults.volume },
      },
      {
        location,
        type: MmlType.COMMAND,
        value: {
          name: commands.accent,
          args: [defaults.volumeStrong, defaults.volumeWeak],
        },
      },
    ];
  }

  /**
   * リズムトラックの初期ノード
   */
  // eslint-disable-next-line class-methods-use-this
  private getInitialNodesForRhythm(): MmlNode[] {
    const location = createDummyLocation();

    return [
      {
        location,
        type: MmlType.CONTROL,
        value: { name: controls.tempo, args: [defaults.tempo] },
      },
      {
        location,
        type: MmlType.LENGTH,
        value: { duration: defaults.duration, frames: 0 },
      },
      {
        location,
        type: MmlType.VOLUME,
        value: { volume: defaults.volume },
      },
      {
        location,
        type: MmlType.COMMAND,
        value: {
          name: commands.accent,
          args: [defaults.volumeStrong, defaults.volumeWeak],
        },
      },
    ];
  }
}
