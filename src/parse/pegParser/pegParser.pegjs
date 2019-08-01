{
  // アクセント
  const accentAliasMap = {
    '!': 1,
    '~': -1,
  };

  // 音階名
  const noteAliasMap = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11,
  };

  // 配列をフラット化して null/undefined を取り除く
  function normalize(...args) {
    return args.reduce((prev, x) => {
      if (Array.isArray(x)) return [...prev, ...normalize(...x)];
      if (x === null || x === undefined) return prev;
      return [...prev, x];
    }, []);
  }

  // マップによる数値化
  function getByMap(value, map, def) {
    const v = map[typeof value === 'string' ? value.toLowerCase() : value];

    return v === undefined ? def : v;
  }
}

// 全体
start = x: line* y: last_line? {
  return normalize(x, y);
}

// 行
line = x: ws* y: program? z: comment? zz: eol {
  return normalize(x, y, z, zz);
}

// 最終行（ファイル末尾が改行じゃないケース向け）
last_line = x: ws* y: program? z: comment? zz: eof {
  return normalize(x, y, z, zz);
}

// プログラム部分
program
  = control / definition / target / track

// ---- コメント
comment = ws? ';' x: (!eol .)* {
  return {
    type: ';',
    value: {
      comment: ';' + normalize(x).join(''),
    },
    location: location(),
  };
}

// ---- control

control = control_with_args / control_without_args

control_with_args = '?' ws* x: name ws* paren_begin ws_eol* y: value_list ws_eol* paren_end {
  return {
    type: '?',
    value: {
      ...x,
      args: normalize(y),
    },
    location: location(),
  }
}

control_without_args = '?' ws* x: name (ws* paren_begin paren_end)? {
  return {
    type: '?',
    value: {
      ...x,
    },
    location: location(),
  };
}

// ---- definition

definition = definition_with_args / definition_without_args

definition_with_args = '$' ws* x: name ws* paren_begin ws_eol* y: value_list ws_eol* paren_end {
  return {
    type: '$',
    value: {
      ...x,
      args: normalize(y),
    },
    location: location(),
  };
}

definition_without_args = '$' ws* x: name (ws* paren_begin ws* paren_end)? {
  return {
    type: '$',
    value: {
      ...x,
    },
    location: location(),
  };
}

// ---- target

target = (target_header ws track) / target_header

target_header = '='+ ws* x: traget_track (ws* '='+)? {
  return x;
}

traget_track = target_song / target_rhythm / target_macro_by_no / target_macro_by_name

target_song = x: num {
  return {
    type: '=',
    value: {
      channel: x,
    },
    location: location(),
  };
}

target_rhythm = [Rr] x: num? {
  return {
    type: '=R',
    value: {
      channel: x === null || x === undefined ? 1 : x,
    },
    location: location(),
  };
}

target_macro_by_no = '*' x: num {
  return {
    type: '=*',
    value: {
      no: x,
    },
    location: location(),
  };
}

target_macro_by_name = '*' x: name_with_paren {
  return {
    type: '=*()',
    value: {
      ...x,
    },
    location: location(),
  };
}

// ---- track
track = mml*

// ---- mml
mml
  = mml_slur
  / mml_expand_macro
  / mml_expand_named_macro
  / mml_quick_octave
  / mml_quick_voice
  / mml_quick_named_voice
  / mml_user_command
  / mml_note
  / mml_length
  / mml_direct
  / mml_octave
  / mml_rel_octave
  / mml_quantize
  / mml_rest
  / mml_tempo
  / mml_volume
  / mml_rel_volume
  / mml_part_volume
  / mml_part_rel_volume
  / mml_loop_begin
  / mml_loop_end
  / mml_loop_break
  / mml_quick_rest
  / mml_rhythm_part
  / mml_range_begin
  / mml_range_end
  / ws

// スラー
mml_slur = x: '&' {
  return {
    type: x,
    value: {},
    location: location(),
  };
}

// マクロ展開
mml_expand_macro = x: '*' y: num {
  return {
    type: x,
    value: {
      no: y,
    },
    location: location(),
  };
}

mml_expand_named_macro = x: '*' y: name_with_paren {
  return {
    type: '*()',
    value: y,
    location: location(),
  };
}

// 簡易オクターブ
mml_quick_octave = mml_quick_octave_lt / mml_quick_octave_gt
mml_quick_octave_lt = x: '<'+ {
  return {
    type: '<',
    value: {
      count: x.length,
    },
    location: location(),
  };
}
mml_quick_octave_gt = x: '>'+ {
  return {
    type: '>',
    value: {
      count: x.length,
    },
    location: location(),
  };
}

// 簡易音色指定
mml_quick_voice = x: '@' y: num {
  return {
    type: x,
    value: {
      no: y,
    },
    location: location(),
  };
}
mml_quick_named_voice = x: '@' y: name_with_paren {
  return {
    type: '@()',
    value: y,
    location: location(),
  };
}

