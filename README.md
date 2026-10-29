# Daotra (daotra.io)

Next.js 15 (App Router, TypeScript) platform for Daotra — public marketing site,
the Publisher portal (registration, sign-in and a signed-in landing page,
backed by the Daotra API). Built for deployment
to **Cloudflare Workers** via the OpenNext adapter (not Vercel).

Postback / server-to-server tracking endpoints are intentionally **not** in this
repo — that's Project D, handled in isolated infrastructure.

## Preview without installing anything

Open `preview.html` directly in a browser (double-click it, or drag it into a
tab). It's a static, single-file mirror of the homepage — including a working
WebGL globe — with no build step. It's a visual reference only; the real app
lives in `app/`.

## Local development

Requires Node.js 22+ (wrangler 4 requires it).

```bash
npm install
cp .env.example .env.local        # fill in what you have; everything else can stay blank for now
npm run dev                       # http://localhost:3000
```

## Deploying to Cloudflare Workers

This repo is pre-configured for the **OpenNext Cloudflare adapter**, which is
Cloudflare's current recommended path for Next.js App Router apps (Cloudflare
Pages' own Next.js integration and the older `next-on-pages` tool are both
deprecated in favor of it).

There are two separate environments, defined in `wrangler.jsonc`:

- **staging** — deploys to a free `daotra-staging.<your-subdomain>.workers.dev`
  URL. No domain setup needed at all; this is for trying real, deployed
  changes before anyone sees them.
- **production** — deploys to the `daotra` Worker, reached only through the
  real custom domains (`daotra.io`, `aff.daotra.io`).

Once a named environment exists, Wrangler requires you to say which one you
mean on every deploy — that's why every command below has an explicit
`--env`/`:staging`/`:production` in it. There's no bare `npm run deploy`
anymore on purpose, to make it impossible to accidentally ship to production.

### One-time setup

1. **Push this repo to GitHub**, and create a `staging` branch alongside `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial Daotra platform"
   git branch -M main
   git remote add origin https://github.com/<your-org>/daotra.git
   git push -u origin main
   git checkout -b staging
   git push -u origin staging
   ```

2. **Create a Cloudflare API token** (Cloudflare dashboard → My Profile → API
   Tokens → Create Token → use the "Edit Cloudflare Workers" template), and
   find your **Account ID** (right sidebar of any Workers page in the
   dashboard).

3. **Add two repo secrets** in GitHub (Settings → Secrets and variables →
   Actions):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

   `.github/workflows/deploy.yml` is already set up to build and deploy on
   every push to `staging` (→ staging environment) and `main` (→ production).

4. **Set environment variables/secrets** on each Worker (these are separate
   from GitHub secrets — GitHub's secrets only authenticate the deploy, they
   don't become your app's runtime env vars, and staging/production have
   fully separate secret stores):
   ```bash
   npx wrangler login
   npx wrangler secret put DAOTRA_API_BASE_URL --env=staging
   npx wrangler secret put DAOTRA_WEBSITE_GATEWAY_SECRET --env=staging
   npx wrangler secret put DAOTRA_API_BASE_URL --env=production
   npx wrangler secret put DAOTRA_WEBSITE_GATEWAY_SECRET --env=production
   # ...repeat per secret, per environment, for anything you have a real
   # value for from .env.example (UPSTASH_REDIS_REST_URL, etc.)
   ```

5. **First manual deploys** (optional — confirms everything works before
   relying on CI):
   ```bash
   npm install
   npm run deploy:staging
   npm run deploy:production
   ```
   Each runs `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy
   --env=<name>`, which under the hood is `next build` transformed into a
   Cloudflare Worker and pushed with Wrangler.

### Pointing daotra.io (and the aff. Publisher portal) at production

Since your domain's DNS is already on Cloudflare, connecting custom domains to
the Worker is a dashboard step, not a code change - and this app needs
**two** hostnames pointed at the **production** Worker specifically
(staging stays on its workers.dev URL and needs no domain setup), because
`middleware.ts` does host-based routing (the aff. subdomain serves the
Publisher portal; everything else serves the marketing site):

Cloudflare dashboard → **Workers & Pages** → select the `daotra` Worker (not
`daotra-staging`) → **Settings → Domains & Routes → Add → Custom Domain**,
and add each of:

