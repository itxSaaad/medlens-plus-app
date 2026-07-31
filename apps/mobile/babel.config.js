/**
 * Babel config for @medlens/mobile.
 *
 * Per NativeWind's official Expo setup guide
 * (https://www.nativewind.dev/docs/getting-started/installation): pass
 * `jsxImportSource: "nativewind"` to babel-preset-expo and add the
 * `nativewind/babel` preset so `className` on React Native components compiles.
 *
 * `react-native-worklets/plugin` is required by react-native-reanimated v4 to
 * workletize animations (used for the home screen entrance motion) and MUST be
 * listed last, per the Reanimated getting-started guide.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: ["react-native-worklets/plugin"],
  };
};
