import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import { SITE } from "@/lib/constants";
import { publisherRef } from "@/lib/jsonld";
import {
  tiers,
  processSteps,
  sla,
  securityFeatures,
  includedFeatures,
  faqs,
  demos,
  maintenancePlans,
} from "@/lib/portfolio-data";
import { CheckIcon, ClockIcon, ShieldCheckIcon, CpuChipIcon, ArrowRightIcon, BoltIcon, LockClosedIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata = {
  title: `Website Development Portfolio | ${SITE.name}`,
  description:
    "AI-assisted website development for small businesses. Professional, fast, and affordable — delivered in 5–10 business days. View demo sites and pricing.",
  openGraph: {
    title: `Professional Websites Delivered in Days | ${SITE.name}`,
    description: "AI-accelerated website development for small businesses. Flat-rate pricing, Lighthouse 90+ scores, SSL A+ rated, full source code handoff. From $800.",
    type: "website",
  },
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#050505]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="mx-auto max-w-5xl px-6">

          {/* ── Hero ── */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 mb-8 backdrop-blur-sm">
              <BoltIcon className="h-3.5 w-3.5 mr-2 text-blue-400" />
              AI-Assisted · No Agency Markup · You Own the Code
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
              A Professional Website,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Delivered in Days.
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed font-light">
              Most small businesses are stuck with an outdated site or paying $5,000+ to an agency for something that takes months. I build fast, modern, mobile-first websites using AI-accelerated tooling — at a fraction of the cost, with a fraction of the wait.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="flex flex-col sm:flex-row gap-4 mb-24">
              <a
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Book a Free Discovery Call
              </a>
              <a
                href="#demos"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                See Example Sites <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </div>
          </FadeIn>

          {/* ── Trust bar ── */}
          <FadeIn delay={0.3}>
            <div className="mb-24 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6 rounded-xl border border-white/5 bg-white/[0.03] p-6">
              {[
                { icon: ClockIcon, label: "5–10 Day Delivery", sub: "Launch to Growth tiers" },
                { icon: CpuChipIcon, label: "AI-Accelerated Build", sub: "Human-reviewed & tested" },
                { icon: ShieldCheckIcon, label: "You Own Everything", sub: "Full source code handoff" },
                { icon: CheckIcon, label: "14-Day Bug Guarantee", sub: "Free fixes post-launch" },
                { icon: SparklesIcon, label: "Lighthouse 90+", sub: "Performance, SEO, A11y" },
                { icon: LockClosedIcon, label: "SSL A+ Rated", sub: "Qualys SSL Labs verified" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── Pricing ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">Simple, Flat-Rate Packages</h2>
            <p className="text-gray-400 mb-12 max-w-xl">No hourly billing surprises. You know the price before work begins.</p>
          </FadeIn>

          <div className="mb-24 grid gap-6 sm:grid-cols-3">
            {tiers.map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 0.1}>
                <div className={`relative flex flex-col h-full rounded-xl border p-6 ${tier.highlight ? "border-blue-500/60 bg-blue-950/20" : "border-white/8 bg-white/[0.03]"}`}>
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-0.5 text-xs font-bold text-white">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{tier.name}</p>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                      {tier.unit === "flat" && <span className="text-sm text-gray-500 mb-1">flat rate</span>}
                      {tier.unit === "quote" && <span className="text-sm text-gray-500 mb-1">on request</span>}
                    </div>
                    <p className="text-sm font-medium text-blue-400">{tier.tagline}</p>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed">{tier.description}</p>
                  <ul className="flex-1 space-y-2.5 mb-8">
                    {tier.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckIcon className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/book"
                    className={`block rounded-md py-2.5 text-center text-sm font-semibold transition-colors ${tier.highlight ? "bg-blue-500 text-white hover:bg-blue-400" : "border border-white/10 text-white hover:bg-white/5"}`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── Process ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">How It Works</h2>
            <p className="text-gray-400 mb-12 max-w-xl">Four steps from first call to live site.</p>
          </FadeIn>

          <div className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.08}>
                <div className="rounded-xl border border-white/8 bg-white/[0.03] p-6 h-full">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl font-bold text-white/10">{step.step}</span>
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">{step.time}</span>
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── SLA ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Service Commitments</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">What You Can Count On</h2>
            <p className="text-gray-400 mb-10 max-w-xl">These are commitments, not estimates.</p>
          </FadeIn>

          <FadeIn>
            <div className="mb-24 rounded-xl border border-white/8 bg-white/[0.03] divide-y divide-white/5">
              {sla.map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-6 py-4">
                  <span className="text-sm text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── Security & Backup ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Security &amp; Backup</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">Your Site Stays Up — Guaranteed</h2>
            <p className="text-gray-400 mb-12 max-w-xl">
              Every build includes production-grade security, automated backups, and a recovery plan. If your site goes down, turnaround is measured in hours, not weeks.
            </p>
          </FadeIn>

          <div className="mb-24 grid gap-6 sm:grid-cols-2">
            {securityFeatures.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-6">
                  <feat.icon className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="mb-1.5 font-semibold text-white">{feat.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                    {"link" in feat && feat.link && (
                      <a
                        href={feat.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Verify at ssllabs.com <ArrowRightIcon className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── Every Site Includes ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Included With Every Site</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">More Than Just a Pretty Page</h2>
            <p className="text-gray-400 mb-12 max-w-xl">
              Every build comes loaded with features that agencies charge extra for. Performance, legal compliance, SEO markup, and social media polish — all included.
            </p>
          </FadeIn>

          <div className="mb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {includedFeatures.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 0.06}>
                <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-6 h-full">
                  <feat.icon className="h-6 w-6 text-blue-400 shrink-0" />
                  <h3 className="font-semibold text-white">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── Demo Gallery ── */}
          <div id="demos">
            <FadeIn>
              <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Demo Sites</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">Explore Example Builds</h2>
              <p className="text-gray-400 mb-12 max-w-xl">
                Each demo is a fully functional site built to show range across industries and styles. These are real pages — click through and explore.
              </p>
            </FadeIn>
          </div>

          <div className="mb-24 grid gap-6 sm:grid-cols-2">
            {demos.map((demo, i) => (
              <FadeIn key={demo.slug} delay={i * 0.08}>
                <Link
                  href={`/portfolio/${demo.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] hover:border-blue-500/40 hover:bg-white/[0.05] transition-all"
                >
                  <div className={`h-32 bg-gradient-to-br ${demo.color} flex items-end p-4`}>
                    <span className="rounded border border-white/20 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                      {demo.industry}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-1.5 font-semibold text-white group-hover:text-blue-300 transition-colors">{demo.title}</h3>
                    <p className="flex-1 text-sm text-gray-400 leading-relaxed">{demo.desc}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300">
                      View demo <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* ── Maintenance Plans ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">Ongoing Support</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">Keep Your Site Running Smoothly</h2>
            <p className="text-gray-400 mb-12 max-w-xl">
              Optional monthly retainers for businesses that want ongoing updates, monitoring, and peace of mind. Cancel anytime.
            </p>
          </FadeIn>

          <div className="mb-24 grid gap-6 sm:grid-cols-2 max-w-3xl">
            {maintenancePlans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className="flex flex-col rounded-xl border border-white/8 bg-white/[0.03] p-6 h-full">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1.5 mb-6">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500 mb-1">/month</span>
                  </div>
                  <ul className="flex-1 space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckIcon className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/book"
                    className="block rounded-md border border-white/10 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                  >
                    Add to Any Plan
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── FAQ ── */}
          <FadeIn>
            <p className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-12 tracking-tight">Common Questions</h2>
          </FadeIn>

          <div className="mb-24 divide-y divide-white/5 rounded-xl border border-white/8">
            {faqs.map(({ q, a }) => (
              <FadeIn key={q}>
                <div className="px-6 py-6">
                  <h3 className="mb-2 font-semibold text-white">{q}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{a}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── CTA ── */}
          <FadeIn>
            <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-blue-950/40 to-black p-10 text-center">
              <h2 className="mb-3 text-3xl font-semibold text-white tracking-tight">Ready to get started?</h2>
              <p className="mb-8 text-gray-400 max-w-md mx-auto">
                Book a free 30-minute discovery call. No commitment, no sales pressure — just a conversation about what you need.
              </p>
              <a
                href="/book"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-10 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Book a Free Discovery Call
              </a>
              <p className="mt-4 text-xs text-gray-600">Or email directly: <a href={`mailto:${SITE.email}`} className="text-gray-400 hover:text-white transition-colors">{SITE.email}</a></p>
            </div>
          </FadeIn>

        </div>
      </main>

      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Website Development",
            provider: publisherRef,
            description:
              "AI-assisted website development for small businesses. Professional, mobile-first websites delivered in 5–10 business days with flat-rate pricing.",
            offers: [
              {
                "@type": "Offer",
                name: "Launch Package",
                price: "800",
                priceCurrency: "USD",
                description: "Up to 5 pages, mobile-first design, SSL A+ rated, Lighthouse 90+, delivered in 5 business days.",
              },
              {
                "@type": "Offer",
                name: "Growth Package",
                price: "1500",
                priceCurrency: "USD",
                description: "Up to 10 pages, booking integration, blog, schema markup, analytics, delivered in 10 business days.",
              },
            ],
            areaServed: "US",
            serviceType: "Web Development",
          }),
        }}
      />
    </div>
  );
}
