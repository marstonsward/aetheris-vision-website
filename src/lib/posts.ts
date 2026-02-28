export type Author = {
  name: string;
  title: string;
  initials: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  readTime: string;
  content: string;
  featured?: boolean;
  author: Author;
};

export const posts: Post[] = [
  {
    id: 1,
    slug: "ai-in-operational-meteorology",
    title: "The Future of AI in Operational Meteorology",
    date: "Feb 28, 2026",
    category: "AI / ML Integration",
    featured: true,
    author: {
      name: "Marston Ward",
      title: "Founder & Chief Meteorologist, Aetheris Vision",
      initials: "MW",
    },
    summary:
      "How deep-learning models are transforming raw satellite data into actionable mission-critical insights faster than traditional numerical weather prediction (NWP) models.",
    readTime: "5 min read",
    content: `
For decades, Numerical Weather Prediction (NWP) has been the gold standard in operational meteorology. Atmospheric models like the GFS, ECMWF, and NAM have served forecasters well — but they carry a fundamental constraint: they are governed by equations of physics that require enormous computational resources and significant lead time to run.

Enter deep learning.

## The Shift to Data-Driven Forecasting

Models like Google DeepMind's GraphCast and Huawei's Pangu-Weather have demonstrated that transformer-based neural networks can produce skillful global forecasts at 0.25° resolution in under a minute — compared to hours for traditional NWP. This isn't a marginal improvement. It's a paradigm shift.

For defense and government applications, the implications are profound. Tactical field commanders don't have hours to wait for a model update. A rapid ingestion pipeline that takes raw satellite imagery and radar composites and outputs a 24-hour high-resolution probability forecast can change the calculus on mission timing, route planning, and hazard avoidance.

## Operational Constraints in High-Consequence Environments

Traditional NWP performs reasonably well under standard atmospheric conditions. It struggles in edge cases: rapid cyclogenesis, mesoscale convective organization, Arctic boundary layer inversions, and complex terrain interactions. These are precisely the environments where military and government operations frequently occur.

AI/ML models, trained on decades of global reanalysis data (ERA5, MERRA-2), learn statistical patterns that physics-based models miss. Ensemble approaches — running hundreds of perturbed initial conditions through a lightweight neural network — can quantify uncertainty in minutes rather than hours.

## Integration with Existing Infrastructure

At Aetheris Vision, we focus on where AI augments rather than replaces the operational forecaster. A human meteorologist with 35 years of experience reading synoptic patterns brings irreplaceable judgment. What we provide is a system that surfaces the 5% of cases where the models diverge most significantly — the high-uncertainty, high-consequence moments where that judgment matters most.

Integration pipelines built on Python, PyTorch, and cloud-native infrastructure (AWS GovCloud, Azure Government) allow agencies to ingest AI-derived products alongside traditional NWP guidance with minimal operational disruption.

## The Path Forward

The next 5 years will see AI-native weather prediction become the baseline expectation for high-tempo operations. Agencies that invest in the data pipelines, workforce training, and model validation frameworks now will have a decisive advantage. Those that wait will be adopting technology under pressure rather than on their terms.

Aetheris Vision is positioned to help government and defense clients navigate that transition — from architecture assessment through operational deployment.
    `.trim(),
  },
  {
    id: 2,
    slug: "8a-vosb-defense-contracts",
    title: "Navigating 8(a) and VOSB Pathways for Defense Contracts",
    date: "Jan 15, 2026",
    category: "Contracting",
    author: {
      name: "Marston Ward",
      title: "Founder & Chief Meteorologist, Aetheris Vision",
      initials: "MW",
    },
    summary:
      "A strategic overview of how state and federal agencies can leverage Veteran-Owned Small Business (VOSB) statuses to streamline tech procurement and architecture advisement.",
    readTime: "4 min read",
    content: `
The federal procurement landscape is vast, and for agencies seeking specialized technical consulting — particularly in niche domains like atmospheric modeling, AI integration, and defense systems — knowing how to structure an acquisition is as important as knowing what to acquire.

## Understanding VOSB and 8(a) Mechanisms

**Veteran-Owned Small Business (VOSB)** status provides set-aside and sole-source contracting authority under the Veterans First Contracting Program (38 U.S.C. § 8127). For acquisitions below the simplified acquisition threshold, a contracting officer can award directly to a VOSB without competition. Above that threshold, set-aside competitions among VOSBs allow agencies to meet both mission needs and socioeconomic contracting goals simultaneously.

**8(a) Business Development Program** eligibility — administered by the SBA — opens a separate channel entirely. Sole-source awards up to $4.5M (services) are available without competitive requirements. For agencies with urgent technical needs or specialized requirements that the open market cannot easily address, this is a powerful tool.

## Where Technical Consulting Fits

Many program offices default to large integrators for technical consulting because they're already on existing contract vehicles. This often results in overpaying for generalist support when what the mission requires is deep domain expertise. A small business with a narrow, credentialed specialization — 35 years of operational meteorology, active Secret clearance, demonstrated AI/ML capability — can deliver superior outcomes at a fraction of the cost through the right contracting mechanism.

## Practical Pathways for Contracting Officers

1. **Market research first**: Identify existing contract vehicles (GSA MAS, SEWP, SeaPort-NxG) where your target small business is registered.
2. **Validate socioeconomic status**: Confirm VOSB/SDVOSB certifications in SAM.gov and the SBA's VetCert database.
3. **Scope for set-aside**: If requirements can be scoped to a defined Statement of Work rather than an IDIQ, a simplified acquisition set-aside is faster and carries less administrative overhead.
4. **Document the justification**: For sole-source awards, the J&A (Justification and Approval) should reference unique technical qualifications and the urgency or specialized nature of the requirement.

## Aetheris Vision's Contracting Profile

We maintain active SAM.gov registration, VOSB certification, and are actively pursuing 8(a) pathway readiness. Our capabilities statement is available on request. For state agencies operating under state procurement code equivalents, we can work through cooperative purchasing vehicles or direct procurement depending on dollar threshold.

The goal is to remove friction from access to specialized expertise. The contracting mechanism should serve the mission — not the other way around.
    `.trim(),
  },
];

