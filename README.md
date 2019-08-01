# mml-utils

## 構成

### parse(mmlString)

- MML 文字列を DataSet（トラックごとの MML ノード配列やマクロ・定義のデータ群）に整理
- 不正な MML の場合は SyntaxError が発生する
  - formatSyntaxError を使うと可視化できる

### translate(dataSet, translator)

- DataSet を任意のデータに変換する

### translators

- 定義済みのトランスレータ

| 名前                          | 機能                                  |
| ----------------------------- | ------------------------------------- |
| translators.redirect()        | そのまま返す                          |
| translators.jsObject(options) | JavaScript オブジェクトとして返す     |
| translators.fmBios(options)   | MSX-MUSIC の FM-BIOS 向けデータに変換 |

### filter(dataSet, ...filters)

- データセットをデータセットに変換する

### filters

- 定義済みのフィルタ

| 名前                                       | 機能                                                 |
| ------------------------------------------ | ---------------------------------------------------- |
| filters.addInitialNodes()                  | 全トラックのノード群先頭に初期状態のノードを追加する |
| filters.expandLoop(maxDepth: number = 10)  | ループを展開する                                     |
| filters.expandMacro(maxDepth: number = 10) | マクロを展開する                                     |
| filters.resolveLength(fps: number = 60)    | 音階や休符の長さをフレーム数に換算する               |
| filters.resolveNote()                      | 音階名での音階指定を直接指定に変換する               |
| filters.resolveRange()                     | 範囲処理を解決する                                   |
| filters.resolveVolume()                    | アクセントを考慮して相対音量を絶対音量にする         |
| filters.validate()                         | 正当性をチェックする                                 |

### MmlNode / MmlType

- MML ノードの型と種別定数

## MML の定義
