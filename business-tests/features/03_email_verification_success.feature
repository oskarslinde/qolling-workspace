Feature: Email Verification with Valid Token
  As a Hera user
  I want the flow "Email Verification with Valid Token" to work
  So that the business behavior is validated

  Scenario: Email Verification with Valid Token primary flow
    Given user has an unexpired verification link
    When user clicks verification link from inbox
    And browser opens `/verify-email?token=<token>`
    And frontend sends token to verification endpoint
    And backend marks account verified
    And frontend displays success state and login CTA
    Then email verified flag is true
    And user is guided to next step clearly

  Scenario: Email Verification with Valid Token edge cases
    Given the user is in the same baseline context
    When token already used
    Then show idempotent success messaging
