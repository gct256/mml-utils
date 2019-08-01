/**
 * 該当キーがない場合に値を作成できる Map 派生クラス
 */
export class ExMap<T, S> extends Map<T, S> {
  private creator: (key: T, map: ExMap<T, S>) => S;

  /**
   * コンストラクタ
   *
   * @param creator 新規項目作成コールバック
   */
  public constructor(creator: (key: T, map: ExMap<T, S>) => S) {
    super();
    this.creator = creator;
  }

  /**
   * キーに対応する値を作成する・既存のものは抹消
   *
   * @param key キー
   */
  public overwrite(key: T): S {
    const newValue: S = this.creator(key, this);

    this.set(key, newValue);

    return newValue;
  }

  /**
   * キーに対応する値を取得するか作成して返す
   *
   * @param key キー
   */
  public getOrCreate(key: T): S {
    const value = this.get(key);

    if (value !== undefined) return value;

    return this.overwrite(key);
  }
}
