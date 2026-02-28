import { notFound } from "next/navigation";
import { posts, getPostBySlug } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Aetheris Vision`,
    description: post.summary,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 bg-[#050505] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1504608524841-42f1e38e80e0?q=80&w=2500"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.12] mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e1726]/60 via-black/90 to-black -z-10" />

        <div className="mx-auto max-w-3xl px-6">
          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition mb-10"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Insights
          </a>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm mb-4">
              <span className="font-medium text-blue-400">{post.category}</span>
              <span className="text-white/10">·</span>
              <span className="text-gray-500">{post.date}</span>
              <span className="text-white/10">·</span>
              <span className="text-gray-600">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.15]">
              {post.title}
            </h1>
            <p className="text-lg text-gray-400 font-light leading-relaxed border-l-2 border-blue-500/40 pl-4">
              {post.summary}
            </p>
          </div>

          <div className="h-px w-full bg-white/5 mb-12" />

          {/* Article Body */}
          <article className="prose prose-invert prose-lg max-w-none">
            {paragraphs.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl md:text-2xl font-semibold text-white mt-12 mb-4"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("**") && block.endsWith("**")) {
                return (
                  <p key={i} className="text-white font-medium mb-4">
                    {block.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (block.match(/^\d+\./)) {
                const items = block.split("\n").filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-3 text-gray-400 font-light leading-relaxed mb-6 ml-2">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s\*\*([^*]+)\*\*:/, (_, n) => n + ": ").replace(/^\d+\.\s/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p
                  key={i}
                  className="text-gray-400 font-light leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{
                    __html: block
                      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-200">$1</strong>')
                      .replace(/\n/g, "<br/>"),
                  }}
                />
              );
            })}
          </article>

          <div className="h-px w-full bg-white/5 mt-16 mb-10" />

          {/* CTA */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white font-medium mb-1">Ready to engage?</p>
              <p className="text-gray-500 text-sm font-light">
                We work with state and federal agencies through VOSB and 8(a) pathways.
              </p>
            </div>
            <a
              href="mailto:contact@aetherisvision.com"
              className="shrink-0 inline-flex h-10 items-center justify-center rounded-md bg-white px-6 text-sm font-medium text-black hover:bg-gray-200 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
