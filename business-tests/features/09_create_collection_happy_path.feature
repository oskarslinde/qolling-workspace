Feature: Create New Collection
  As a Hera user
  I want the flow "Create New Collection" to work
  So that the business behavior is validated

  Scenario: Create New Collection primary flow
    Given user is logged in
    When user navigates to collection creation page/workflow
    And user fills name, description, and visibility
    And user submits form
    And backend creates collection
    And frontend confirms success and navigates to collection detail/list
    Then collection appears in user's collection list

  Scenario: Create New Collection edge cases
    Given the user is in the same baseline context
    When duplicate name
    Then validation error and suggestion
