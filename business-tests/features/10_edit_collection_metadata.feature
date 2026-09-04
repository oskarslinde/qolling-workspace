Feature: Edit Collection Metadata
  As a Hera user
  I want the flow "Edit Collection Metadata" to work
  So that the business behavior is validated

  Scenario: Edit Collection Metadata primary flow
    Given user owns target collection
    When owner opens collection edit screen
    And owner modifies metadata fields
    And owner saves changes
    And backend validates and persists update
    And frontend reflects updated metadata immediately
    Then edited values persist and are visible across refresh

  Scenario: Edit Collection Metadata edge cases
    Given the user is in the same baseline context
    When lost update conflict
    Then show conflict warning and refresh option
