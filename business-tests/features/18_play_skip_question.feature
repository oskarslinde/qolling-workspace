Feature: Skip Question in Play Flow
  As a Hera user
  I want the flow "Skip Question in Play Flow" to work
  So that the business behavior is validated

  Scenario: Skip Question in Play Flow primary flow
    Given skip feature enabled
    When player taps Skip on active question
    And frontend sends skip event
    And backend records skip
    And frontend loads next question while preserving session context
    Then session continues with next available question

  Scenario: Skip Question in Play Flow edge cases
    Given the user is in the same baseline context
    When skip quota reached
    Then show limit message
