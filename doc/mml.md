# MML 詳細

## 形式

- 行志向の文字列をソースとする
  - 改行コードは `LF` / `CRLF` / `CR` のいずれか
  - 行頭・行末の空白は無視
  - 改行コード以外のコントロールコードは空白と同じとみなす
- 文字列のエンコーディングは **UTF-8**
  - MML を構成する文字については `U+0020` から `U+007E` の範囲
  - アルファベットの大文字小文字は区別されない
  - その他の文字はコメントの内容などに使用することを想定

### 用語

| 呼称     | 用途           | 定義                                              |
| -------- | -------------- | ------------------------------------------------- |
| 空白     | 区切りなど     | `/[\x09\x20]+/`                                   |
| 名前     | コマンド名など | `/[A-Z][0-9A-Z_]*/`                               |
| 値リスト | 値のリスト     | (値,値,値) / 区切りは `/[\x09\x20]*,[\x09\x20]*/` |

- 値リストは閉じカッコまでの間に改行をはさむことができる

## `;` : コメント

- 行中に`;`が出現した場合そこから行末までは**コメント**

```
; ここはコメント
o4 l16 cdef ; ここはコメント
```

## `?` : 制御コマンド

- 行頭が `?` の場合その行は制御コマンド
- 引数として値リストを指定可能

```
?control
?control(42, 43)
```

- 組み込みの制御コマンドはコンパイラで解釈される
- 組み込み以外の制御コマンドの挙動はパーサの範囲外

### `? tempo(...)` : 組み込み制御コマンド・テンポ

- すべてのトラックのテンポを引数に変更する
- さらに各トラックのデフォルトテンポもこの値に設定される

- テンポには 0 より大きい整数または小数を指定できる
- デフォルトは 112.5

```
?tempo(150)
?tempo(112.5)
```

### `? octave_mode(...)` : 組み込み制御コマンド・簡易オクターブの方向

- すべてのトラックで簡易オクターブ指定（`<`と`>`）の挙動を引数に応じて以下のように変更する

| 引数の値 | `>` の挙動            | `<` の挙動            |
| -------- | --------------------- | --------------------- |
| 0        | オクターブを 1 上げる | オクターブを 1 下げる |
| 0 以外   | オクターブを 1 下げる | オクターブを 1 上げる |

- デフォルトは `0` の挙動

```
?octave_mode(0)
?octave_mode(1)
```

### `? start` : 組み込み制御コマンド・解析開始

- すべてのトラックでのここまでの演奏データのうち発音・休符のような長さを持つものを削除する
  - 引数は持たない
  - 出現位置まで早送り・スキップしたような挙動となる

```
?start
```

### `? end` : 組み込み制御コマンド・解析終了

- 出現した場合、それ以降の解析を行わない
  - 引数は持たない

```
?end
```

## `$` : 定義コマンド

- 行頭が `$` の場合その行は定義コマンド
- 引数として値リストを指定可能

- 組み込みの定義コマンドは現時点ではなし
- 組み込み以外の定義コマンドの挙動はパーサの範囲外

```
$foo(1,2,3) ; 何らかの定義コマンド
$bar ; 何らかの定義コマンド
```

## `=` : 格納先指定コマンド

- 行頭が `=` の場合は演奏データの対象となるトラックの指定となる
- `=` は複数並べたりトラック番号などの後ろにも配置可能（区切りとして見やすくするため）
- デフォルトはソングトラック 1

```
cdef ; まだ指定がないのでソングトラック1が対象

= 2
cdef ; ここはソングトラック2が対象

==== r ==== ; このような区切りっぽい書き方が可能
bh bh sh bh ; ここはリズムトラックが対象

==== *20
cdef ; ここはマクロ番号20が対象

=1 cc dd ee dd ; 後ろに演奏データを置くことも可能
=2 ee ff gg ff
```

### `= 数値` : ソングトラック指定

- ソングトラックを対象にする
- 数値はトラック番号（1 以上の整数）
- 同じ番号が複数回出現した場合は追記となる

```
=1
= 2
==== 42 ====
```

### `= r` `= r 数値` : リズムトラック指定

- リズムトラックを対象にする
- 数値はトラック番号（1 以上の整数）
- 同じ番号が複数回出現した場合は追記となる
- リズムトラックは 1 つしかないことが多いため数値は省略可能（1 とみなされる）

```
=r
= r1
==== r42 ====
```

### `= * 数値` / `= * 名前` : マクロ指定

- マクロを対象にする
- 数値はマクロ番号（1 以上の整数）
- 同じ番号・名前が複数回出現した場合は上書きとなる（追記にならない）

```
=*1
= * 2
==== * 42 ====

=*foo
= * bar
==== * baz ====
```

