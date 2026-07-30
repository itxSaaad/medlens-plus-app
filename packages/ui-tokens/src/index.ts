/**
 * Typed re-export of ./tokens.cjs for TS/TSX consumers that need a raw token
 * value (e.g. a native-only API that can't read a CSS custom property, such as
 * a splash-screen background color or a StatusBar tint). Prefer Tailwind/NativeWind
 * utility classes over importing this directly wherever classes reach.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokens = require("../tokens.cjs") as {
  colors: Record<string, string>;
  radius: Record<"sm" | "md" | "lg" | "xl", number>;
  fonts: Record<"display" | "body" | "mono", string>;
};

export const colors = tokens.colors;
export const radius = tokens.radius;
export const fonts = tokens.fonts;
export default tokens;