// ユーザーコマンド
mml_user_command = mml_user_command_with_args / mml_user_command_without_args

mml_user_command_with_args = '@' ws* x: name ws* paren_begin ws_eol* y: value_list ws_eol* paren_end {
  return {
    type: '@COMMAND',
    value: {
      ...x,
      args: normalize(y),
    },
    location: location(),
  };
}
mml_user_command_without_args = '@' ws* x: name (ws* paren_begin paren_end)? {
  return {
    type: '@COMMAND',
    value: {
      ...x,
    },
    location: location(),
  };
}

// 音階名
mml_note = x: [ABCDEFGabcdefg] y: note_modifier? z: accent? w: optional_length {
  return {
    type: 'A-G',
    value: {
      note: getByMap(x, noteAliasMap, 0),
      frames: NaN,
      ...y,
      ...z,
      ...w,
    },
    location: location(),
  };
}

note_modifier = flat / sharp_1 / sharp_2
flat = x: '-'+ {
  return {
    offset: -x.length,
  };
}
sharp_1 = x: '+'+ {
  return {
    offset: x.length,
  };
}
sharp_2 = x: '#'+ {
  return {
    offset: x.length,
  };
}

accent = x: [!~] {
  return {
    accent: getByMap(x, accentAliasMap, 0),
  };
}

// 省略時長さ
mml_length = [Ll] x: length {
  return {
    type: 'L',
    value: x,
    location: location(),
  };
}

// 直接指定
mml_direct
  = mml_direct_with_accent     // n42! n42!4
  / mml_direct_with_duration   // n42 4 n42 4..
  / mml_direct_with_frames     // n42%42
  / mml_direct_with_dots       // n42..
  / mml_direct_without_length  // n42

mml_direct_with_accent = [Nn] x: num_allow_negative y: accent z: optional_length {
  return {
    type: 'N',
    value: {
      direct: x,
      frames: NaN,
      ...y,
      ...z,
    },
    location: location(),
  };
}

mml_direct_with_duration = [Nn] x: num_allow_negative ws+ y: duration z: dots? {
  return {
    type: 'N',
    value: {
      direct: x,
      frames: NaN,
      ...y,
      ...z
    },
    location: location(),
  };
}

mml_direct_with_frames = [Nn] x: num_allow_negative ws* y: frames {
  return {
    type: 'N',
    value: {
      direct: x,
      frames: NaN,
      ...y,
    },
    location: location(),
  };
}

mml_direct_with_dots = [Nn] x: num_allow_negative y: dots? {
  return {
    type: 'N',
    value: {
      direct: x,
      frames: NaN,
      ...y,
    },
    location: location(),
  };
}

mml_direct_without_length = [Nn] x: num_allow_negative {
  return {
    type: 'N',
    value: {
      direct: x,
      frames: NaN,
    },
    location: location(),
  };
}

// オクターブ
mml_octave = [Oo] x: num_allow_negative {
  return {
    type: 'O',
    value: {
      octave: x,
    },
    location: location(),
  };
}

// 相対オクターブ
mml_rel_octave = [Oo] ':' x: rel_num {
  return {
    type: 'O:',
    value: {
      offset: x,
    },
    location: location(),
  };
}

// 音長比
mml_quantize = [Qq] x: num {
  return {
    type: 'Q',
    value: {
      rate: x,
    },
    location: location(),
  };
}

// 休符
mml_rest = [Rr] x: optional_length {
  return {
    type: 'R',
    value: {
      frames: NaN,
      ...x,
    },
    location: location(),
  };
}

// テンポ
mml_tempo = [Tt] x: (float / num) {
  return {
    type: 'T',
    value: {
      tempo: x,
    },
    location: location(),
  };
}

// 音量
mml_volume = [Vv] x: num_allow_negative {
  return {
    type: 'V',
    value: {
      volume: x,
    },
    location: location(),
  };
}

// 相対音量
mml_rel_volume = [Vv] ':' x: rel_num {
  return {
    type: 'V:',
    value: {
      offset: x,
    },
    location: location(),
  };
}

// 楽器の音量
mml_part_volume = [Vv] x: rhythm_part y: num_allow_negative {
  return {
    type: 'V{}',
    value: {
      parts: x.map((x) => {
        delete x.accent;
        return x;
      }),
      volume: y,
    },
    location: location(),
  };
}

// 楽器の相対音量
mml_part_rel_volume = [Vv] x: rhythm_part ':' y: rel_num {
  return {
    type: 'V{}:',
    value: {
      parts: x.map((x) => {
        delete x.accent;
        return x;
      }),
      offset: y,
    },
    location: location(),
  };
}

