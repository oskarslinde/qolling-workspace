Feature: Registration Blocked by Password Policy
  As a Hera user
  I want the flow "Registration Blocked by Password Policy" to work
  So that the business behavior is validated

  Scenario: Registration Blocked by Password Policy primary flow
    Given visitor is on `/register`
    When visitor types a short password lacking required complexity
    And uI displays unmet rules (length, uppercase, symbol, etc.)
    And visitor tries to submit
    And submit remains disabled (or validation message shown immediately)
    And visitor updates password to satisfy all rules
    And form becomes submittable
    Then invalid password never reaches backend
    And visitor gets deterministic, plain-language guidance

  Scenario: Registration Blocked by Password Policy edge cases
    Given the user is in the same baseline context
    When confirm password mismatch should block submit even when primary password is strong
    Then the system handles the condition gracefully
