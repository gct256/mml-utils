import { DataSet } from '../types/DataSet';
import { Translator } from '../types/Translator';

/**
 * データセットを変換する
 *
 * @param dataSet データセット
 * @param translator トランスレータ
 */
export const translate = <T>(
  dataSet: DataSet,
  translator: Translator<T>,
): T => {
  return translator.translate(dataSet);
};
