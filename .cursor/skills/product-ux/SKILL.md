---
name: product-ux
description: UI/UX from designer and developer POV — flows, heuristics, information architecture, and controlled clinical vs marketing experience for MedLens+.
---

# Product UX (designer + developer)

Use when **designing or reviewing experiences** — wireframe thinking, user flows, usability heuristics, and dev-ready UI decisions. Complements implementation skills, not a replacement.

## Which aesthetic?
| Surface | Skills |
|---------|--------|
| In-app health UI | **`web-frontend`** + **`ui-accessibility`** → `bencium-controlled-ux-designer` |
| Marketing / landing | **`marketing-ui`** → `frontend-design` reference |
| Public trust pages | **`product-ux`** + **`safety-privacy`** for copy tone |

## Designer lens
- **Jobs to be done** — user uploads reports, sees timeline, prepares for visit (not “diagnose myself”)
- **Information hierarchy** — primary action obvious; critical warnings visible but not alarmist
- **Progressive disclosure** — complex lab detail behind clear drill-down; don’t overwhelm onboarding
- **Heuristics** (Nielsen) — visibility of status, match real world, user control, consistency, error prevention, recognition over recall, flexibility, minimalism, error recovery, help
- **States** — empty, loading, partial data, error, success for every async health view
- **Cross-lab caution** — persistent pattern when comparing reports from different labs

## Developer lens
- Implement UX with Server Components first; client for interaction only
- Compound components over boolean prop explosion → `web-frontend` → `composition-patterns`
- Accessible by default → `ui-accessibility` + AccessLint refs
- Perf is UX → **`web-performance`** before shipping heavy animations or carousels
- Design tokens / Tailwind consistency; avoid one-off magic numbers

## Review workflow
1. Define user + scenario (patient organizing reports, not clinician diagnosing)
2. Sketch flow: entry → core value → exit/CTA
3. Check against golden rules and `safety-privacy`
4. Map components to existing patterns before inventing new ones
5. a11y + perf pass before merge

## Load on demand
| Task | Reference |
|------|-----------|
| UX review checklist | `references/ux-review-checklist.md` |
| Controlled clinical UI | `web-frontend` → `references/bencium-controlled-ux-designer/` |
| UX / UI guidelines | `ui-accessibility` → `references/web-design-guidelines/` |
| Component patterns | `web-frontend` → `references/composition-patterns/` |
| Distinctive marketing design | `marketing-ui` → `references/frontend-design/` |

Rule: `.cursor/rules/frontend-quality.mdc`
