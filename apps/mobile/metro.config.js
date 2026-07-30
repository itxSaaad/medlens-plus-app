/**
 * Metro config for @medlens/mobile.
 *
 * Wraps Expo's default Metro config with NativeWind's `withNativeWind`, pointing
 * at our Tailwind entry (src/global.css), per NativeWind's official Expo guide
 * (https://www.nativewind.dev/docs/getting-started/installation).
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// pnpm's strict, symlinked node_modules layout needs Metro's symlink-aware
// resolver explicitly enabled, or transitive workspace deps (e.g. NativeWind's
// own react-native-css-interop dependency) fail to resolve on a clean
// `pnpm install --frozen-lockfile` (surfaces in CI even when it happens to
// work locally against a warmer, more permissively-hoisted node_modules).
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

module.exports = withNativeWind(config, { input: "./src/global.css" });
