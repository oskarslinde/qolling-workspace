Feature: Logout from Global Navigation
  As a Hera user
  I want the flow "Logout from Global Navigation" to work
  So that the business behavior is validated

  Scenario: Logout from Global Navigation primary flow
    Given active authenticated session exists
    When user opens account/navigation menu
    And user clicks Logout
    And frontend clears tokens and auth state
    And user is redirected to public route/login
    Then user is fully signed out and private routes are blocked

  Scenario: Logout from Global Navigation edge cases
    Given the user is in the same baseline context
    When logout API call fails but local token clear succeeds (fail-safe local logout)
    Then the system handles the condition gracefully
