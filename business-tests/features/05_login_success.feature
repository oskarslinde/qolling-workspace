Feature: Login Success and Session Establishment
  As a Hera user
  I want the flow "Login Success and Session Establishment" to work
  So that the business behavior is validated

  Scenario: Login Success and Session Establishment primary flow
    Given user account exists and is verified
    When user navigates to `/login`
    And user enters valid credentials
    And user submits login form
    And frontend receives tokens/session payload
    And auth context stores session
    And user is redirected to post-login destination
    Then session state is available to private routes

  Scenario: Login Success and Session Establishment edge cases
    Given the user is in the same baseline context
    When optional remembered redirect to previously requested route
    Then the system handles the condition gracefully
