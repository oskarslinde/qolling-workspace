Feature: Feed Load Error and Retry Recovery
  As a Hera user
  I want the flow "Feed Load Error and Retry Recovery" to work
  So that the business behavior is validated

  Scenario: Feed Load Error and Retry Recovery primary flow
    Given initial feed request fails due to network/server issue
    When player opens play page
    And aPI call for next question fails
    And uI displays error section with retry action
    And player taps retry
    And second request succeeds
    And question panel renders normally
    Then user can recover without manual page refresh

  Scenario: Feed Load Error and Retry Recovery edge cases
    Given the user is in the same baseline context
    When repeated failures
    Then maintain deterministic error state without crash
