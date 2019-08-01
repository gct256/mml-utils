import * as MmlNode from './MmlNode';
import * as MmlType from './MmlType';

/**
 * ノード処理用のビジタークラス
 */
export class MmlNodeVisitor<T> {
  /**
   * ノードを処理する
   *
   * @param node ノード
   */
  public visit(node: MmlNode.MmlNode): T {
    this.onBeforeNode(node);

    const result = this.visitNode(node);

    this.onAfterNode(node);

    return result;
  }

  /**
   * ノード処理の実処理
   *
   * @param node ノード
   */
  private visitNode(node: MmlNode.MmlNode): T {
    switch (node.type) {
      case MmlType.COMMENT:
        return this.onComment(node);

      case MmlType.CONTROL:
        return this.onControl(node);

      case MmlType.DEFINE:
        return this.onDefine(node);

      case MmlType.TARGET_SONG:
        return this.onTargetSong(node);

      case MmlType.TARGET_RHYTHM:
        return this.onTargetRhythm(node);

      case MmlType.TARGET_MACRO_BY_NO:
        return this.onTargetMacroByNo(node);

      case MmlType.TARGET_MACRO_BY_NAME:
        return this.onTargetMacroByName(node);

      case MmlType.SLUR:
        return this.onSlur(node);

      case MmlType.EXPAND_MACRO:
        return this.onExpandMacro(node);

      case MmlType.EXPAND_NAMED_MACRO:
        return this.onExpandNamedMacro(node);

      case MmlType.QUICK_OCTAVE_LT:
        return this.onQuickOctaveLt(node);

      case MmlType.QUICK_OCTAVE_GT:
        return this.onQuickOctaveGt(node);

      case MmlType.QUICK_VOICE:
        return this.onQuickVoice(node);

      case MmlType.QUICK_NAMED_VOICE:
        return this.onQuickNamedVoice(node);

      case MmlType.COMMAND:
        return this.onCommand(node);

      case MmlType.NOTE:
        return this.onNote(node);

      case MmlType.LENGTH:
        return this.onLength(node);

      case MmlType.DIRECT_NOTE:
        return this.onDirectNote(node);

      case MmlType.OCTAVE:
        return this.onOctave(node);

      case MmlType.REL_OCTAVE:
        return this.onRelOctave(node);

      case MmlType.QUANTIZE:
        return this.onQuantize(node);

      case MmlType.REST:
        return this.onRest(node);

      case MmlType.TEMPO:
        return this.onTempo(node);

      case MmlType.VOLUME:
        return this.onVolume(node);

      case MmlType.REL_VOLUME:
        return this.onRelVolume(node);

      case MmlType.PART_VOLUME:
        return this.onPartVolume(node);

      case MmlType.PART_REL_VOLUME:
        return this.onPartRelVolume(node);

      case MmlType.LOOP_BEGIN:
        return this.onLoopBegin(node);

      case MmlType.LOOP_END:
        return this.onLoopEnd(node);

      case MmlType.LOOP_BREAK:
        return this.onLoopBreak(node);

      case MmlType.QUICK_REST:
        return this.onQuickRest(node);

      case MmlType.PART:
        return this.onPart(node);

      case MmlType.RANGE_STRONG:
        return this.onRangeStrong(node);

      case MmlType.RANGE_SLUR:
        return this.onRangeSlur(node);

      case MmlType.RANGE_WEAK:
        return this.onRangeWeak(node);

      case MmlType.RANGE_END:
        return this.onRangeEnd(node);

      case MmlType.WS:
        return this.onWs(node);

      case MmlType.EOL:
        return this.onEol(node);

      default:
        // ここには来ないはず
        throw new Error('不明なノードです');
    }
  }

  /**
   * デフォルトの値を返す
   *
   * @param _node ノード
   */
  // eslint-disable-next-line class-methods-use-this
  protected getDefaultReturnValue(_node: MmlNode.MmlNode): T {
    throw new Error('このメソッドを実装する必要があります');
  }

