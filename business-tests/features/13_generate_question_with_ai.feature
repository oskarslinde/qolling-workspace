Feature: AI-Assisted Question Generation
  As a Hera user
  I want the flow "AI-Assisted Question Generation" to work
  So that the business behavior is validated

  Scenario: AI-Assisted Question Generation primary flow
    Given aI generation endpoint available
    When author opens AI generation page
    And author provides topic, difficulty, and optional constraints
    And author triggers generation
    And frontend displays loading state
    And aI response returns draft question + answers
    And author edits content for quality
    And author saves as new question
    Then author completes creation faster with retained editorial control

  Scenario: AI-Assisted Question Generation edge cases
    Given the user is in the same baseline context
    When aI timeout
    Then show retry CTA and preserve prompt
