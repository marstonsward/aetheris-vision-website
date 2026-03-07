# Copilot Instructions — Aetheris Vision Website

## Project Overview
This is the **Aetheris Vision** corporate website — a Next.js 16 (Turbopack) application deployed on Vercel. The company provides AI/ML weather prediction, operational meteorology consulting, and federal contracting services. It is a Veteran-Owned Small Business (VOSB).

## Tech Stack
- **Framework**: Next.js 16.x (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 (PostCSS plugin)
- **UI**: React 19, Framer Motion, Heroicons v2, clsx + tailwind-merge
- **Deployment**: Vercel (with Vercel Analytics)
- **Testing**: Vitest + React Testing Library + Cucumber-style BDD
- **Linting**: ESLint 9 (flat config) with next/core-web-vitals + next/typescript

## Architecture Principles

### DRY (Don't Repeat Yourself)
- **Brand constants**: All company name, URL, email, tagline strings come from `src/lib/constants.ts` (`SITE` object). Never hardcode "Aetheris Vision" or "aetherisvision.com" anywhere.
- **JSON-LD**: Shared structured data objects live in `src/lib/jsonld.ts`. Import `organizationJsonLd`, `publisherRef`, or `websiteJsonLd` instead of recreating inline.
- **Reusable components**: Use `src/components/CtaButton.tsx` for CTA buttons.

### SRP (Single Responsibility Principle)
- **Data vs. rendering**: Page data (tiers, FAQ, process steps, etc.) lives in `src/lib/portfolio-data.ts`, not in page components.
- **Route handlers**: API logic stays in `src/app/api/` route files. No business logic in components.
- **Middleware**: CSP nonce generation and auth logic in `src/middleware.ts`.

## File Organization
```
src/
  app/           # Next.js App Router pages and API routes
  components/    # Reusable React components (client + server)
  lib/           # Shared utilities, constants, data
    constants.ts # SITE brand constants (single source of truth)
    jsonld.ts    # JSON-LD structured data helpers
    portfolio-data.ts # Portfolio page data arrays + interfaces
    posts.ts     # Blog post data and query helpers
tests/
  setup.ts       # Vitest setup (jest-dom matchers)
  unit/          # Unit tests (pure functions, data, components)
  integration/   # Integration tests (API routes, cross-module)
  regression/    # Regression tests (data integrity, brand consistency)
  features/      # BDD feature files (.feature) + step definitions
    steps/       # Vitest test files implementing Gherkin scenarios
```

## Coding Conventions
- Use `import { SITE } from "@/lib/constants"` for any brand string.
- Use path aliases (`@/lib/...`, `@/components/...`) — never relative `../../`.
- Prefer `"use client"` only when truly needed (interactivity, hooks).
- All images should use `next/image` (not raw `<img>` tags).
- Keep components under 200 lines. Extract data to `lib/` when a page exceeds 300 lines.
- Tailwind classes go directly on elements; avoid CSS modules.
- Error boundaries and loading states use Next.js conventions (`error.tsx`, `loading.tsx`).

## Testing Standards
- **Unit tests** (`tests/unit/`): Test pure functions, data modules, and isolated components.
- **Integration tests** (`tests/integration/`): Test API route handlers, cross-module interactions.
- **Regression tests** (`tests/regression/`): Lock in critical business rules and data integrity.
- **BDD tests** (`tests/features/`): Gherkin `.feature` files with step definitions in `tests/features/steps/`.
- Run all tests: `npm test`
- Run specific suite: `npm run test:unit`, `npm run test:integration`, `npm run test:bdd`
- Full CI check: `npm run ci` (lint + test + build)

## Security
- CSP with per-request nonce generated in middleware.
- Security headers set in `next.config.ts` (HSTS, X-Content-Type-Options, etc.).
- Rate limiting on contact API route (5 requests/10 min per IP).
- Honeypot field on contact form for bot detection.
- Never commit secrets — use `.env.local` for `PREVIEW_PASSWORD`, `NEXT_PUBLIC_FORMSPREE_ID`.

## Build & Deploy
- Local dev: `npm run dev`
- Production build: `npm run build` (includes env check)
- Full CI pipeline: `npm run ci`
- Deployed automatically via Vercel on push to `main`.
- Git remotes: `origin` (GitHub), `backup` (GitLab).

## Common Patterns
When adding a new page:
1. Create `src/app/<route>/page.tsx`
2. Import `SITE` from `@/lib/constants` for metadata
3. Include `<Navbar />` and `<Footer />` (or they come from layout)
4. Add the route to `src/app/sitemap.ts`
5. Write tests in `tests/` covering the new functionality

When adding data-heavy sections:
1. Define TypeScript interfaces and data arrays in `src/lib/`
2. Import into the page component — don't inline large data
3. Add unit tests for the data module
4. Add regression tests for key business rules
