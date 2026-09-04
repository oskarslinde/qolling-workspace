Feature: Create Question with Image Upload
  As a Hera user
  I want the flow "Create Question with Image Upload" to work
  So that the business behavior is validated

  Scenario: Create Question with Image Upload primary flow
    Given user logged in
    And supported file selected
    When author chooses image file
    And frontend validates size/type
    And image preview appears
    And author completes remaining fields and submits
    And backend stores question and image reference
    And frontend confirms success
    Then question retains linked image in read/edit views

  Scenario: Create Question with Image Upload edge cases
    Given the user is in the same baseline context
    When file too large
    Then immediate validation feedback
    And upload fails
    Then retry without losing text inputs
