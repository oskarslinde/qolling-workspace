Feature: Login Rejected Due to Wrong Credentials
  As a Hera user
  I want the flow "Login Rejected Due to Wrong Credentials" to work
  So that the business behavior is validated

  Scenario: Login Rejected Due to Wrong Credentials primary flow
    Given credentials entered are incorrect
    When user submits wrong email/password
    And backend returns unauthorized
    And frontend shows inline/global error without clearing email field
    And user retries with corrected credentials
    Then no authenticated session created on failure

  Scenario: Login Rejected Due to Wrong Credentials edge cases
    Given the user is in the same baseline context
    When multiple failed attempts trigger temporary lockout messaging
    Then the system handles the condition gracefully
