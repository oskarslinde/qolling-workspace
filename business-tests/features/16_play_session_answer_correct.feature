Feature: Play Session - Correct Answer Submission
  As a Hera user
  I want the flow "Play Session - Correct Answer Submission" to work
  So that the business behavior is validated

  Scenario: Play Session - Correct Answer Submission primary flow
    Given player has access to playable feed question
    When player opens `/play`
    And question loads with answer options
    And player selects correct option
    And player submits answer
    And backend confirms correctness and awards points/progress
    And frontend shows correct feedback and transitions to next question
    Then score/progress increases and UX remains responsive

  Scenario: Play Session - Correct Answer Submission edge cases
    Given the user is in the same baseline context
    When double click submit prevented while request is pending
    Then the system handles the condition gracefully
