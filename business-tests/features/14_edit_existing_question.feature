Feature: Edit Existing Question and Save
  As a Hera user
  I want the flow "Edit Existing Question and Save" to work
  So that the business behavior is validated

  Scenario: Edit Existing Question and Save primary flow
    Given question exists and is editable by user
    When owner opens `/questions/:id/edit`
    And existing values are loaded
    And owner updates text/options/explanation
    And owner submits changes
    And backend persists update and returns updated entity
    And frontend shows success toast and redirects to list/detail
    Then updated content is visible in play/preview contexts

  Scenario: Edit Existing Question and Save edge cases
    Given the user is in the same baseline context
    When unauthorized edit
    Then block with permission error state
