import { filter } from '../filter/filter';

import { DataSet } from './DataSet';
import { Filter } from './Filter';
import { MacroSet } from './MacroSet';
import { MmlNode } from './MmlNode';
import { MmlNodeVisitor } from './MmlNodeVisitor';
import { RhythmTrack, SongTrack, Track } from './Track';

/**
 * 変換クラス
 */
export class Translator<T> extends MmlNodeVisitor<void> {
  /** 現在のトラック */
  protected track: Track = Track.EMPTY;

  /** マクロセット */
  protected macroSet: MacroSet = MacroSet.EMPTY;

  /**
   * 変換
   *
   * @param dataSet データセット
   */
  public translate(dataSet: DataSet): T {
    const filtered = filter(dataSet, ...this.getFilters());

    this.macroSet = filtered.macroSet;

    this.getTargetSongs(filtered).forEach((song) => {
      this.track = song;
      this.onBeforeSong(song);

      song.getNodes().forEach((node) => this.visit(node));

      this.onAfterSong(song);
    });

    this.getTargetRhythms(filtered).forEach((rhythm) => {
      this.track = rhythm;
      this.onBeforeRhythm(rhythm);

      rhythm.getNodes().forEach((node) => this.visit(node));

      this.onAfterRhythm(rhythm);
    });

    filtered.defineNodes.forEach((node) => this.onDefine(node));

    return this.getResult();
  }

  /**
   * 現在のトラックがソングトラックかどうか
   */
  protected isSong(): boolean {
    return this.track instanceof SongTrack;
  }

  /**
   * 現在のトラックがリズムトラックかどうか
   */
  protected isRhythm(): boolean {
    return this.track instanceof RhythmTrack;
  }

  /**
   * 使用するフィルタを返す
   */
  // eslint-disable-next-line class-methods-use-this
  protected getFilters(): Filter[] {
    throw new Error('このメソッドを実装する必要があります');
  }

  /**
   * 変換結果を返す
   */
  // eslint-disable-next-line class-methods-use-this
  protected getResult(): T {
    throw new Error('このメソッドを実装する必要があります');
  }

  /**
   * データセットから変換対処のソングトラックを抽出する
   *
   * @param dataSet データセット
   */
  // eslint-disable-next-line class-methods-use-this
  protected getTargetSongs(dataSet: DataSet): SongTrack[] {
    return dataSet.trackSet.getAllSongTracks();
  }

  /**
   * データセットから変換対処のリズムトラックを抽出する
   *
   * @param dataSet データセット
   */
  // eslint-disable-next-line class-methods-use-this
  protected getTargetRhythms(dataSet: DataSet): RhythmTrack[] {
    return dataSet.trackSet.getAllRhythmTracks();
  }

  /** ソングトラック変換前のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onBeforeSong(_song: SongTrack): void {}

  /** ソングトラック変換後のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onAfterSong(_song: SongTrack): void {}

  /** リズムトラック変換前のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onBeforeRhythm(_rhythm: RhythmTrack): void {}

  /** リズムトラック変換後のコールバック */
  // eslint-disable-next-line class-methods-use-this
  protected onAfterRhythm(_rhythm: RhythmTrack): void {}

  // override
  // eslint-disable-next-line class-methods-use-this
  protected getDefaultReturnValue(_node: MmlNode): void {}
}
