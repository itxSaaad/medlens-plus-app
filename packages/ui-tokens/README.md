# packages/ui-tokens

Shared design tokens (colors, radius scale, font family labels) for `@medlens/web`
and `@medlens/mobile`.

**apps/web is the source of truth.** These values were extracted verbatim from
`apps/web/src/app/globals.css` — they were not redesigned in the process. Any future
token change happens here first, then both apps pick it up; never edit a token value
independently in one app.

## Files

- `tokens.css` — CSS custom properties + Tailwind v4 `@theme inline` mapping.
  Consumed by web: `@import "@medlens/ui-tokens/tokens.css";` in `globals.css`,
  placed after `@import "tailwindcss";`.
- `tokens.cjs` — plain CommonJS mirror of the same values, for NativeWind's
  `tailwind.config.js` (which runs under Node/Metro, not a CSS engine, and can't
  read `tokens.css`'s custom properties directly). Kept in sync with `tokens.css`
  by hand — small, stable value set, not worth a codegen step yet.
- `src/index.ts` — typed TS re-export of `tokens.cjs`, for the rare case a
  component needs a raw value instead of a utility class (e.g. `app.json`'s splash
  screen `backgroundColor`, which can't be a Tailwind class).

## What's NOT here

Actual components, layout, or styling _rules_ (e.g. `@layer base` typography rules,
keyframe animations) stay in each app — this package is tokens only, per
[`docs/02-architecture/05-SHARED_PACKAGES_STRATEGY.md`](../../docs/02-architecture/05-SHARED_PACKAGES_STRATEGY.md).
Font _loading_ (which `next/font/google` or `@expo-google-fonts/*` calls to make)
is also platform-specific and stays in each app; this package only records the
canonical family label each platform should load.
