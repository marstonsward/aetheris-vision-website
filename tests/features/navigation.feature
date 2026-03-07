Feature: Site Navigation
  As a visitor to the Aetheris Vision website
  I want navigation links to work correctly
  So that I can explore all sections of the site

  Scenario: All required pages appear in sitemap
    Given the sitemap is generated
    Then it should include the following paths:
      | path          |
      | /             |
      | /about        |
      | /capabilities |
      | /blog         |
      | /book         |
      | /contact      |

  Scenario: Blog posts appear in sitemap
    Given there are published blog posts
    When the sitemap is generated
    Then each blog post slug should have a sitemap entry

  Scenario: Robots.txt allows all crawlers
    Given the robots.txt is generated
    Then the user agent should be "*"
    And all paths should be allowed
