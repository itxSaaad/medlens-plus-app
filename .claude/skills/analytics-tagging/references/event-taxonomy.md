# Event taxonomy (stub)

Extend as product analytics matures. **Never include PHI.**

## Naming
`object_action` — lowercase, snake_case (`pricing_cta_click`).

## Allowed examples (marketing)
| Event | Params |
|-------|--------|
| `page_view` | `page_type` (home, pricing, blog) |
| `cta_click` | `cta_id`, `page_type` |
| `signup_start` | `source` |
| `newsletter_submit` | — |

## Restricted (product — privacy review required)
| Event | Params |
|-------|--------|
| `report_upload_started` | count only — no file name, type, or results |
| `feature_used` | `feature_id` only — no report content |

## Forbidden params
`patient_id`, `report_text`, `lab_value`, `diagnosis`, `file_name`, `email` (use hashed ID if approved)
