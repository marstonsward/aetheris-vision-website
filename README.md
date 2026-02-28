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
