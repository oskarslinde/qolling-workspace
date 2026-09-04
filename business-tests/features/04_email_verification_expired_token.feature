Feature: Email Verification Fails with Expired Token
  As a Hera user
  I want the flow "Email Verification Fails with Expired Token" to work
  So that the business behavior is validated

  Scenario: Email Verification Fails with Expired Token primary flow
    Given token is expired or malformed
    When user opens verification link
    And frontend attempts verification request
    And backend returns token invalid/expired error
    And frontend renders error state with option to request a new verification email
    Then user is not stuck; can recover account verification

  Scenario: Email Verification Fails with Expired Token edge cases
    Given the user is in the same baseline context
    When aPI unavailable
    Then show retry option with graceful fallback
