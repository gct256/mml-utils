/** ノード種別: コメント */
export const COMMENT: ';' = ';';

/** ノード種別: 制御 */
export const CONTROL: '?' = '?';

/** ノード種別: 定義 */
export const DEFINE: '$' = '$';

/** ノード種別: 対象指定（ソングトラック） */
export const TARGET_SONG: '=' = '=';

/** ノード種別: 対象指定（リズムトラック） */
export const TARGET_RHYTHM: '=R' = '=R';

/** ノード種別: 対象指定（番号マクロ） */
export const TARGET_MACRO_BY_NO: '=*' = '=*';

/** ノード種別: 対象指定（名前マクロ） */
export const TARGET_MACRO_BY_NAME: '=*()' = '=*()';

/** ノード種別: スラー・タイ */
export const SLUR: '&' = '&';

/** ノード種別: マクロ展開 */
export const EXPAND_MACRO: '*' = '*';

/** ノード種別: 名前付きマクロ展開 */
export const EXPAND_NAMED_MACRO: '*()' = '*()';

/** ノード種別: 簡易相対オクターブ */
export const QUICK_OCTAVE_LT: '<' = '<';

/** ノード種別: 簡易相対オクターブ */
export const QUICK_OCTAVE_GT: '>' = '>';

/** ノード種別: 簡易音色指定 */
export const QUICK_VOICE: '@' = '@';

/** ノード種別: 簡易音色指定（名前） */
export const QUICK_NAMED_VOICE: '@()' = '@()';

/** ノード種別: 任意のコマンド */
export const COMMAND: '@COMMAND' = '@COMMAND';

/** ノード種別: 発音（音階の名前指定） */
export const NOTE: 'A-G' = 'A-G';

/** ノード種別: 省略時長さ */
export const LENGTH: 'L' = 'L';

/** ノード種別: 発音（音階の直接指定） */
export const DIRECT_NOTE: 'N' = 'N';

/** ノード種別: オクターブ */
export const OCTAVE: 'O' = 'O';

/** ノード種別: 相対オクターブ */
export const REL_OCTAVE: 'O:' = 'O:';

/** ノード種別: 音長比 */
export const QUANTIZE: 'Q' = 'Q';

/** ノード種別: 休符 */
export const REST: 'R' = 'R';

/** ノード種別: テンポ */
export const TEMPO: 'T' = 'T';

/** ノード種別: 音量 */
export const VOLUME: 'V' = 'V';

/** ノード種別: 相対音量 */
export const REL_VOLUME: 'V:' = 'V:';

/** ノード種別: 楽器の音量 */
export const PART_VOLUME: 'V{}' = 'V{}';

/** ノード種別: 楽器の相対音量 */
export const PART_REL_VOLUME: 'V{}:' = 'V{}:';

/** ノード種別: ループ始端 */
export const LOOP_BEGIN: '[' = '[';

/** ノード種別: ループ終端 */
export const LOOP_END: ']' = ']';

/** ノード種別: ループ中断 */
export const LOOP_BREAK: '/' = '/';

/** ノード種別: 簡易休符 */
export const QUICK_REST: '_' = '_';

/** ノード種別: 発音（リズム楽器） */
export const PART: '{}' = '{}';

/** ノード種別: 範囲アクセント（強め） */
export const RANGE_STRONG: '|!' = '|!';

/** ノード種別: 範囲スラー・タイ */
export const RANGE_SLUR: '|&' = '|&';

/** ノード種別: 範囲アクセント（弱め） */
export const RANGE_WEAK: '|~' = '|~';

/** ノード種別: 範囲終端 */
export const RANGE_END: '|' = '|';

/** ノード種別: 空白 */
export const WS: ' ' = ' ';

/** ノード種別: 行末 */
export const EOL: '\n' = '\n';
