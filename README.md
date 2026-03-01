# Aetheris Vision Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Development Workflow

When making changes to the website:

1. Edit the relevant files in `src/app/`
2. Test locally with `npm run dev` and visit [http://localhost:3000](http://localhost:3000)
3. Commit and push changes to GitHub
4. **Verify deployment**: After Vercel builds (usually 30–60 seconds), check status:

```bash
python3 scripts/vercel.py status
```

## Contact Form (Formspree)

The `/contact` page includes a structured intake form backed by [Formspree](https://formspree.io).

1. Sign up at [formspree.io](https://formspree.io) and create a new form.
2. Copy the form ID from the form's endpoint URL (e.g. `https://formspree.io/f/xpwzabcd` → `xpwzabcd`).
3. Add it to `.env.local`:

```bash
NEXT_PUBLIC_FORMSPREE_ID="xpwzabcd"
```

For Vercel production:

```bash
vercel env add NEXT_PUBLIC_FORMSPREE_ID production
```

If `NEXT_PUBLIC_FORMSPREE_ID` is not set, the form falls back to opening the user's mail client with `mailto:contact@aetherisvision.com`.

## Blog Subscription Setup

The blog page includes a subscription form component.

1. Create `.env.local` from `.env.example`.
2. Add a `NEXT_PUBLIC_BLOG_SUBSCRIBE_URL` value.
3. Set it to your provider endpoint (ConvertKit, Buttondown, Mailchimp form endpoint, etc.).

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_BLOG_SUBSCRIBE_URL="https://your-provider-endpoint"
```

If this variable is not set, the blog shows a fallback "Subscribe by Email" button that opens your mail client.

### Vercel deployment note (comments)

For production deployments on Vercel, set this variable in your Vercel project environment settings (Production/Preview/Development as needed). `.env.local` only affects local development.

```bash
vercel env add NEXT_PUBLIC_BLOG_SUBSCRIBE_URL production
```

## Blog Comments (Giscus)

Comments are supported on blog post pages via [Giscus](https://giscus.app).

1. Enable GitHub Discussions on the repository.
2. Configure Giscus and copy the values below.
3. Add these environment variables to `.env.local` (already included as placeholders in `.env.example`):

```bash
NEXT_PUBLIC_GISCUS_REPO="owner/repo"
NEXT_PUBLIC_GISCUS_REPO_ID="R_kgDO..."
NEXT_PUBLIC_GISCUS_CATEGORY="General"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_kwDO..."
```

If any required variable is missing, comments are automatically hidden.

### Vercel deployment note

For production deployments on Vercel, add the same `NEXT_PUBLIC_GISCUS_*` variables in your Vercel project environment settings. `.env.local` does not configure hosted deployments.

```bash
vercel env add NEXT_PUBLIC_GISCUS_REPO production
vercel env add NEXT_PUBLIC_GISCUS_REPO_ID production
vercel env add NEXT_PUBLIC_GISCUS_CATEGORY production
vercel env add NEXT_PUBLIC_GISCUS_CATEGORY_ID production
```

## Booking (Cal.com)

Consultation booking is embedded via [Cal.com](https://cal.com) on the `/book` page.

- Event URL: `https://cal.com/aetherisvision/30min`
- Component: `src/components/CalBooking.tsx`
- Page: `src/app/book/page.tsx`
- All "Engage Our Services" CTAs site-wide now link to `/book`

No environment variables are required — the Cal.com username and event slug are hardcoded in `CalBooking.tsx`.

### Adding or updating event types

1. Log into [cal.com/aetherisvision](https://app.cal.com) and create or edit an event type.
2. Update the `calLink` prop in `src/components/CalBooking.tsx` if the slug changes.
3. Commit and push; Vercel will redeploy automatically.

### Removing Cal.com branding

Upgrade to the Cal.com **Teams plan** ($12/month) in your Cal.com account settings to remove the "Powered by Cal.com" watermark on the hosted booking page.

## Vercel CLI Setup

The Vercel CLI must be authenticated and linked to the correct project to use `scripts/vercel.py`.

```bash
vercel login          # authenticate (opens browser)
vercel link --project aetheris-vision-website  # link this directory to the correct project
```

The `.vercel/` directory is gitignored. Re-run `vercel link` on any new machine or after deleting `.vercel/`.

## Vercel Management

Use `scripts/vercel.py` to manage the deployment without logging into the dashboard.
Requires the Vercel CLI to be installed and authenticated (`vercel login`).

```bash
# Check whether the site is live or paused
python3 scripts/vercel.py status

# Take the site offline (e.g. while company registration is pending)
python3 scripts/vercel.py pause

# Bring the site back online
python3 scripts/vercel.py resume
```

## Deploy on Vercel

The site deploys automatically on every push to `main` via the [Vercel GitHub integration](https://vercel.com/docs/deployments/git).
Node.js is pinned to `20.x` in `package.json` (`engines` field) for build compatibility.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment Checklist

Before pushing changes that affect blog subscription, comments, or booking:

1. Confirm Vercel environment variables are set (if using blog features):
   - `NEXT_PUBLIC_BLOG_SUBSCRIBE_URL`
   - `NEXT_PUBLIC_GISCUS_REPO`
   - `NEXT_PUBLIC_GISCUS_REPO_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
2. Ensure the variables are added to the correct Vercel environments (`Production`, `Preview`, and/or `Development`).
3. Deploy to Vercel and verify:
   - The subscription block appears on `/blog` and submits to the expected endpoint.
   - The comments section loads on blog post pages.
   - The `/book` page loads and displays the Cal.com calendar embed.
4. If values were changed in Vercel, trigger a redeploy so static pages pick up updated `NEXT_PUBLIC_*` values.

## Environment Health Check

Run this anytime to verify blog subscription/comments environment variables:

```bash
npm run check:env
```

`npm run build` now runs this check automatically and prints warnings if optional blog variables are missing.
