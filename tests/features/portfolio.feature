Feature: Portfolio Pricing
  As a potential client reviewing Aetheris Vision services
  I want to see clear pricing tiers and maintenance plans
  So that I can choose the right service level

  Scenario: Three pricing tiers are available
    Given the portfolio data is loaded
    Then there should be exactly 3 pricing tiers
    And one tier should be highlighted as recommended

  Scenario: Every tier has pricing and features
    Given the portfolio data is loaded
    Then each tier should have a price
    And each tier should list at least 3 features

  Scenario: Maintenance plans are available
    Given the portfolio data is loaded
    Then there should be at least 2 maintenance plans
    And one maintenance plan should be highlighted

  Scenario: All included features are listed
    Given the portfolio data is loaded
    Then there should be at least 5 included features
