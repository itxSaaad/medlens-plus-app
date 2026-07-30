import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

import { colors } from "@medlens/ui-tokens";

/**
 * Ambient brand texture behind the home hero.
 *
 * Ports the *feel* of web's mesh-gradient/dot-grid motif to native without CSS
 * blur or SVG pattern tiling (neither maps cleanly to React Native):
 *  - a soft top wash in the brand `accent` mint fading to `surface`,
 *  - a few large, very-low-opacity `lens`/`insight` blobs anchored off-canvas at
 *    the corners to suggest the blurred-circle motif,
 *  - a bottom vignette that fades everything back into `surface`, matching web's
 *    radial-vignette + dot-grid mask fade.
 *
 * Purely decorative — hidden from assistive tech. Colors come from
 * @medlens/ui-tokens only (hex via the typed export for the two gradients that
 * need raw color strings; Tailwind classes for the tinted blobs).
 */
export function HeroBackground() {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0 overflow-hidden"
    >
      {/* Soft directional brand wash from the top-left. */}
      <LinearGradient
        colors={[colors.accent, colors.surface]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      {/* lens (teal) blob, top-left off-canvas. */}
      <View className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-lens opacity-10" />
      {/* insight (indigo) blob, upper-right off-canvas. */}
      <View className="absolute -right-28 top-24 h-64 w-64 rounded-full bg-insight opacity-10" />
      {/* second, fainter lens blob mid-screen for depth. */}
      <View className="absolute -left-16 top-1/2 h-60 w-60 rounded-full bg-lens opacity-5" />

      {/* Vignette: fade the blobs back into the surface toward the bottom. */}
      <LinearGradient
        colors={["transparent", colors.surface]}
        start={{ x: 0.5, y: 0.35 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
