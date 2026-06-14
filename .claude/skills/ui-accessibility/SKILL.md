---
name: ui-accessibility
description: WCAG, UX audit, medical copy tone, i18n, and AccessLint checks for apps/web health UI.
---

# UI Accessibility

Use for accessible markup, UX audits, and localization on health surfaces.

## MedLens UX tone
- Semantic HTML, labels, keyboard focus, sufficient contrast
- Do not rely on color alone for critical status — pair with text/icon
- Medical copy: clear, non-alarming, never diagnostic
- Cross-lab comparison warnings visible when comparing reports

## i18n
- Strings via `packages/i18n` when localized; avoid scattered hardcoded prose

## Load on demand
| Task | Reference |
|------|-----------|
| Web UX / a11y guidelines | `references/web-design-guidelines/` |
| WCAG audit workflow | `references/audit/` |
| Scan components | `references/scan/` |
| Diff before/after | `references/diff/` |

Pair with **`safety-privacy`** for medical copy. Default clinical aesthetic: **`web-frontend`** → `references/bencium-controlled-ux-designer/`.

Command: `/ui-audit` · Rule: `.cursor/rules/frontend-quality.mdc`
