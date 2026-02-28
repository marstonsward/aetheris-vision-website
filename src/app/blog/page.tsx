import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Blog | Aetheris Vision",
  description: "Insights on AI, meteorology, and defense consulting from Aetheris Vision.",
};

const posts = [
  {
    id: 1,
    title: "The Future of AI in Operational Meteorology",
    date: "Feb 28, 2026",
    category: "AI / ML Integration",
    summary: "How deep-learning models are transforming raw satellite data into actionable mission-critical insights faster than traditional numerical weather prediction (NWP) models.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Navigating 8(a) and VOSB Pathways for Defense Contracts",
    date: "Jan 15, 2026",
    category: "Contracting",
    summary: "A strategic overview of how state and federal agencies can leverage Veteran-Owned Small Business (VOSB) statuses to streamline tech procurement and architecture advisement.",
    readTime: "4 min read",
  }
];

export default function BlogIndex() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Navbar Minimal */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <img src="/logo/aetheris-logo.svg" alt="Aetheris Logo" className="h-8 w-8 md:h-10 md:w-10" />
              <div className="text-xl font-bold tracking-tight text-white hidden md:block">
                <span className="font-light text-gray-400">Aetheris</span>Vision
              </div>
            </a>
          </div>
          <nav className="flex gap-4 md:gap-6 text-sm text-gray-400 items-center">
            <a href="/" className="hover:text-white transition flex items-center gap-1">
              <ArrowLeftIcon className="h-4 w-4" /> Home
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-24 bg-[#050505] relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1726]/40 via-black to-black -z-10" />
        
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-4">
              Insights & <span className="text-blue-500">Analysis</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
              Executive perspectives on atmospheric modeling, machine learning architecture, and technical defense contracting.
            </p>
          </div>

          <div className="grid gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10 cursor-pointer">
                <div className="md:w-48 shrink-0 text-sm text-gray-500 py-1 flex flex-col gap-1">
                  <span className="font-medium text-blue-400">{post.category}</span>
                  <span>{post.date}</span>
                  <span className="text-gray-600">{post.readTime}</span>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 font-light leading-relaxed mb-4">
                    {post.summary}
                  </p>
                  <div className="text-sm font-medium text-white inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article &#8594;
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Aetheris Vision LLC. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <span>Veteran-Owned Small Business (VOSB)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
