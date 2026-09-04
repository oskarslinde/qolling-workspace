Feature: Back Navigation Preserves Orientation
  As a Hera user
  I want the flow "Back Navigation Preserves Orientation" to work
  So that the business behavior is validated

  Scenario: Back Navigation Preserves Orientation primary flow
    Given user starts from a list screen and opens detail/edit page
    When user opens list page (collections/questions/etc.)
    And user opens a detail view
    And user clicks back control
    And app returns to prior list context with preserved filters/page when possible
    Then navigation feels SPA-consistent and predictable

  Scenario: Back Navigation Preserves Orientation edge cases
    Given the user is in the same baseline context
    When direct deep link detail page uses safe fallback route for back action
    Then the system handles the condition gracefully
