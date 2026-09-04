Feature: Browse Public Collections
  As a Hera user
  I want the flow "Browse Public Collections" to work
  So that the business behavior is validated

  Scenario: Browse Public Collections primary flow
    Given public collections endpoint available
    When user opens `/collections/public`
    And frontend renders loading skeleton
    And backend returns paginated public collections
    And user sees cards with title, metadata, and state badge
    And user paginates or opens a collection
    Then user can discover playable/interesting collections quickly

  Scenario: Browse Public Collections edge cases
    Given the user is in the same baseline context
    When empty response
    Then context-aware empty state with next action
