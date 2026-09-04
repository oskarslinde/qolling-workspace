Feature: Question Discovery via Search + Filters
  As a Hera user
  I want the flow "Question Discovery via Search + Filters" to work
  So that the business behavior is validated

  Scenario: Question Discovery via Search + Filters primary flow
    Given search API/filter parameters supported
    When user enters search keyword
    And user applies one or more filters (difficulty, category, state)
    And frontend issues debounced or explicit query request
    And result set updates
    And user paginates or resets filters
    Then users find relevant questions faster than manual browsing

  Scenario: Question Discovery via Search + Filters edge cases
    Given the user is in the same baseline context
    When no matches
    Then empty state with clear reset suggestion
