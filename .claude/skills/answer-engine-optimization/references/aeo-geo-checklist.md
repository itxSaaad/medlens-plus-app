# AEO / GEO checklist

Use with `answer-engine-optimization` when publishing or revising public pages.

## Page structure
- [ ] First 100 words directly answer the page’s main question
- [ ] H2s phrased as user questions where natural
- [ ] Short paragraphs (2–4 sentences); bullets for steps and comparisons
- [ ] Glossary or inline definitions for domain terms
- [ ] FAQ block with real user questions (no fabricated medical advice)

## Citability
- [ ] Unique, stable URL per topic
- [ ] Canonical set (`technical-seo`)
- [ ] No critical answers only in images or client-only widgets
- [ ] External claims link to reputable sources

## AI / crawler files
- [ ] `llms.txt` (or equivalent) describes product and public sections
- [ ] `robots.txt` allows marketing/docs paths; blocks app/API
- [ ] Sitemap includes new public URLs

## Schema (via technical-seo)
- [ ] `FAQPage` only for factual product questions
- [ ] `Organization` / `SoftwareApplication` accurate and minimal
- [ ] No `MedicalCondition` or diagnostic schema without legal review

## YMYL / MedLens
- [ ] No “you have X” or treatment language
- [ ] Disclaimer on educational content
- [ ] No PHI or realistic patient data in examples
- [ ] `safety-privacy` review for new health-adjacent copy

## Post-publish (manual)
- [ ] Spot-check AI answers for accurate product description
- [ ] Search Console / Bing Webmaster for index coverage
