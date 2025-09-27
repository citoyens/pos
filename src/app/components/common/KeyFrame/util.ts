export type ColorRGB = { [key in "r" | "g" | "b"]: number };

export const colorHexToRgb = (hex: string): ColorRGB | undefined => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const length = result?.length ?? 0;
  if (!result || length < 3) return undefined;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};
