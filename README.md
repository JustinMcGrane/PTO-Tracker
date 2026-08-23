# PTO Tracker

A B2C SaaS app that helps individual employees calculate, track, and plan their paid time off (PTO). Free public calculators drive SEO traffic; a single paid subscription ($5/mo or $40/yr) unlocks PTO tracking, vacation planning, multiple PTO buckets, and full history/export. There is no free tier for the tracking app — signup goes straight to checkout.

This is a consumer productivity tool, not an employer/HR platform — there are no employee management, approval workflows, or payroll features.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **PostgreSQL** + **Prisma 6**
- **Supabase Auth** (`@supabase/ssr`) for email/password auth
- **Stripe** for subscription billing
- **Vitest** for unit tests
- Deploys to **Vercel**

## Project structure

```
prisma/schema.prisma        Database schema
prisma/seed.ts               Demo data seed script
src/lib/pto/                 Calculation engine (pure functions, unit tested)
src/lib/supabase/            Supabase client helpers (browser/server/middleware)
src/lib/auth.ts              Session + app-user helpers
src/lib/plan.ts              Subscription pricing + active-subscription check
src/lib/stripe.ts            Stripe SDK client
src/app/(marketing)/         Public site: homepage, calculators, SEO guides, login/signup
src/app/dashboard/           Authenticated app: overview, vacations, future PTO, activity, billing
src/app/api/stripe/webhook/  Stripe webhook handler
src/app/sitemap.ts           Sitemap
src/app/robots.ts            robots.txt
tests/                       Vitest unit tests for the calculation engine
```

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Under **Project Settings → API**, copy the Project URL and anon public key.
3. Under **Project Settings → Database**, copy the connection string (pooled, port 6543) for `DATABASE_URL` and the direct connection (port 5432) for `DIRECT_URL`.
4. Email/password auth is enabled by default. Under **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` as a redirect URL (and your production URL later).

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the Supabase and database values from step 2. Stripe values can be added in step 5.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npm run prisma:seed   # optional demo data
```

### 5. Set up Stripe

There's no free tier — signup goes straight to Stripe Checkout, so this step is required to get past signup locally (not optional).

1. Create a [Stripe](https://stripe.com) account and switch to test mode.
2. Create two recurring Prices for your subscription product: $5/month and $40/year.
3. Copy the secret key, publishable key, and both price IDs into `.env.local`.
4. Forward webhooks to your local server and copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 6. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`. The three public calculators and SEO pages work immediately with no auth or database required; sign up to reach the dashboard.

## Testing

```bash
npm test        # run the PTO calculation unit tests once
npm run test:watch
```

The calculation engine (`src/lib/pto/calculations.ts`) is pure and framework-free, covering every accrual frequency (weekly, biweekly, semimonthly, monthly, annual, per-hour-worked), balance caps, vacation impact, and payout math.

## Build & lint

```bash
npm run build
npm run lint
```

## Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Add all variables from `.env.example` in the Vercel project settings, using your production Supabase and Stripe (live mode) values, and set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Add a Stripe webhook endpoint pointing at `https://<your-domain>/api/stripe/webhook` and use its signing secret for `STRIPE_WEBHOOK_SECRET`.
4. Run `npx prisma migrate deploy` against the production database (e.g. via a Vercel build step or manually) before the first deploy.

## Notes on the calculation model

All PTO amounts are stored as integer minutes internally (never floats), and every projection is derived from a single "starting balance as of a date" baseline plus a computed accrual formula — never by repeatedly adding small increments — to avoid float drift. See `src/lib/pto/calculations.ts` and `tests/pto-calculations.test.ts` for the full model, including how balance caps, planned vacations, and manual ledger entries (which rebase the baseline) interact.

Analytics event hooks exist in `src/lib/analytics.ts` and are already called from the calculators, signup flow, and billing flow — no provider is wired up yet, so calls are no-ops in production (logged to the console in development) until one is added.
