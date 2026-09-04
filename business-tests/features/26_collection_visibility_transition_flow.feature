Feature: Collection Visibility Transition (Private -> Public Review)
  As a Hera user
  I want the flow "Collection Visibility Transition (Private -> Public Review)" to work
  So that the business behavior is validated

  Scenario: Collection Visibility Transition (Private -> Public Review) primary flow
    Given owner has a private draft collection ready
    When owner opens collection management page
    And owner requests visibility change to public/review state
    And backend updates state to pending review
    And owner sees pending badge and informational message
    And admin later approves
    And collection appears in public catalog
    Then state machine is transparent to owner and admins

  Scenario: Collection Visibility Transition (Private -> Public Review) edge cases
    Given the user is in the same baseline context
    When rejection returns collection to editable private state with reason
    Then the system handles the condition gracefully
