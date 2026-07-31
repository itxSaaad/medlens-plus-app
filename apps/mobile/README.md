# apps/mobile

Expo Router mobile application for MedLens+.

## Run locally

```bash
pnpm --filter @medlens/mobile dev
pnpm --filter @medlens/mobile start
pnpm --filter @medlens/mobile ios
pnpm --filter @medlens/mobile android
pnpm --filter @medlens/mobile web
pnpm --filter @medlens/mobile lint
pnpm --filter @medlens/mobile typecheck
pnpm --filter @medlens/mobile build
```

## Production builds (local, no CI/CD)

This app uses native modules (Reanimated, expo-linear-gradient, expo-splash-screen)
so it is **not Expo Go compatible** — testing a real build means a native compile.
Everything below runs fully on your own machine, for $0, no Apple/Google account
required for the first two:

```bash
# iOS Simulator, Release configuration (needs macOS + Xcode; no Apple ID at all)
pnpm --filter @medlens/mobile ios:release

# Physical Android device via USB, Release build, sideloaded (needs Android
# Studio/SDK + a device with USB debugging on; `adb devices` must show it)
pnpm --filter @medlens/mobile android:release
```

Both commands prebuild the native `ios/`/`android/` projects (gitignored,
regenerated on demand — see `pnpm --filter @medlens/mobile prebuild` to do that
step alone) and install a Release-configuration build directly to the
simulator/device. Neither goes through EAS or any cloud service.

For a physical iPhone: a free Apple ID works for `expo run:ios` on a connected
device, but the install expires after 7 days and Xcode re-signs are limited to 3
devices — a paid Apple Developer Program ($99/yr) removes that limit and is only
needed for TestFlight or ad-hoc distribution to other testers.

Two additional scripts exist for EAS's *local* build mode (`build:ios:local`,
`build:android:local`) — same native build, still fully local and free (doesn't
count against EAS's cloud quota), but produces a distributable `.ipa`/`.apk`
artifact instead of installing directly; requires `eas login` once. See
`eas.json` for the build profiles.

## Project shape

- `src/app/` — file-based Expo Router screens and layouts
- `assets/images/` — app icons, logos, splash, and branding
- `tailwind.config.js`, `metro.config.js`, `babel.config.js`, `src/global.css` — NativeWind setup

## Design system

Styling uses [NativeWind](https://www.nativewind.dev/) (Tailwind for React Native).
Colors and radii come from the shared `@medlens/ui-tokens` package (the same
tokens `apps/web` consumes), so mobile and web stay visually in sync — change a
token there and both apps pick it up. Typography matches web on-device via
`@expo-google-fonts` (Newsreader display, Plus Jakarta Sans body, JetBrains Mono).

## Conventions

- Use Expo Router file-based routing; keep screens in `src/app/`.
- Style with NativeWind `className` utilities backed by `@medlens/ui-tokens`; do
  not hard-code hex values.
- Keep mobile branding aligned with the web product and shared tokens.
- No medical interpretation logic in the UI — the API owns clinical semantics.
- No PHI in logs or analytics; follow repository safety and privacy guardrails.

## Reference docs

- Expo docs: [https://docs.expo.dev](https://docs.expo.dev)
- Expo Router docs: [https://docs.expo.dev/router/introduction](https://docs.expo.dev/router/introduction)
- NativeWind docs: [https://www.nativewind.dev/docs](https://www.nativewind.dev/docs)