// ── Draft posts (not yet published) ──────────────────────────────────────────
//
// TODO: Turbulence / Richardson post
//
// Visual concept: full-width turbulence image (e.g. Karman vortex street satellite
// photo or LES simulation render) with Richardson's poem as an overlay or epigraph.
//
// Poem:
//   Big whorls have little whorls
//   That feed on their velocity,
//   And little whorls have lesser whorls
//   And so on to viscosity.
//   -- Lewis F. Richardson
//
// Possible angles:
//   • The poem as a lens on the turbulence closure problem in NWP
//   • Richardson's 1922 "Weather Prediction by Numerical Process" and its modern legacy
//   • How AI/ML is attacking the sub-grid turbulence parameterisation problem
//
// To publish: uncomment the entry below, add to the posts array above, and
// supply a turbulence background image URL.
//
// {
//   id: 3,
//   slug: "turbulence-richardsons-poem",
//   title: "Big Whorls Have Little Whorls",
//   date: "TBD",
//   category: "Atmospheric Science",
//   featured: false,
//   author: {
//     name: "Marston Ward",
//     title: "Founder & Chief Meteorologist, Aetheris Vision",
//     initials: "MW",
//   },
//   summary:
//     "Lewis Richardson's century-old poem captures something modern supercomputers still struggle to fully resolve. A look at turbulence, numerical weather prediction, and where machine learning enters the cascade.",
//   readTime: "7 min read",
//   content: `TODO`,
// },

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPrevNextPosts(slug: string): { prev: Post | null; next: Post | null } {
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

export function getCategories(): string[] {
  return Array.from(new Set(posts.map((p) => p.category)));
}
