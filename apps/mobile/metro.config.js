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

module.exports = withNativeWind(config, { input: "./src/global.css" });
