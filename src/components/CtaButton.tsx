import Link from "next/link";
import type { ReactNode } from "react";

interface CtaButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}

export default function CtaButton({
  href,
  variant = "primary",
  children,
  className = "",
}: CtaButtonProps) {
  const base = "inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:bg-gray-200"
      : "border border-white/10 bg-black text-white hover:bg-white/5";

  // External links or mailto
  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
