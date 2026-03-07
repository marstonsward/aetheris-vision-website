Feature: Contact Form
  As a potential client visiting the Aetheris Vision website
  I want to submit a contact form
  So that I can reach the consulting team

  Scenario: Visitor submits a valid contact request
    Given the contact API is configured with Formspree
    When a visitor submits the form with name "Jane Doe" email "jane@agency.gov" and message "Need AI consulting"
    Then the submission should be forwarded to Formspree
    And the response status should be 200

  Scenario: Bot triggers the honeypot
    Given the contact API is configured with Formspree
    When a bot submits the form with the honeypot field filled
    Then the response status should be 200
    And the submission should not be forwarded to Formspree

  Scenario: Rate limiting kicks in after too many requests
    Given the contact API is configured with Formspree
    When 6 submissions come from the same IP address
    Then the 6th response status should be 429

  Scenario: Form configuration missing
    Given Formspree is not configured
    When a visitor submits the form with name "Test" email "test@test.com" and message "Hello"
    Then the response status should be 503
