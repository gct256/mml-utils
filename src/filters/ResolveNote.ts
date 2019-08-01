import { commands } from '../constants/commands';
import { controls } from '../constants/controls';
import { defaults } from '../constants/defaults';
import { Filter } from '../types/Filter';
import * as MmlNode from '../types/MmlNode';
import * as MmlType from '../types/MmlType';

/**
 * 音階の解決フィルタ
 */
export class ResolveNote extends Filter {
  /** 現在の簡易相対オクターブモード */
  private octaveMode: number = defaults.octaveMode;

  /** 現在のオクターブ */
  private octave: number = defaults.octave;

  /** 現在の移調量 */
  private transpose: number = 0;

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.octaveMode = defaults.octaveMode;
    this.octave = defaults.octave;
    this.transpose = 0;

    return [];
  }

  // override
  protected onControl(node: MmlNode.ControlNode): MmlNode.MmlNode[] {
    if (node.value.name === controls.octaveMode) {
      this.octaveMode = node.value.args[0] === 0 ? 0 : 1;

      return [];
    }

    return [node];
  }

  // override
  protected onQuickOctaveLt(
    node: MmlNode.QuickOctaveLtNode,
  ): MmlNode.MmlNode[] {
    this.octave += (this.octaveMode === 0 ? -1 : 1) * node.value.count;

    return [];
  }

  // override
  protected onQuickOctaveGt(
    node: MmlNode.QuickOctaveGtNode,
  ): MmlNode.MmlNode[] {
    this.octave += (this.octaveMode === 0 ? 1 : -1) * node.value.count;

    return [];
  }

  // override
  protected onCommand(node: MmlNode.CommandNode): MmlNode.MmlNode[] {
    if (node.value.name === commands.transpose) {
      // 移調量
      MmlNode.getNodeArg(node, 0, {
        foundNumber: (x: number) => {
          this.transpose = x;
        },
      });
    }

    return [node];
  }

  // override
  protected onNote(node: MmlNode.NoteNode): MmlNode.MmlNode[] {
    const { accent, dots, duration, frames, offset } = node.value;
    const direct =
      this.transpose +
      (this.octave - 1) * 12 +
      node.value.note +
      (offset === undefined ? 0 : offset);
    const value: MmlNode.DirectNoteNode['value'] = {
      direct,
      frames,
    };

    if (accent !== undefined) value.accent = accent;

    if (dots !== undefined) value.dots = dots;

    if (duration !== undefined) value.duration = duration;

    return [
      {
        value,
        type: MmlType.DIRECT_NOTE,
        location: node.location,
      },
    ];
  }

  // override
  protected onDirectNote(node: MmlNode.DirectNoteNode): MmlNode.MmlNode[] {
    return [
      {
        type: node.type,
        value: {
          ...node.value,
          direct: node.value.direct + this.transpose,
        },
        location: node.location,
      },
    ];
  }

  // override
  protected onOctave(node: MmlNode.OctaveNode): MmlNode.MmlNode[] {
    this.octave = node.value.octave;

    return [];
  }

  // override
  protected onRelOctave(node: MmlNode.RelOctaveNode): MmlNode.MmlNode[] {
    this.octave += node.value.offset;

    return [];
  }
}
