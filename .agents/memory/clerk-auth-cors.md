---
name: Clerk web auth + CORS
description: How Physics Think authenticates the web app and why the API CORS must be a strict allowlist.
---

# Clerk web auth uses same-origin session cookies

The qr-course web app and the api-server share one domain through the Replit
shared proxy (web at `/`, API at `/api`). Web auth therefore relies on the
**Clerk session cookie**, sent automatically on same-origin requests. Do NOT add
`getToken`/Bearer-token plumbing or a custom auth-token getter for the web
client — the default fetch with credentials already carries the cookie.

## CORS must be a strict allowlist, never `origin: true`

**Rule:** the API's `cors()` must use an explicit allowlist (env-driven from
`REPLIT_DOMAINS`, plus localhost in dev), not `origin: true`.

**Why:** `cors({ credentials: true, origin: true })` reflects *any* request
origin while allowing credentials. For a cookie-authenticated API that lets a
malicious site read authenticated responses cross-origin. Flagged in code review.

**How to apply:** keep `credentials: true` only for trusted origins; same-origin
and non-browser requests (no `Origin` header) are allowed through. Verify with
`curl -H "Origin: https://evil.example.com"` — the response must have NO
`Access-Control-Allow-Origin` header.

## Expired session = silent blank page unless 401 is handled globally

When the Clerk session cookie expires, the Clerk *client* can still report
`signed-in` (so `<Show when="signed-in">` keeps rendering protected pages), while
every API call returns 401. The list query then resolves to empty/undefined and
the page renders blank with no error — looks like a bug, is actually expiry.

**Rule:** the web QueryClient must have a global `QueryCache`/`MutationCache`
`onError` that, on a 401 *from our API* (`error.status === 401` AND
`error.url` includes `/api/`), signs the user out of Clerk and redirects to
`/sign-in`. Narrow to our API URL so an unrelated 401 never force-signs-out.

**Why:** silent blank pages on session expiry read as broken; symptom is API
logs flipping from `304`/`200` to a steady stream of `401` while the UI shell
still renders. Use a short latch so a burst of parallel 401s triggers one
sign-out, not a flood.

