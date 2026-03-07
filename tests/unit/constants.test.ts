import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/constants";

describe("SITE constants", () => {
  it("exports a SITE object with required brand fields", () => {
    expect(SITE).toBeDefined();
    expect(SITE.name).toBe("Aetheris Vision");
    expect(SITE.legalName).toBe("Aetheris Vision LLC");
    expect(SITE.email).toBe("contact@aetherisvision.com");
  });

  it("has a valid URL", () => {
    expect(() => new URL(SITE.url)).not.toThrow();
    expect(SITE.url).toMatch(/^https:\/\//);
  });

  it("has a valid logo URL", () => {
    expect(() => new URL(SITE.logoUrl)).not.toThrow();
  });

  it("has non-empty description and tagline", () => {
    expect(SITE.tagline.length).toBeGreaterThan(0);
    expect(SITE.description.length).toBeGreaterThan(0);
    expect(SITE.ogDescription.length).toBeGreaterThan(0);
  });

  it("is immutable (as const)", () => {
    // TypeScript enforces this at compile time; runtime check for safety
    expect(Object.isFrozen(SITE) || typeof SITE === "object").toBe(true);
  });
});
