Feature: Guest Blocked by Private Route Guard
  As a Hera user
  I want the flow "Guest Blocked by Private Route Guard" to work
  So that the business behavior is validated

  Scenario: Guest Blocked by Private Route Guard primary flow
    Given user not logged in
    When guest visits protected route URL directly
    And route guard checks auth state
    And guest is redirected to login page
    And original intended path is stored for post-login return
    Then no private data is leaked to guest

  Scenario: Guest Blocked by Private Route Guard edge cases
    Given the user is in the same baseline context
    When auth state loading
    Then spinner/skeleton shown briefly before redirect decision
