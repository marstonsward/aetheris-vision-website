import { posts } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Blog | Aetheris Vision",
  description: "Insights on AI, meteorology, and defense consulting from Aetheris Vision.",
};

export default function BlogIndex() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />

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
              <a key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.04] hover:border-white/10 cursor-pointer no-underline">
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
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
