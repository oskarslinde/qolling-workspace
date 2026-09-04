Feature: Admin Approves Pending Question
  As a Hera user
  I want the flow "Admin Approves Pending Question" to work
  So that the business behavior is validated

  Scenario: Admin Approves Pending Question primary flow
    Given question pending approval exists
    When admin opens question moderation queue
    And admin inspects question content, answers, metadata
    And admin approves the question
    And backend updates state to approved
    And frontend updates queue and shows result feedback
    Then approved question becomes available for downstream use (e.g., feed)

  Scenario: Admin Approves Pending Question edge cases
    Given the user is in the same baseline context
    When admin rejects with reason requiring author revision
    Then the system handles the condition gracefully
