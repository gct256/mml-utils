import { DataSet } from '../types/DataSet';
import { Translator } from '../types/Translator';

/**
 * データセットをそのまま返す
 */
export class Redirect extends Translator<DataSet> {
  // eslint-disable-next-line class-methods-use-this
  public translate(dataSet: DataSet): DataSet {
    return dataSet;
  }
}
