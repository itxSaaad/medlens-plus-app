# UX review checklist (designer + developer)

Use with `product-ux` for flows, mockups, or PR UI review.

## User & safety
- [ ] Scenario is informational (organize, track, prepare) — not self-diagnosis
- [ ] Golden rules respected in all copy
- [ ] Cross-lab comparison warning where relevant
- [ ] Error messages actionable, non-alarming

## Flow
- [ ] Clear primary CTA per screen
- [ ] Back/exit paths obvious
- [ ] Empty and loading states designed
- [ ] Edge cases: no data, partial OCR, failed upload

## Visual hierarchy
- [ ] One H1; scannable headings
- [ ] Critical info not color-only
- [ ] Whitespace and grouping support clinical calm (in-app)

## Interaction
- [ ] Touch targets ≥ 44px on mobile
- [ ] Forms: labels, validation, focus order
- [ ] No surprise navigation or modal traps

## Dev handoff
- [ ] Matches composition-patterns (no boolean prop soup)
- [ ] RSC vs client boundaries noted
- [ ] Perf budget considered (`web-performance`)
- [ ] Analytics events planned without PHI (`analytics-tagging`)

## Surface check
- [ ] In-app → controlled UX (not marketing flair)
- [ ] Marketing → `marketing-ui` aesthetic allowed with disclaimers
