/**
 * Tailwind config for @medlens/mobile (NativeWind v4 / Tailwind CSS v3.4).
 *
 * Single source of truth: colors and radii are `require()`d from
 * @medlens/ui-tokens/tokens.cjs (the same values apps/web consumes via
 * tokens.css) — never hand-copy hex values here. Font families map the
 * package's conceptual labels (fonts.display/body/mono) to the real static
 * PostScript names loaded on-device via @expo-google-fonts in _layout.tsx.
 */
const tokens = require("@medlens/ui-tokens/tokens.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: { ...tokens.colors },
      borderRadius: Object.fromEntries(
        Object.entries(tokens.radius).map(([key, px]) => [key, `${px}px`]),
      ),
      fontFamily: {
        // tokens.fonts.display === "Newsreader" (serif display/headings)
        display: ["Newsreader_500Medium"],
        "display-semibold": ["Newsreader_600SemiBold"],
        // tokens.fonts.body === "Plus Jakarta Sans"
        body: ["PlusJakartaSans_400Regular"],
        "body-medium": ["PlusJakartaSans_500Medium"],
        "body-semibold": ["PlusJakartaSans_600SemiBold"],
        "body-bold": ["PlusJakartaSans_700Bold"],
        // tokens.fonts.mono === "JetBrains Mono"
        mono: ["JetBrainsMono_400Regular"],
      },
    },
  },
  plugins: [],
};
