# TKT-020 Signed Upload Endpoint

- Status: BACKLOG
- Priority: P0
- Epic: EPIC-002
- Sprint: SPRINT-03

## Problem
Direct file uploads require secure pre-signed flows to avoid API bottlenecks and key exposure.

## Scope
- API endpoint to create signed upload URLs
- Metadata registration row in DB

## Acceptance Criteria
1. Endpoint validates user/session.
2. Upload URL is short-lived and single-purpose.
3. Metadata record created with `queued` status.
4. Unit tests cover invalid file types and size limits.

## Dependencies
TKT-011, TKT-013
