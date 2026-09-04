Feature: Edit Own Profile Information
  As a Hera user
  I want the flow "Edit Own Profile Information" to work
  So that the business behavior is validated

  Scenario: Edit Own Profile Information primary flow
    Given user authenticated and on own profile settings
    When user opens profile page
    And user edits bio/display metadata
    And user saves changes
    And backend persists update
    And frontend shows success confirmation
    Then new profile fields persist and are displayed across app

  Scenario: Edit Own Profile Information edge cases
    Given the user is in the same baseline context
    When validation fails for character limits
    Then inline error
