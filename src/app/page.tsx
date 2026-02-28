import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Navbar Minimal */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo/aetheris-logo.svg" alt="Aetheris Logo" className="h-10 w-10 md:h-12 md:w-12" />
            <div className="text-xl md:text-2xl font-bold tracking-tight text-white">
              <span className="font-light text-gray-400">Aetheris</span>Vision
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-400">
            <a href="#expertise" className="hover:text-white transition">Expertise</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="mailto:contact@aetherisvision.com" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black -z-10" />
          
          <div className="mx-auto max-w-5xl px-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              VOSB, 8(a) Ready & Active Secret Clearance
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
              Predictive Clarity <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
                At The Highest Level.
              </span>
            </h1>
            
            <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light">
              Providing advanced AI/ML weather prediction algorithms, deep operational meteorology insight, and specialized technical consulting for state agencies and federal defense missions via 8(a) and VOSB pathways.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:contact@aetherisvision.com"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Engage Our Services
              </a>
              <a 
                href="#expertise"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-black px-8 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                View Expertise <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Expertise Grid */}
        <section id="expertise" className="py-24 bg-black border-t border-white/5">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-12">Core Competencies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 transition hover:bg-white/[0.04] hover:border-white/10">
                <div className="h-12 w-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center mb-6 text-xl">
                  🌍
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Operational Meteorology</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Over 35 years of global atmospheric modeling and operational forecasting, including strategic deployments across USAF and SMHI initiatives.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 transition hover:bg-white/[0.04] hover:border-white/10">
                <div className="h-12 w-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center mb-6 text-xl">
                  ⚙️
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3">AI / ML Integration</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  Pioneering machine learning techniques tailored for complex, large-scale meteorological datasets to increase predictive accuracy and mission readiness.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 transition hover:bg-white/[0.04] hover:border-white/10">
                <div className="h-12 w-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center mb-6 text-xl">
                  🏛️
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3">State & Federal Contracting</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  Specialized guidance for state agencies and federal programs. We maintain Active Secret Clearance and operate via VOSB and 8(a) ready pathways for simplified procurement.
                </p>
              </div>

              {/* Card 4 */}
              <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8 transition hover:bg-white/[0.04] hover:border-white/10">
                <div className="h-12 w-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center mb-6 text-xl">
                  📊
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-3">Technical Advisory</h3>
                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  Bridging the gap between deep environmental science (PhD level) and scalable software engineering architecture for government and enterprise.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 pb-24">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Aetheris Vision LLC. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 space-x-4">
            <span>Veteran-Owned Small Business (VOSB)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
