Feature: View Public User Profile
  As a Hera user
  I want the flow "View Public User Profile" to work
  So that the business behavior is validated

  Scenario: View Public User Profile primary flow
    Given target profile is public
    When user navigates to `/users/:userId`
    And frontend requests summary data
    And uI shows display name, stats, and badges
    And user navigates back to previous context
    Then profile data is displayed without exposing private details

  Scenario: View Public User Profile edge cases
    Given the user is in the same baseline context
    When user not found
    Then 404-style informative empty state