- `daotra.io` (and `www.daotra.io` if you want both)
- `aff.daotra.io`

**There is no Advertiser portal** — it was cancelled (Daotra BD-40 as amended
2026-10-29). If an `adv.daotra.io` custom domain is still attached, remove it;
until then `middleware.ts` redirects it to `daotra.io/advertisers`.

Cloudflare creates the DNS record and issues the certificate automatically
for each — no manual CNAME/A record needed. Both resolve to the same
Worker; `middleware.ts` is what makes each one serve the right thing.

After that, every push to `main` (via the GitHub Action) redeploys production,
and all three domains keep pointing at it automatically. Every push to
`staging` redeploys the staging Worker the same way.

### Local preview of the production build

```bash
npm run preview   # builds with OpenNext and serves it locally via Wrangler
                   # (against the staging environment config), so you're
                   # testing the actual Worker runtime, not `next dev`
```

## What's stubbed vs. wired up

- **Wired up:** all public pages, the interactive globe, the contact form
  (validated + rate-limited + honeypot-protected, delivery provider left for
  you to plug in), the Telegram contact button, the Terms & Conditions and
  Privacy Policy pages, the cookie consent banner, the register/login forms
  on both portals (same protections), security headers, CSP, and the
  aff. subdomain routing in `middleware.ts`, with the portal's session
  check in its server layout.
- **Publisher accounts are Daotra's:** registration, sign-in, sign-out and the
  password-reset page call the Daotra API from this site's server routes
  (`app/api/register`, `app/api/portal/*`) — this site stores no identity, no
  password and no session of its own. The session is Daotra's opaque token in an
  `HttpOnly` cookie. See [docs/DAOTRA_INTEGRATION.md](docs/DAOTRA_INTEGRATION.md).
  The signed-in portal shows the account's identity only; the dashboard, Deal
  Groups and Postbacks Log screens follow their own specifications. There is no
  "forgot password" email (none is approved): Daotra staff issue a one-time reset
  link. There is no Advertiser portal (cancelled) — Advertisers work with Daotra
  directly, and the Advertisers page points them to Telegram.
- **Legal pages need a lawyer, not just a review:** `/terms` and `/privacy`
  are genuinely comprehensive drafts (eligibility, fraud, payments/clawbacks,
  liability, GDPR/CCPA rights, cookies, etc.) but they're a *template* —
  Daotra operates in a regulated vertical (iGaming) across many
  jurisdictions, so have qualified counsel review and localize both pages,
  and register with a supervisory authority if your operations require it,
  before they go live for real users.
- **Out of scope on purpose:** postback/attribution endpoints (Project D).

## Project structure

```
app/
  (public pages)         /, /about, /publishers, /advertisers, /contact, /terms, /privacy
  login/ register/       apex "choose your portal" chooser pages
  portal/publisher/      served at aff.daotra.io via middleware rewrite
    register/ login/       public application + sign-in forms
    (dashboard)/            sidebar-wrapped dashboard routes (protected)
  api/                    contact, register, portal/{login,logout,reset-password}
middleware.ts             host-based rewrite (aff.) + fast no-session redirect
components/
  home/                   landing page sections + the globe
  auth/ dashboard/        portal forms, dashboard chrome
  legal/                  Terms & Privacy page building blocks
  layout/ ui/             shared nav/footer, shadcn-style primitives
lib/                      utils, geo-offers accessor, rate limiting, zod schemas
data/geo-offers.json      globe's coverage dataset
```

## Subdomain routing

`aff.daotra.io` is the Publisher portal — the official hostname (Daotra BD-40
as amended): registration at `https://aff.daotra.io/register`, login at
`https://aff.daotra.io/login`. `daotra.io` is the marketing site. One Next.js
app serves both: `middleware.ts` reads the `Host` header and rewrites
`aff.daotra.io/*` internally to `/portal/publisher/*`, while leaving
`daotra.io` untouched. See "Pointing daotra.io at it" above for the Custom
Domains this needs in Cloudflare.

"Publisher" is used consistently everywhere — UI copy, route folders
(`/portal/publisher`), the internal role value, and function names all match.

