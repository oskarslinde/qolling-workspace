Feature: View and Use Favorite Questions List
  As a Hera user
  I want the flow "View and Use Favorite Questions List" to work
  So that the business behavior is validated

  Scenario: View and Use Favorite Questions List primary flow
    Given user has previously favorited at least one question
    When user opens favorites route or tab
    And frontend requests favorite questions endpoint
    And favorites render in paginated list
    And user opens one item to view details/edit/play context
    Then favorites are discoverable and actionable

  Scenario: View and Use Favorite Questions List edge cases
    Given the user is in the same baseline context
    When empty favorites
    Then show encouragement to favorite content during play
