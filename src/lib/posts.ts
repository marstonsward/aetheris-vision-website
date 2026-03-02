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
  {
    id: 3,
    slug: "richardson-turbulence-atmospheric-prediction",
    title: "Big Whorls Have Little Whorls: Turbulence and the Limits of Prediction",
    date: "Mar 1, 2026",
    category: "Operational Meteorology",
    author: {
      name: "Marston Ward",
      title: "Founder & Chief Meteorologist, Aetheris Vision",
      initials: "MW",
    },
    summary:
      "Lewis Fry Richardson's 1922 rhyme on energy cascades is still the most honest summary of atmospheric turbulence — and a reminder of why predicting it remains one of the hardest problems in applied meteorology.",
    readTime: "5 min read",
    content: `
> *Big whorls have little whorls*
> *That feed on their velocity,*
> *And little whorls have lesser whorls,*
> *And so on to viscosity.*
>
> — Lewis Fry Richardson, 1922

Richardson wrote that verse as a wry gloss on the Kolmogorov energy cascade — the process by which kinetic energy moves from large-scale atmospheric eddies down to molecular scales where it dissipates as heat. Over a century later, it remains the most accurate one-paragraph description of why turbulence is genuinely hard.

## Richardson's Forecast Factory

Richardson didn't just write poetry about the atmosphere. In 1922, he published *Weather Prediction by Numerical Process* — the first attempt to solve the equations of atmospheric motion by hand. His method was correct. His forecast was wrong by a factor of 200 in surface pressure tendency, mostly because he used unbalanced initial data.

He imagined a future "forecast factory": a spherical hall filled with 64,000 human computers, each solving a small section of the atmosphere in parallel, coordinated by a conductor at the center. The vision was absurd in 1922 and operational by 1955 when the first real NWP run executed on ENIAC. The forecast factory became a metaphor for numerical weather prediction itself.

What Richardson couldn't solve — and what remains unsolved in a strict sense — is turbulence.

## Why Turbulence Resists Prediction

Turbulence is not random. It is deterministic chaos: governed by the Navier-Stokes equations, sensitive to initial conditions, and computationally intractable at operationally relevant scales. The energy cascade Richardson described means that resolving turbulence accurately requires modeling structures orders of magnitude smaller than the grid cells of any practical forecast model.

The Richardson number (Ri) — also his contribution — quantifies the ratio of buoyant suppression to wind shear in a stratified fluid:

Ri = (g/θ)(∂θ/∂z) / (∂u/∂z)²

When Ri drops below 0.25, shear-driven turbulence becomes possible. This single dimensionless number underpins every aircraft turbulence forecast, every boundary layer parameterization, and every assessment of low-level wind shear for launch operations. It is elegant and it is limited — because it captures the onset condition, not the intensity, duration, or spatial structure of the turbulence that follows.

## The Operational Consequence

For defense aviation, clear-air turbulence (CAT) is a persistent threat at cruise altitudes where there are no visual cues and no radar return. CAT forms at jet stream boundaries, near mountain wave breaking, and in regions of strong upper-level divergence — often with minimal warning time.

Current operational tools — GTG (Graphical Turbulence Guidance), PIREP-based nowcasts, and ensemble spread diagnostics — do a reasonable job of identifying broad hazard regions but struggle with the fine-scale intensity structure that determines whether an encounter is uncomfortable or structurally significant. The verification statistics are honest about this. Probability of detection for moderate-or-greater turbulence hovers around 60–70% depending on altitude band and season.

For low-altitude rotary-wing operations — the regime most relevant to special operations and maritime support missions — boundary layer turbulence over complex terrain is even less well-predicted. Valley drainage flows, thermally-driven slope winds, and rotor zones behind ridgelines create hazard environments that no current operational model resolves adequately.

## Where AI Adds Skill — and Where It Doesn't

Machine learning approaches to turbulence prediction have shown genuine skill improvements over diagnostic algorithms in post-analysis settings. Neural networks trained on aircraft in-situ data (IAGOS, ACARS) and matched to model fields can learn composite signatures that precede CAT encounters with higher sensitivity than single-index diagnostics.

The limitation is interpretability. When a model flags a turbulence region, an operational forecaster needs to understand why — to assess whether the diagnosis is physically plausible or a spurious pattern match. Black-box predictions in high-consequence environments require a human meteorologist in the loop who understands the underlying dynamics.

This is not an argument against AI. It is an argument for augmentation: ML-derived turbulence probability fields displayed alongside traditional model diagnostics, with the forecaster providing the judgment layer that no training set fully captures.

## Richardson's Unfinished Problem

Richardson's forecast factory eventually became ECMWF, GFS, and the global NWP enterprise. His turbulence rhyme became the Kolmogorov -5/3 power law, LES parameterization schemes, and a century of turbulence research that has taken the problem from intractable to merely very hard.

The practical limit is not computational power — it is the irreducible sensitivity of chaotic systems to initial conditions at scales we cannot observe. At some forecast horizon, for some atmospheric feature, prediction becomes climatology. Knowing where that boundary is, and communicating it honestly to mission planners, is the core professional obligation of an operational meteorologist.

Richardson understood this. His forecast factory was not a claim of perfect prediction. It was a framework for doing the best possible with the information available — systematically, reproducibly, and with explicit uncertainty.

That remains the standard.
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
