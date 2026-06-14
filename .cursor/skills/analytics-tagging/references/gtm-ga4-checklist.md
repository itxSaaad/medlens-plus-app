# GTM, GA4 & pixels checklist

Use with `analytics-tagging` when shipping tracking.

## Privacy
- [ ] No PHI, lab values, diagnoses, or identifiable report content in any event
- [ ] Query strings with tokens/IDs stripped from page_location
- [ ] PR includes privacy impact note
- [ ] Marketing pixels **not** on authenticated report/dashboard routes (or blocked by consent + route guard)

## Consent
- [ ] Consent banner before non-essential cookies (EEA/UK)
- [ ] Consent Mode v2 wired in GTM / gtag
- [ ] Tags fire only in correct consent state

## GTM
- [ ] Single container per environment; staging uses test container or debug mode
- [ ] Preview mode tested before publish
- [ ] No duplicate GA4 configuration tags
- [ ] Version published with description

## Implementation
- [ ] `next/script` strategy documented (not sync in `<head>` without justification)
- [ ] dataLayer events use approved taxonomy only
- [ ] No inline pixels scattered in components — centralize in GTM or one loader

## Performance
- [ ] Lighthouse before/after (see `web-performance`)
- [ ] LCP element not delayed by tag manager
- [ ] Total third-party script weight noted in PR

## Verification
- [ ] GA4 DebugView / GTM preview shows expected events
- [ ] No events on local dev unless explicitly enabled
