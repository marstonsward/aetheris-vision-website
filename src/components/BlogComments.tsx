"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export default function BlogComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    if (!repo || !repoId || !category || !categoryId) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");

    containerRef.current.appendChild(script);
  }, [pathname]);

  if (!repo || !repoId || !category || !categoryId) {
    return null;
  }

  return (
    <section className="mt-14 rounded-xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 tracking-tight">
        Comments
      </h2>
      <div ref={containerRef} />
    </section>
  );
}