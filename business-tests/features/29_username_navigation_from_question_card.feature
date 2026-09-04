Feature: Navigate to Author Profile from Question Card
  As a Hera user
  I want the flow "Navigate to Author Profile from Question Card" to work
  So that the business behavior is validated

  Scenario: Navigate to Author Profile from Question Card primary flow
    Given question payload includes author id/username
    When user views question card/list item
    And user clicks author name/avatar
    And app routes to `/users/:id` profile page
    And user reviews author profile and optionally returns
    Then author attribution is navigable and reliable

  Scenario: Navigate to Author Profile from Question Card edge cases
    Given the user is in the same baseline context
    When missing author id
    Then fallback display without broken link