## 演奏データ

### `!` / '~' : アクセント

- ソングトラックの場合は`音階名`の直後に置くことでその発音を強める/弱める
  - 半音記号よりは後ろ
  - 長さ指定よりは前

```
c! c!4 d+!4.. n32! n64!4..; 強める
c~ c~4 d+~4.. n32~ n64~4.. ; 弱める
```

- リズムトラックの場合は`楽器名`の直後に置く

```
b! b!4 n32! n64!4 ; 強める
b~ b~4 n32~ n64~4 ; 弱める
```

### `#` / `+` / `-` : 半音記号

- 音階名の次に指定することでその音階を半音上げる/下げる
  - アクセントよりは前
  - 長さ指定よりは前
- 同じ記号を連続して記述した場合は記号の数 ×0.5 だけ上げる/下げる
- 複数の記号を混在させることはできない
- リズムトラックでは無視

```
c    ; ド
c+   ; ド♯
c-   ; ド♭（1オクターブ下のシ）
c+++ ; ドを1.5音上げる（レ♯）
c--- ; ドを1.5音下げる（1オクターブ下のラ）
c+#+ ; + と # は混在できない（#のところで構文エラーになる）
```

### `% 数値` : 長さのフレーム数指定

- 音階名・楽器名・休符の次に指定することでその発音・休符の長さをフレーム数で指定する
  - 半音記号よりは後ろ
- 付点は使用できない

```
c%12 ; 12フレーム
```

### `&` : タイ・スラー

- 前の発音と次の発音をつなぐ
  - 双方の音程が同じ場合はタイ
  - 異なる場合はスラー
- リズムトラックでは無視

```
c4 & c2 ; タイ
c4 & g2 ; スラー
```

### `* 数値` / `* (名前)` : マクロ展開

- マクロの内容を展開する
- 数値はマクロ番号（1 以上の整数）
- 名前はマクロ名

```
*1
*(foo)
```

### `.` : 付点

- 音符の長さの次に置くことで付点（長さ 1.5 倍）を表す
  - 長さを省略して音階・休符の次に置くことも可能
- 付点が連続した場合は複付点・複々付点…となる

```
c4. ; 付点四分音符（4+8）
c4... ; 複々付点４分音符の長さ（4+8+16+32）
```

### `<` / `>` : 簡易オクターブ指定

- オクターブを +1 または -1 する
  - どちらの記号がどちらの挙動かは `? octave_mode` による
- リズムトラックでは無視

```
cdefgab > c < bagfedc
```

### `@ 数値` / `@(名前)` : 簡易音色指定

- 音色の指定
- 数値は音色番号（整数）
- 名前は音色名
  - 次の文字が名前の構成要素になる場合は空白で区切る
- デフォルトは 0

```
@12
@(foo)
```

### `@ 名前(値リスト)` : 任意コマンド

- 組み込みの任意コマンドはコンパイラで解釈される
- 組み込み以外の任意コマンドの挙動はパーサの範囲外

#### `@accent(数値1,数値2)` : 組み込み任意コマンド・アクセント差分指定

- アクセントの強め量・弱め量の指定
- 数値 1 は強めの差分（整数）
- 数値 2 弱めの差分（整数）
  - 省略した場合は数値 1 の符号反転値

```
@accent(2,-2)
@accent(3)    ; @accent(3,-3)と同じ
```

#### `@transpose(数値)` : 組み込み任意コマンド・定義済みコマンド・移調

- 移調量の指定
- 数値は半音分を 1 とする移調量（整数）

```
@transpose(4)
@transpose(-4)
```

### `A` / `B` / `C` / `D` / `E` / `F` / `G` : 音階名（発音）

- ソングトラックでの音階の指定
- 記述順は以下の通り
  - 音階名
  - 必要であれば半音記号
  - 必要であればアクセント
  - 長さ（省略可能）
- リズムトラックでは無視

```
c c+ c+! c+!4 c+!%42
```

### `L` : 省略時長さの指定

- 音階名・楽器名・休符で長さを省略した場合の長さを指定
  - 付点を含めることも可能
    - 長さ省略＋付点の場合、付点の数は合算
  - フレーム数指定も可能
    - フレーム数指定時は付点は使用できない
- デフォルトは 4

```
l4
c    ; c4 と同じ
c..  ; c4.. と同じ

l4..
c    ; c4..   と同じ
c..  ; c4.... と同じ

l%42
c    ; c%42 と同じ
c..  ; エラー
```

### `N 数値` : 音階名・楽器名の数値指定

- 音階や楽器を数値で指定

  - 音階名・楽器名 の代わりに使用可能
  - 楽器名は `{` と `}` の間に入れる
  - 音階名の場合に長さを指定したい場合は空白を挟む

