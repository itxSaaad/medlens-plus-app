/**
 * MedLens+ design tokens — plain CommonJS mirror of ./tokens.css, for consumers
 * that can't read CSS custom properties directly (NativeWind's tailwind.config.js
 * runs under Node/Metro at build time, not in a browser/CSS engine).
 *
 * Explicit .cjs extension (not .js) so this loads correctly under `require()`
 * regardless of the importing app's package.json "type" field, even though this
 * package itself is "type": "module".
 *
 * Keep in sync with ./tokens.css by hand — same ~20 values, low drift risk.
 * Web is the source of truth: change apps/web's design first (via this package),
 * never edit this file's values independently of tokens.css.
 */

/** @type {number} `--radius` base, in px (0.625rem at a 16px root font-size). */
const RADIUS_BASE_PX = 10;

module.exports = {
  colors: {
    ink: "#0f172a",
    surface: "#fafbfc",
    paper: "#ffffff",
    muted: "#64748b",
    border: "#e2e8f0",
    lens: "#0d9488",
    lensHover: "#0f766e",
    insight: "#6366f1",
    caution: "#d97706",
    success: "#059669",
    background: "#fafbfc", // = surface
    foreground: "#0f172a", // = ink
    primary: "#0d9488", // = lens
    primaryForeground: "#ffffff",
    secondary: "#f1f5f9",
    secondaryForeground: "#0f172a", // = ink
    accent: "#ecfdf5",
    accentForeground: "#0f766e", // = lens-hover
    destructive: "#dc2626",
    ring: "#0d9488", // = lens
  },
  // Precomputed px values (RN/NativeWind borderRadius needs numbers, not calc()).
  radius: {
    sm: RADIUS_BASE_PX - 4, // 6
    md: RADIUS_BASE_PX - 2, // 8
    lg: RADIUS_BASE_PX, // 10
    xl: RADIUS_BASE_PX + 4, // 14
  },
  // Canonical family labels only — actual loaded font keys differ per platform
  // (web: CSS var names set by next/font/google; mobile: the PostScript names
  // @expo-google-fonts registers, e.g. "Newsreader_500Medium"). Each app maps
  // these labels to its own loaded font identifiers; this package doesn't own
  // platform-specific font loading.
  fonts: {
    display: "Newsreader",
    body: "Plus Jakarta Sans",
    mono: "JetBrains Mono",
  },
};
