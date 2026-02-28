"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 z-50 h-10 w-10 rounded-full border border-white/10 bg-black/80 backdrop-blur-sm text-gray-400 hover:text-white hover:border-white/30 hover:bg-black transition-all flex items-center justify-center shadow-lg"
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