- 音階の場合の数値の対応は `(オクターブ - 1) * ベース数値`

| 音階   | ベース数値 |
| ------ | ---------- |
| c      | 0          |
| c+, d- | 1          |
| d      | 2          |
| d+, e- | 3          |
| e      | 4          |
| f      | 5          |
| f+, g- | 6          |
| g      | 7          |
| g+, a- | 8          |
| a      | 9          |
| a+,b-  | 10         |
| b      | 11         |

- 楽器の場合は単にその数値を楽器番号とする

```
=== 1
l4
n36     ; o3c4
n36!    ; o3c!4
n36 8   ; o3c8
n36!8   ; o3c!8
n36%42  ; o3c%42
n36!%42 ; o3c!%42

=== r
l4
{n16 n32}     ; 16番と32番
{n16 n32}..   ; 16番と32番
{n16 n32}4    ; 16番と32番
{n16 n32}4..  ; 16番と32番
{n16 n32}%42  ; 16番と32番
```

### `O 数値` : オクターブ指定

- オクターブを指定
- 数値はオクターブ（整数）
- リズムトラックでは無視
- デフォルトは 4

```
o4
o8
```

### `O : 数値` : オクターブ相対指定

- オクターブを相対的に指定
- 数値は変更量（整数）
- リズムトラックでは無視

```
o:-1
o:+4
```

### `Q 数値` : 音長比

- 数値は 0 から 100 の整数で％比となる
- デフォルトは 100

```
q25
q100
```

### `R` : 休符

- 休符
- 後ろに長さを指定可能（省略時はデフォルト長さ）
  - 付点や

```
r
r4
r...
r%42
```

### `T 数値` : テンポ指定

- テンポは小数も可
- デフォルトは `?tempo` で指定された値

```
t120
t112.5
```

### `V 数値` : 音量指定

- リズムトラックではすべての楽器の音量変更
- デフォルトは 12

```
v15
v12
```

### `V : 相対数値` : 相対音量指定

- リズムトラックでは個々の楽器についての相対的な音量変更

```
v:-2
v:+2
```

### `V { 楽器名 } 数値` : 楽器音量指定

- リズムトラックでの任意の楽器の音量変更
- デフォルトは 12

```
v{b}15
v{n42}13
```

### `V { 楽器名 } : 相対数値` : 楽器相対音量指定

- リズムトラックでの任意の楽器の相対音量変更

```
v{b}:+2
v{n42}:-2
```

### `[` / `]` : ループ

- `[` から `]` の間を繰り返す
- 繰り返しの回数は `[` の直後か `]` の直後に置く
  - 両方には指定不可
- 繰り返しの回数の指定がない場合は 2 回
- 0 回を指定すると無限ループ
- ループは入れ子にすることができる

```
[cdef]
[4 cdef]
[0 cdef]
[cdef]4
[cdef]0
[cd[ef[ga]]]
```

### `/` : ループ脱出

- ループ内であれば直近のループを脱出する
  - 脱出はループの最後の回（４回繰り返しであれば４回目）に行われる
- ループ内でなければ無視

```
[4 cdef / gab>c<]
```

### `_` : 簡易休符

- 省略時長さの休符
- 長さを省略した r と同じだが視認性がよい

```
l8 c__c__c_ ; c8 r4 c8 r4 c8 r8 と同じ
```

### `{ ... }` : 楽器名による発音

- リズムトラックでの楽器の指定
- `{` と `}` の間に各楽器名を複数連ねることで同時発音を表すことができる
- `}` の後ろに長さを指定可能
  - 省略時は省略時の長さとなる
  - 付点のみ・フレーム数指定も可能
- 楽器名は `N` 以外のアルファベットか `N` と数値による直接指定を使用可能
  - 楽器名の後ろにアクセント `!` `~` を指定可能

```
{b!ch}8       ; b! と c と h を発音して８部音符分待つ
{bn32~n64~}.. ; b と n32~ と n64~ を発音してデフォルト長さ＋付点２つ分待つ
{a}%24        ; a を発音して24フレーム分待つ
```

### `|` : 範囲指定

- `|` と `|` で囲うことで一部の効果を範囲内すべてに適用する
  - 最初の `|` の後ろに効果に対応する記号を置く
- 以下に対応
  - `&`: タイ・スラー / ソングトラックのみ
  - `!`: アクセント（強め）
  - `~`: アクセント（弱め）

```
|& cdef| ; 範囲タイ・スラー これと同じ→ c & d & e & f
|! cdef| ; 範囲にアクセント（強め） これと同じ→ c! d! e! f!
|~ cdef| ; 範囲にアクセント（弱め） これと同じ→ c~ d~ e~ f~
```
