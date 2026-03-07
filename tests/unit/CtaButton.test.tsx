import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CtaButton from "@/components/CtaButton";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("CtaButton", () => {
  it("renders children text", () => {
    render(<CtaButton href="/contact">Get Started</CtaButton>);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders as a link for internal paths", () => {
    render(<CtaButton href="/portfolio">View Work</CtaButton>);
    const link = screen.getByText("View Work").closest("a");
    expect(link).toHaveAttribute("href", "/portfolio");
  });

  it("renders as a plain anchor for external URLs", () => {
    render(<CtaButton href="https://example.com">External</CtaButton>);
    const link = screen.getByText("External").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("renders as a plain anchor for mailto links", () => {
    render(<CtaButton href="mailto:test@example.com">Email Us</CtaButton>);
    const link = screen.getByText("Email Us").closest("a");
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("applies primary variant styles by default", () => {
    render(<CtaButton href="/test">Primary</CtaButton>);
    const el = screen.getByText("Primary").closest("a");
    expect(el?.className).toContain("bg-white");
    expect(el?.className).toContain("text-black");
  });

  it("applies secondary variant styles", () => {
    render(<CtaButton href="/test" variant="secondary">Secondary</CtaButton>);
    const el = screen.getByText("Secondary").closest("a");
    expect(el?.className).toContain("border");
    expect(el?.className).toContain("bg-black");
  });

  it("merges custom className", () => {
    render(<CtaButton href="/test" className="mt-4">Custom</CtaButton>);
    const el = screen.getByText("Custom").closest("a");
    expect(el?.className).toContain("mt-4");
  });
});
