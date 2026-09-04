Feature: My Questions with Filters and Pagination
  As a Hera user
  I want the flow "My Questions with Filters and Pagination" to work
  So that the business behavior is validated

  Scenario: My Questions with Filters and Pagination primary flow
    Given user owns multiple questions in various states
    When user opens `/questions/me`
    And frontend loads paginated question list
    And user applies state/category filter
    And user navigates pagination controls
    And user opens specific question for edit/review
    Then user can quickly locate target question

  Scenario: My Questions with Filters and Pagination edge cases
    Given the user is in the same baseline context
    When filter yields zero results
    Then empty state with clear reset action
