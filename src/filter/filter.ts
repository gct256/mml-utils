import { DataSet } from '../types/DataSet';
import { Filter, FilterSet } from '../types/Filter';
import { MacroSet } from '../types/MacroSet';
import { MmlNode } from '../types/MmlNode';
import { RhythmTrack, SongTrack, Track } from '../types/Track';
import { TrackSet } from '../types/TrackSet';

/**
 * トラックのフィルタ処理
 *
 * @param track トラック
 * @param filterSet フィルタセット
 * @param macroSet マクロセット
 */
const compileTrack = (
  track: Track,
  filterSet: FilterSet,
  macroSet: MacroSet,
): MmlNode[] => {
  let nodes: MmlNode[] = [];

  filterSet.forEach((x) => {
    // フィルタのprepareで初期ノードを取得
    nodes.push(...x.prepare(track, macroSet));
  });

  // トラックのノードを追加
  nodes.push(...track.getNodes());

  // 各フィルタでノードを処理
  filterSet.forEach((x) => {
    const nextNodes = x.filter(nodes, []);

    nodes = nextNodes;
  });

  filterSet.forEach((x) => x.finish());

  return nodes;
};

/**
 * 全トラックのフィルタ処理
 *
 * @param tracks トラックの配列
 * @param filterSet フィルタセット
 * @param macroSet マクロセット
 * @param callback 最終結果作成用コールバック
 */
const compileAllTracks = <T extends Track>(
  tracks: T[],
  filterSet: FilterSet,
  macroSet: MacroSet,
  callback: (no: number, nodes: MmlNode[]) => T,
): Map<number, T> => {
  const map = new Map<number, T>();

  tracks.forEach((track) => {
    map.set(
      track.no,
      callback(track.no, compileTrack(track, filterSet, macroSet)),
    );
  });

  return map;
};

/**
 * データセットからデータを生成する
 *
 * @param dataSet データセット
 * @param filters フィルタ群
 * @param translator トランスレータ
 */
export const filter = (dataSet: DataSet, ...filters: Filter[]): DataSet => {
  const filterSet = Filter.createFilterSet(filters);

  const songMap = compileAllTracks(
    dataSet.trackSet.getAllSongTracks(),
    filterSet,
    dataSet.macroSet,
    (no: number, nodes: MmlNode[]) => new SongTrack(no, nodes),
  );
  const rhythmMap = compileAllTracks(
    dataSet.trackSet.getAllRhythmTracks(),
    filterSet,
    dataSet.macroSet,
    (no: number, nodes: MmlNode[]) => new RhythmTrack(no, nodes),
  );

  return {
    trackSet: new TrackSet(songMap, rhythmMap),
    macroSet: dataSet.macroSet,
    defineNodes: dataSet.defineNodes,
  };
};
