# Connecting the website to Daotra

The authoritative contract is in the Daotra repository:
[`docs/publisher-website-integration.md`](https://github.com/Daotraio/daotra/blob/main/docs/publisher-website-integration.md),
with the design in
[`docs/decisions/0030-publisher-website-gateway.md`](https://github.com/Daotraio/daotra/blob/main/docs/decisions/0030-publisher-website-gateway.md)
and the business rules in BD-71 (as amended 2026-10-29) of `docs/business-decisions.md`.
This page is the website's side of it.

## The rule

**This site stores no Publisher identity.** Registration, sign-in, sign-out and password
resets are forwarded, server-to-server, to the Daotra API. Daotra holds the Publisher, the
login, the Argon2id password hash and the session. The website holds one cookie:

| Cookie | Value | Flags |
|---|---|---|
| `__Host-daotra_portal` (`daotra_portal` in `next dev`) | Daotra's opaque session token | `HttpOnly; Secure; SameSite=Lax; Path=/` |

No browser JavaScript can read the token, and no response body carries it. Every portal page
asks Daotra who the session belongs to (`GET /portal/me`), so a session ended in Daotra — a
logout elsewhere, a password reset, a disabled login — ends here at once.

## Files

| File | Role |
|---|---|
| `lib/daotra-api.ts` | The only client of the Daotra API. Server-only. Adds the gateway headers; never logs a body |
| `lib/portal-session.ts` | The cookie, and `fetchPortalIdentity` |
| `lib/portal-identity.ts` | `currentPortalIdentity()` for Server Components (one `/portal/me` per render) |
| `lib/request-guards.ts` | `isSameOrigin` (CSRF) and `clientIp` (Cloudflare's `CF-Connecting-IP` only) |
| `lib/portal-paths.ts` | Portal links for the current host (`aff.` or the staging host) |
| `app/api/register/route.ts` | Registration → `POST /public/publisher-registrations` |
| `app/api/portal/login/route.ts` | Sign-in → `POST /portal/auth/login`; sets the cookie |
| `app/api/portal/logout/route.ts` | Sign-out → `POST /portal/auth/logout`; clears the cookie |
| `app/api/portal/reset-password/route.ts` | Reset → `POST /portal/auth/reset-password` |
| `app/portal/publisher/(dashboard)/layout.tsx` | The portal's authentication boundary on this side |
| `middleware.ts` | Host routing, and a fast redirect when no session cookie is present |

## Configuration

| Name | Value |
|---|---|
| `DAOTRA_API_BASE_URL` | The Daotra `api` origin (https outside development) |
| `DAOTRA_WEBSITE_GATEWAY_SECRET` | The same ≥ 32-character secret as the API's `DAOTRA_WEBSITE_GATEWAY_SECRET` |

Set both per environment with `npx wrangler secret put NAME --env=<staging|production>`.
Without `DAOTRA_API_BASE_URL` registration and sign-in answer "temporarily unavailable" —
never a false success. **Deploy the Daotra API release first.**

## Rules this side keeps

- **Never log** a request or response body, a password, a token or a registrant's details.
- **Never transmit Verify Password** — it is checked in the browser; the schemas on both
  ends refuse it.
- **Every POST route checks the origin** (`Sec-Fetch-Site: same-origin`, or `Origin` naming
  this host).
- **The reset token lives in the URL fragment** (`#token=…`) — never a query string — and the
  reset page clears it from the address bar on load.
- **Never forward** a browser header, cookie or query string to Daotra; the client address
  goes only as `X-Daotra-Client-IP`, from `CF-Connecting-IP`.
- **Terms & Privacy acceptance is explicit and recorded.** The form's unticked checkbox must be
  ticked; the route sends `terms_accepted: true` with the published versions from
  `lib/legal.ts` (the browser never chooses them), and Daotra records them with its own time.
  **When a policy changes, change `lib/legal.ts`** — the page's "Last updated" and every later
  acceptance move together.

## Hostname

The Publisher portal is **`aff.daotra.io`** (registration `/register`, login `/login`, reset page
`/login/reset-password`). There is **no Advertiser portal** — it was cancelled (Daotra BD-40 as
amended 2026-10-29); `adv.daotra.io` only redirects to `daotra.io/advertisers`.
