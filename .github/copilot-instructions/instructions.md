# GitHub Copilot Instructions for Aetheris Vision Website

## Project Overview
This is a Next.js **16** website for Aetheris Vision, a technical consulting business specializing in AI, data science, and government contracting. The site features a dark theme with space/aether-inspired design elements.

## Code Style & Architecture
- **Framework**: Next.js **16.1.6** with App Router (NOT Next.js 15 — version was bumped during initial setup)
- **Styling**: Tailwind CSS v4 with custom dark theme
- **Language**: TypeScript
- **Structure**: Clean, component-based architecture
- **Design**: Dark mode first, responsive, professional consulting aesthetic

## Key Components
- **Navbar**: Fixed header with logo and navigation
- **Hero**: Atmospheric space background with gradient overlays
- **Expertise Grid**: Cards showcasing technical competencies
- **Philosophy Section**: Company values and approach
- **Blog**: Article listings with metadata
- **Footer**: Contact information and links

## Design Guidelines
- **Color Palette**: Black backgrounds, white/cyan gradients, gray text hierarchy
- **Typography**: Clean sans-serif, bold headings, light body text
- **Spacing**: Generous padding, consistent margins
- **Effects**: Subtle backdrop blur, gradients, glow effects on interactive elements
- **Responsiveness**: Mobile-first approach with md/lg breakpoints

## Content Focus
- **Tone**: Professional, technical, forward-thinking
- **Audience**: Government contractors, tech decision-makers
- **Key Terms**: VOSB, 8(a), Active Secret Clearance, AI/ML, Data Science
- **Branding**: Aetheris Vision - predictive clarity at the highest level

## Development Practices
- Use semantic HTML and accessibility best practices
- Maintain consistent component structure
- Optimize images and assets for web
- Follow Next.js best practices for performance
- Use TypeScript for type safety
- Keep code clean and well-commented

## File Organization
- `/src/app/`: Next.js app router pages
- `/src/components/`: Reusable React components
- `/public/`: Static assets (images, logos)
- `/public/logo/`: Brand assets
- `/src/styles/`: Global styles and Tailwind config

## Deployment
- **Platform**: Vercel
- **Domain**: aetherisvision.com
- **CI/CD**: Automatic deployment on GitHub push

## Known Issues & Environment Requirements
- **Node.js**: Must use Node **v20** via `nvm`. Node v25+ breaks Next.js (`semver` incompatibility). Run `source ~/.nvm/nvm.sh && nvm use` — `.nvmrc` pins v20 automatically.
- **next.config.ts**: The `eslint.ignoreDuringBuilds` key was removed in Next.js 16. The config is now clean with no keys.
- **SWC compiler**: On first install, `@next/swc-darwin-arm64` downloads to `~/Library/Caches/next-swc/`. If that directory is missing, the server silently crashes. Fix: `mkdir -p ~/Library/Caches/next-swc && npm install`.
- **No shared components yet**: Navbar and Footer are duplicated across `page.tsx` and `blog/page.tsx`. They must be extracted into `/src/components/Navbar.tsx` and `/src/components/Footer.tsx`.
- **Raw `<img>` tags**: External Unsplash images and the logo use raw `<img>` tags instead of Next.js `<Image>`. These should be migrated for LCP and layout shift improvements.
- **No mobile navigation**: The navbar hides all nav links below `md:` with no hamburger fallback.
- **Blog posts are stubs**: Blog post cards have `cursor-pointer` but no links or individual post pages exist yet.

## Business Context
- Company rebrand from previous identity
- Focus on government contracting and technical consulting
- Emphasis on security clearances and certifications
- Target markets: Federal government, defense, intelligence

## AI Assistance Guidelines
- Prioritize user experience and professional appearance
- Maintain brand consistency across all components
- Suggest improvements for accessibility and performance
- Help with responsive design implementations
- Assist with content creation for technical consulting context
- Recommend best practices for Next.js and Tailwind CSS