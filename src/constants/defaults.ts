/** 各種デフォルト値 */
export const defaults = {
  /** 簡易相対オクターブのモード */
  octaveMode: 0,

  /** 音色 */
  voice: 0,

  /** 省略時長さ（音符の長さ） */
  duration: 4,

  /** オクターブ */
  octave: 4,

  /** 音長比 */
  quantize: 8,

  /** テンポ */
  tempo: 112.5,

  /** 音量 */
  volume: 12,

  /** 省略時ループ回数 */
  loopCount: 2,

  /** アクセント（弱め）補正値 */
  volumeWeak: -3,

  /** アクセント（強め）補正値 */
  volumeStrong: 3,

  /** 秒間フレーム数 */
  fps: 60,

  /** ループ展開の最大深度 */
  maxLoopDepth: 10,

  /** マクロ展開の最大深度 */
  maxMacroDepth: 10,
};
