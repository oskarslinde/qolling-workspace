Feature: Play Session - Incorrect Answer with Recovery
  As a Hera user
  I want the flow "Play Session - Incorrect Answer with Recovery" to work
  So that the business behavior is validated

  Scenario: Play Session - Incorrect Answer with Recovery primary flow
    Given player currently in active play session
    When player submits an incorrect answer
    And backend returns incorrect result payload
    And frontend shows incorrect feedback + explanation (if available)
    And player chooses continue/next
    And next question loads
    Then player is informed without punitive dead end

  Scenario: Play Session - Incorrect Answer with Recovery edge cases
    Given the user is in the same baseline context
    When explanation missing
    Then fallback copy shown
