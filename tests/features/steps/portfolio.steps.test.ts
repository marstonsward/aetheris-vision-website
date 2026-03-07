import { describe, it, expect } from "vitest";
import {
  tiers,
  maintenancePlans,
  includedFeatures,
} from "@/lib/portfolio-data";

/**
 * BDD step definitions for portfolio.feature
 */

describe("Feature: Portfolio Pricing", () => {
  describe("Scenario: Three pricing tiers are available", () => {
    it("there should be exactly 3 pricing tiers", () => {
      expect(tiers).toHaveLength(3);
    });

    it("one tier should be highlighted as recommended", () => {
      const highlighted = tiers.filter((t) => t.highlight);
      expect(highlighted).toHaveLength(1);
    });
  });

  describe("Scenario: Every tier has pricing and features", () => {
    it("each tier should have a price", () => {
      for (const tier of tiers) {
        expect(tier.price).toBeTruthy();
      }
    });

    it("each tier should list at least 3 deliverables", () => {
      for (const tier of tiers) {
        expect(tier.deliverables.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe("Scenario: Maintenance plans are available", () => {
    it("there should be at least 2 maintenance plans", () => {
      expect(maintenancePlans.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Scenario: All included features are listed", () => {
    it("there should be at least 5 included features", () => {
      expect(includedFeatures.length).toBeGreaterThanOrEqual(5);
    });
  });
});
