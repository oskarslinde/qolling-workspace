Feature: Token Expiration During Active Session
  As a Hera user
  I want the flow "Token Expiration During Active Session" to work
  So that the business behavior is validated

  Scenario: Token Expiration During Active Session primary flow
    Given user is browsing protected page
    And token expires before next API call
    When user performs action requiring API request
    And backend responds with unauthorized/expired token
    And frontend opens token-expired modal
    And user confirms and is redirected to login
    And after relogin, user can continue from a safe entry point
    Then stale session is cleared
    And user receives explicit reason and next step

  Scenario: Token Expiration During Active Session edge cases
    Given the user is in the same baseline context
    When silent refresh succeeds
    Then modal never shown
