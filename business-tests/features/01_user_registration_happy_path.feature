Feature: New User Registration (Happy Path)
  As a Hera user
  I want the flow "New User Registration (Happy Path)" to work
  So that the business behavior is validated

  Scenario: New User Registration (Happy Path) primary flow
    Given visitor is not logged in
    And registration page is reachable
    And email is not already used
    When visitor opens `/register`
    And visitor enters username, email, password, and confirm password
    And frontend validates password policy and field completeness in real time
    And visitor submits the form
    And frontend sends register request to backend
    And backend returns success and account record
    And frontend shows success feedback and redirects to login (or auto-login based on config)
    Then new account is persisted
    And user receives clear next step (verify email or login)

  Scenario: New User Registration (Happy Path) edge cases
    Given the user is in the same baseline context
    When email already exists
    Then inline error + keep entered values except password
    And weak password
    Then block submit with actionable helper text
    And network error
    Then toast/alert with retry CTA
