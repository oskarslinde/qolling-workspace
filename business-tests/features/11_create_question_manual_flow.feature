Feature: Create Question Manually
  As a Hera user
  I want the flow "Create Question Manually" to work
  So that the business behavior is validated

  Scenario: Create Question Manually primary flow
    Given user has permission to create questions
    When author opens `/questions/create`
    And author enters prompt, answer options, and marks correct answer
    And author optionally adds explanation and metadata tags
    And author submits question
    And backend stores question in draft/pending state
    And frontend shows success and offers next action (create another / view question)
    Then new question is visible in "My Questions"

  Scenario: Create Question Manually edge cases
    Given the user is in the same baseline context
    When missing correct answer
    Then validation stops submit
