import { ACCENT_STRONG, ACCENT_WEAK } from '../types/Accent';
import { Filter } from '../types/Filter';
import * as MmlNode from '../types/MmlNode';
import * as MmlType from '../types/MmlType';
import { RhythmPart } from '../types/RhyhtmPart';

/** 範囲の種別 */
type RangeType =
  | typeof MmlType.RANGE_STRONG
  | typeof MmlType.RANGE_SLUR
  | typeof MmlType.RANGE_WEAK
  | typeof MmlType.RANGE_END;

/**
 * 範囲の解決フィルタ
 */
export class ResolveRange extends Filter {
  /** 現在の範囲種別 */
  private rangeType: RangeType = MmlType.RANGE_END;

  /** 範囲スラーかどうか */
  private rangeSlur: boolean = false;

  // override
  protected onPrepare(): MmlNode.MmlNode[] {
    this.rangeType = MmlType.RANGE_END;
    this.rangeSlur = false;

    return [];
  }

  // override
  protected onSlur(node: MmlNode.SlurNode): MmlNode.MmlNode[] {
    // 範囲スラー内であれば重複する可能性があるので何もしない
    if (this.rangeType === MmlType.RANGE_SLUR) return [];

    return [node];
  }

  // override
  protected onNote(node: MmlNode.NoteNode): MmlNode.MmlNode[] {
    const { location } = node;

    switch (this.rangeType) {
      case MmlType.RANGE_STRONG:
        return [
          {
            location,
            type: MmlType.NOTE,
            value: { ...node.value, ...{ accent: ACCENT_STRONG } },
          },
        ];

      case MmlType.RANGE_WEAK:
        return [
          {
            location,
            type: MmlType.NOTE,
            value: { ...node.value, ...{ accent: ACCENT_WEAK } },
          },
        ];

      case MmlType.RANGE_SLUR:
        this.rangeSlur = true;

        return [node, { location, type: MmlType.SLUR, value: {} }];

      default:
        return [node];
    }
  }

  // override
  protected onDirectNote(node: MmlNode.DirectNoteNode): MmlNode.MmlNode[] {
    const { location } = node;

    switch (this.rangeType) {
      case MmlType.RANGE_STRONG:
        return [
          {
            location,
            type: MmlType.DIRECT_NOTE,
            value: { ...node.value, ...{ accent: ACCENT_STRONG } },
          },
        ];

      case MmlType.RANGE_WEAK:
        return [
          {
            location,
            type: MmlType.DIRECT_NOTE,
            value: { ...node.value, ...{ accent: ACCENT_WEAK } },
          },
        ];

      case MmlType.RANGE_SLUR:
        this.rangeSlur = true;

        return [node, { location, type: MmlType.SLUR, value: {} }];

      default:
        return [node];
    }
  }

  // override
  protected onPart(node: MmlNode.PartNode): MmlNode.MmlNode[] {
    const { location } = node;

    switch (this.rangeType) {
      case MmlType.RANGE_STRONG:
        return [
          {
            location,
            type: MmlType.PART,
            value: {
              ...node.value,
              parts: node.value.parts.map((part: RhythmPart) => ({
                ...part,
                accent: ACCENT_STRONG,
              })),
            },
          },
        ];

      case MmlType.RANGE_WEAK:
        return [
          {
            location,
            type: MmlType.PART,
            value: {
              ...node.value,
              parts: node.value.parts.map((part: RhythmPart) => ({
                ...part,
                accent: ACCENT_WEAK,
              })),
            },
          },
        ];

      default:
        return [node];
    }
  }

  // override
  protected onRangeStrong(node: MmlNode.RangeStrongNode): MmlNode.MmlNode[] {
    this.rangeType = node.type;

    return [];
  }

  // override
  protected onRangeSlur(node: MmlNode.RangeSlurNode): MmlNode.MmlNode[] {
    this.rangeType = node.type;
    this.rangeSlur = false;

    return [];
  }

  // override
  protected onRangeWeak(node: MmlNode.RangeWeakNode): MmlNode.MmlNode[] {
    this.rangeType = node.type;

    return [];
  }

  // override
  protected onRangeEnd(node: MmlNode.RangeEndNode): MmlNode.MmlNode[] {
    if (this.rangeType === MmlType.RANGE_SLUR && this.rangeSlur) {
      // 範囲スラーは最後の音階にはスラーをつけないので調整する
      const currentNodes = this.getCurrentNodes();

      let note = NaN;
      let slur = NaN;

      for (let i = currentNodes.length - 1; i >= 0; i -= 1) {
        if (Number.isFinite(note) && Number.isFinite(slur)) break;

        const n = currentNodes[i];

        if (n.type === MmlType.SLUR) {
          slur = i;
        } else if (n.type === MmlType.NOTE || n.type === MmlType.DIRECT_NOTE) {
          note = i;
        }
      }

      if (Number.isFinite(note) && Number.isFinite(slur) && note < slur) {
        currentNodes.splice(slur, 1);
      }
    }

    this.rangeType = node.type;
    this.rangeSlur = false;

    return [];
  }
}
