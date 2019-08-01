/** アクセント（強め） */
export const ACCENT_STRONG: 1 = 1;

/** アクセント（弱め） */
export const ACCENT_WEAK: -1 = -1;

/** アクセント */
export type Accent = typeof ACCENT_STRONG | typeof ACCENT_WEAK;
