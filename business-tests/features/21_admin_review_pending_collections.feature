Feature: Admin Reviews Pending Collections
  As a Hera user
  I want the flow "Admin Reviews Pending Collections" to work
  So that the business behavior is validated

  Scenario: Admin Reviews Pending Collections primary flow
    Given admin role user authenticated
    And pending submissions exist
    When admin opens admin review page
    And frontend loads pending queue
    And admin opens submission details
    And admin approves or rejects with rationale
    And backend records decision
    And queue updates without full reload
    Then moderation decision is persisted and reflected in queue

  Scenario: Admin Reviews Pending Collections edge cases
    Given the user is in the same baseline context
    When submission already handled by another admin
    Then stale-state warning