  /** ノード処理前のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onBeforeNode(_node: MmlNode.MmlNode): void {}

  /** ノード処理後のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onAfterNode(_node: MmlNode.MmlNode): void {}

  /** コメントノードのコールバック */
  protected onComment(node: MmlNode.CommentNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 制御ノードのコールバック */
  protected onControl(node: MmlNode.ControlNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 定義ノードのコールバック */
  protected onDefine(node: MmlNode.DefineNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 対象指定（ソングトラック）ノードのコールバック */
  protected onTargetSong(node: MmlNode.TargetSongNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 対象指定（リズムトラック）ノードのコールバック */
  protected onTargetRhythm(node: MmlNode.TargetRhythmNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 対象指定（番号マクロ）ノードのコールバック */
  protected onTargetMacroByNo(node: MmlNode.TargetMacroByNoNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 対象指定（名前マクロ）ノードのコールバック */
  protected onTargetMacroByName(node: MmlNode.TargetMacroByNameNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** スラー・タイノードのコールバック */
  protected onSlur(node: MmlNode.SlurNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** マクロ展開ノードのコールバック */
  protected onExpandMacro(node: MmlNode.ExpandMacroNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 名前付きマクロ展開ノードのコールバック */
  protected onExpandNamedMacro(node: MmlNode.ExpandNamedMacroNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 簡易相対オクターブノードのコールバック */
  protected onQuickOctaveLt(node: MmlNode.QuickOctaveLtNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 簡易相対オクターブノードのコールバック */
  protected onQuickOctaveGt(node: MmlNode.QuickOctaveGtNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 簡易音色指定ノードのコールバック */
  protected onQuickVoice(node: MmlNode.QuickVoiceNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 簡易音色指定（名前）ノードのコールバック */
  protected onQuickNamedVoice(node: MmlNode.QuickNamedVoiceNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 任意のコマンドノードのコールバック */
  protected onCommand(node: MmlNode.CommandNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 発音（音階の名前指定）ノードのコールバック */
  protected onNote(node: MmlNode.NoteNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 省略時長さノードのコールバック */
  protected onLength(node: MmlNode.LengthNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 発音（音階の直接指定）ノードのコールバック */
  protected onDirectNote(node: MmlNode.DirectNoteNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** オクターブノードのコールバック */
  protected onOctave(node: MmlNode.OctaveNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 相対オクターブノードのコールバック */
  protected onRelOctave(node: MmlNode.RelOctaveNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 音長比ノードのコールバック */
  protected onQuantize(node: MmlNode.QuantizeNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 休符ノードのコールバック */
  protected onRest(node: MmlNode.RestNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** テンポノードのコールバック */
  protected onTempo(node: MmlNode.TempoNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 音量ノードのコールバック */
  protected onVolume(node: MmlNode.VolumeNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 相対音量ノードのコールバック */
  protected onRelVolume(node: MmlNode.RelVolumeNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 楽器の音量ノードのコールバック */
  protected onPartVolume(node: MmlNode.PartVolumeNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 楽器の相対音量ノードのコールバック */
  protected onPartRelVolume(node: MmlNode.PartRelVolumeNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** ループ始端ノードのコールバック */
  protected onLoopBegin(node: MmlNode.LoopBeginNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** ループ終端ノードのコールバック */
  protected onLoopEnd(node: MmlNode.LoopEndNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** ループ中断ノードのコールバック */
  protected onLoopBreak(node: MmlNode.LoopBreakNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 簡易休符ノードのコールバック */
  protected onQuickRest(node: MmlNode.QuickRestNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 発音（リズム楽器）ノードのコールバック */
  protected onPart(node: MmlNode.PartNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 範囲アクセント（強め）ノードのコールバック */
  protected onRangeStrong(node: MmlNode.RangeStrongNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 範囲スラー・タイノードのコールバック */
  protected onRangeSlur(node: MmlNode.RangeSlurNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 範囲アクセント（弱め）ノードのコールバック */
  protected onRangeWeak(node: MmlNode.RangeWeakNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 範囲終端ノードのコールバック */
  protected onRangeEnd(node: MmlNode.RangeEndNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 空白ノードのコールバック */
  protected onWs(node: MmlNode.WsNode): T {
    return this.getDefaultReturnValue(node);
  }

  /** 行末ノードのコールバック */
  protected onEol(node: MmlNode.EolNode): T {
    return this.getDefaultReturnValue(node);
  }
}