// ループ開始
mml_loop_begin = '[' x: num? {
  return {
    type: '[',
    value: {
      count: typeof x === 'number' ? x : NaN,
    },
    location: location(),
  };
}

// ループ終了
mml_loop_end = ']' x: num? {
  return {
    type: ']',
    value: {
      count: typeof x === 'number' ? x : NaN,
    },
    location: location(),
  };
}

// ループ脱出
mml_loop_break = '/' {
  return {
    type: '/',
    value: {},
    location: location(),
  };
}

// 簡易休符
mml_quick_rest = x: '_'+ {
  return {
    type: '_',
    value: {
      count: normalize(x).length,
    },
    location: location(),
  };
}

// リズム楽器名
mml_rhythm_part = x: rhythm_part y: optional_length {
  return {
    type: '{}',
    value: {
      frames: NaN,
      parts: normalize(x).filter((x) => x.type !== ' '),
      ...y,
    },
    location: location(),
  };
}

rhythm_part = '{' ws* x: rhythm_part_list ws* '}' {
  return normalize(x).filter((x) => x.type !== ' ');
}
rhythm_part_list = (rhythm_part_name ws* rhythm_part_list) / rhythm_part_name
rhythm_part_name = rhythm_part_name_alpha / rhythm_part_name_direct
rhythm_part_name_alpha = x: [A-MO-Za-mo-z] y: accent? {
  return {
    name: x.toLowerCase(),
    ...y,
  };
}
rhythm_part_name_direct = [Nn] x: num_allow_negative y: accent? {
  return {
    direct: x,
    ...y,
  };
}

// 範囲開始
mml_range_begin = x: ('|'[&!~]) {
  return {
    type: normalize(x).join(''),
    value: {},
    location: location(),
  };
}

// 範囲終了
mml_range_end = x: '|' {
  return {
    type: x,
    value: {},
    location: location(),
  };
}

// ----

// 長さ
length = duration / frames

// 省略可能な長さ
optional_length = x: (length / dots)? {
  if (x === null) return {};
  if (typeof x === 'number') return { dots: x };
  return x;
}

// 音符の長さ
duration = x: num y: dots? {
  return {
    duration: x,
    ...y,
  };
}

// 付点
dots = x: '.'+ {
  return {
    dots: x.length,
  };
}

// フレーム数
frames = '%' x: num {
  return {
    frames: x,
  };
}

// ---- 他の構成要素

// 空白
ws = x: [\x00-\x09\x0b\x0c\x0e-\x20]+ {
  return {
    type: ' ',
    ws: [x.join('')],
    location: location(),
  };
}

// 行末
eol = ([\x0d\x0a] / [\x0a] / [\x0d]) {
  return {
    type: '\n',
    value: {},
    location: location(),
  };
}

// ファイル末尾
eof = !. {
  return {
    type: '\n',
    value: {},
    location: location(),
  };
}

// 空白＋改行（値リストで使用）
ws_eol = x: [\x00-\x20]+ {
  return;
}

// カンマ
comma = ws* ',' ws* {
  return;
}

// 空白・改行を前後に持つカンマ
comma_allow_eol = ws_eol* ',' ws_eol* {
  return;
}

// カッコ
paren_begin = '(' ws*
paren_end = ws* ')'

// 名前
name = x: ([A-Za-z][A-Za-z0-9_]*) {
  return {
    name: normalize(x).join('').toLowerCase(),
  };
}

name_with_paren = paren_begin x: name paren_end {
  return x;
}


// 数値
num = non_zero / zero

num_allow_negative = x: '-'? y: num {
  return x === '-' ? -y : y;
}

// 0以外の整数
non_zero = x:[1-9] y:[0-9]* {
  return Number.parseInt(normalize(x, y).join(''), 10);
}

// 0
zero = '0' {
  return 0;
}

// 小数
float = x: num '.' y: non_zero {
  return Number.parseFloat(normalize(x, '.', y).join(''));
}

// 相対数値
rel_num = num_with_sign / zero

num_with_sign = x: [+-] y: num {
  return x === '-' ? -y : y;
}

// 文字列
str = x: (str_quote / str_dq) {
  return {
    str: normalize(x).join(''),
  };
}

str_quote = '\'' x: str_quote_fragment* '\'' {
  return x;
}

str_quote_fragment = str_quote_escape / str_backslash_escape / [^'\\]
str_quote_escape = '\\\'' {
  return '\'';
}
str_backslash_escape = '\\\\' {
  return '\\';
}

str_dq = '"' x: str_dq_fragment* '"' {
  return x;
}
str_dq_fragment = str_dq_escape / str_backslash_escape / [^"\\]
str_dq_escape = '\\"' {
  return '"';
}

// 値リスト
value_list = value comma_allow_eol value_list / value
value = float / num_allow_negative / name / str
