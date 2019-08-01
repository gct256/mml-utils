/**
 * clamp
 *
 * @param value 値
 * @param min 最小値
 * @param max 最大値
 */
export const clamp = (value: number, min: number, max: number): number => {
  if (value < min) return min;

  if (value > max) return max;

  return value;
};
