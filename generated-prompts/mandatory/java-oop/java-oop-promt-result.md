Below is the structured topic analysis for **Java / OOP** based on your uploaded prompt.

# Java / OOP

## 1. Topic scope

This topic covers **object-oriented programming as applied in Java**, especially in backend and enterprise software.

It includes:

* Classes, objects, fields, methods
* Encapsulation
* Inheritance
* Polymorphism
* Abstraction
* Interfaces and abstract classes
* Method overriding and overloading
* Constructors
* Object identity vs equality
* Access modifiers
* Composition vs inheritance
* Immutability basics
* SOLID principles where directly tied to OOP design
* OOP usage in Spring Boot services, controllers, entities, DTOs, and repositories

It does **not** deeply cover:

* Java Collections API, except when used in examples
* JVM memory internals, except basic object/reference behavior
* Design patterns in full depth
* Functional programming in Java
* Reflection internals
* Advanced bytecode/proxy mechanisms
* Full domain-driven design

Boundary examples:

* `equals()` / `hashCode()` belongs partly to **Java / Object class** and **Java / Collections API**, but must be covered here because object equality is core OOP.
* Dependency injection belongs mainly to **Spring / Dependency Injection**, but OOP design choices like interfaces, abstractions, and composition are relevant here.
* SOLID belongs partly to **Software Design Principles**, but the OOP-specific parts should be included.

---

## 2. Why this topic matters for Java developers

OOP is one of the foundations of Java development. Even modern Spring Boot applications still rely heavily on classes, interfaces, objects, inheritance, encapsulation, and polymorphism.

### Daily coding relevance

A Java developer constantly works with:

* Service classes
* Controller classes
* Entity classes
* DTOs
* Mapper classes
* Repository interfaces
* Configuration classes
* Exception types
* Domain models

Poor OOP understanding leads to messy services, duplicated logic, fragile inheritance hierarchies, anemic models, and hard-to-test code.

### Production relevance

OOP decisions affect:

* Maintainability
* Testability
* Extensibility
* Coupling between modules
* Runtime behavior
* Serialization/deserialization
* ORM behavior
* API design
* Memory usage
* Debuggability

For example, a bad `equals()` implementation on an entity can break collections, caching, deduplication, and Hibernate/JPA behavior. Classic “small bug, large blast radius” energy.

### Interview relevance

OOP is tested often because it reveals whether a developer understands how Java code is structured and maintained in real projects.

Interviewers usually check:

* Whether the candidate understands the four OOP principles
* Whether they can explain abstraction clearly
* Whether they can choose interface vs abstract class
* Whether they understand overriding, overloading, and dynamic dispatch
* Whether they can identify bad inheritance
* Whether they can refactor procedural code into better object-oriented code

### Common failure points

Common weak areas include:

* Confusing overloading with overriding
* Misusing inheritance for code reuse
* Creating God classes
* Exposing mutable internal state
* Breaking encapsulation with public fields
* Not understanding runtime polymorphism
* Poor `equals()` / `hashCode()` implementations
* Using abstract classes when interfaces would be cleaner
* Making everything static
* Designing classes that are hard to unit test

---

## 3. Required knowledge areas

| Knowledge area                        |        Level | Type      | What the developer should know                                                                                                                                  |
| ------------------------------------- | -----------: | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Classes and objects                   |     Beginner | Both      | Understand that classes define structure/behavior and objects are runtime instances with state and methods.                                                     |
| Fields and methods                    |     Beginner | Practical | Know how object state is stored in fields and behavior is exposed through methods.                                                                              |
| Constructors                          |     Beginner | Both      | Understand default constructors, parameterized constructors, constructor chaining, initialization order basics, and why constructors should not do heavy logic. |
| Encapsulation                         |     Beginner | Both      | Hide internal state, expose controlled behavior, use private fields and meaningful methods instead of public mutable data.                                      |
| Access modifiers                      |     Beginner | Both      | Understand `private`, package-private, `protected`, and `public`, and how they affect API boundaries.                                                           |
| `this` keyword                        |     Beginner | Practical | Use `this` to refer to the current object, disambiguate fields, and call constructors.                                                                          |
| Static vs instance members            |     Beginner | Both      | Know the difference between class-level and object-level state/behavior, and why overusing static harms testability.                                            |
| Inheritance                           |     Beginner | Both      | Understand `extends`, parent/child relationships, inherited behavior, and why inheritance should model “is-a” relationships.                                    |
| Method overriding                     |     Beginner | Both      | Know how subclasses replace parent behavior, how `@Override` helps, and how dynamic dispatch works.                                                             |
| Method overloading                    |     Beginner | Both      | Understand same method name with different parameters and how compile-time resolution works.                                                                    |
| Polymorphism                          | Intermediate | Both      | Understand using a parent type or interface reference to work with different implementations.                                                                   |
| Abstraction                           | Intermediate | Both      | Model important behavior while hiding details; use abstractions to reduce coupling and support extension.                                                       |
| Interfaces                            | Intermediate | Both      | Define contracts, use default/static/private methods where appropriate, and understand multiple interface implementation.                                       |
| Abstract classes                      | Intermediate | Both      | Know when shared partial implementation or shared state justifies an abstract class.                                                                            |
| Interface vs abstract class           | Intermediate | Both      | Choose based on contract vs shared implementation/state, and understand API evolution tradeoffs.                                                                |
| Composition                           | Intermediate | Practical | Build behavior by combining objects instead of relying on deep inheritance hierarchies.                                                                         |
| Composition vs inheritance            | Intermediate | Both      | Prefer composition when reuse does not represent a true subtype relationship.                                                                                   |
| Object identity                       | Intermediate | Both      | Understand reference equality with `==`, identity, and object references.                                                                                       |
| Object equality                       | Intermediate | Both      | Understand `equals()`, `hashCode()`, and their contract.                                                                                                        |
| `Object` class methods                | Intermediate | Both      | Know `toString()`, `equals()`, `hashCode()`, `getClass()`, and basic implications.                                                                              |
| Immutability                          | Intermediate | Both      | Understand final fields, defensive copies, immutable value objects, and thread-safety benefits.                                                                 |
| Mutable state risks                   | Intermediate | Practical | Recognize bugs caused by exposing internal mutable collections or shared mutable state.                                                                         |
| Final classes, methods, and fields    | Intermediate | Both      | Understand how `final` prevents reassignment, overriding, or subclassing depending on usage.                                                                    |
| Sealed classes                        |     Advanced | Both      | Understand restricted inheritance with `sealed`, `permits`, `non-sealed`, and `final`. Useful in domain modeling and controlled hierarchies.                    |
| Records and OOP                       | Intermediate | Both      | Understand records as compact immutable data carriers and their limits.                                                                                         |
| Nested and inner classes              | Intermediate | Both      | Know basic use cases and avoid unnecessary complexity.                                                                                                          |
| Coupling and cohesion                 | Intermediate | Both      | Design classes with clear responsibilities and limited dependencies.                                                                                            |
| SOLID principles                      | Intermediate | Both      | Understand Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion in Java code.                               |
| Liskov Substitution Principle         |     Advanced | Both      | Understand why subclasses must preserve expected behavior of parent types.                                                                                      |
| Domain modeling                       | Intermediate | Practical | Represent business concepts as classes with meaningful behavior and invariants.                                                                                 |
| DTO vs entity vs domain object        | Intermediate | Practical | Understand different object roles in layered backend applications.                                                                                              |
| OOP in Spring Boot                    | Intermediate | Practical | Use controllers, services, repositories, configuration classes, and dependency injection with clean boundaries.                                                 |
| Proxies and inheritance limitations   |     Advanced | Both      | Know that frameworks like Spring may use proxies, which can affect final classes/methods and self-invocation behavior.                                          |
| Serialization/deserialization and OOP | Intermediate | Practical | Understand no-arg constructors, getters/setters, immutability, records, and JSON mapping concerns.                                                              |
| Testability of OOP design             | Intermediate | Practical | Design classes with injectable dependencies and small responsibilities.                                                                                         |

---

## 4. Practical skills

A developer should be able to:

* Create clear Java classes with fields, constructors, and methods.
* Apply encapsulation by hiding state and exposing meaningful behavior.
* Decide when to use an interface.
* Decide when to use an abstract class.
* Refactor inheritance-based reuse into composition.
* Explain the difference between overloading and overriding.
* Predict which overridden method will be called at runtime.
* Implement `equals()` and `hashCode()` correctly.
* Identify bugs caused by mutable objects used as map keys.
* Design immutable value objects.
* Avoid exposing mutable internal collections.
* Use `final` intentionally.
* Model domain concepts using classes and interfaces.
* Split large God classes into smaller cohesive classes.
* Use polymorphism to replace large `if/else` or `switch` blocks.
* Design service classes that are easy to unit test.
* Explain how Spring dependency injection benefits from interface-based design.
* Recognize when inheritance violates Liskov Substitution.
* Read OOP-heavy code and explain behavior.
* Debug object state issues caused by shared mutable references.
* Refactor procedural Java code into object-oriented design.
* Avoid static utility overuse when object behavior is more appropriate.

---

## 5. Common interview angles

### Conceptual questions

Common areas:

* What are the four main OOP principles?
* What is encapsulation and why does it matter?
* What is abstraction?
* What is the difference between abstraction and encapsulation?
* What is inheritance?
* What is polymorphism?
* What is the difference between overloading and overriding?
* What is dynamic dispatch?
* What is the difference between an interface and an abstract class?
* Why is composition often preferred over inheritance?
* What is the difference between `==` and `equals()`?
* What is the `equals()` / `hashCode()` contract?
* What does `final` mean for variables, methods, and classes?
* What is immutability?
* What are SOLID principles?
* What is the Liskov Substitution Principle?

### Code-reading questions

Usually tested through code that involves:

* Parent reference pointing to child object
* Overridden method calls
* Overloaded methods with different parameter types
* Static method hiding vs instance method overriding
* Constructor execution order
* Field shadowing
* `equals()` vs `==`
* Broken `hashCode()`
* Mutable object used as `HashMap` key
* Interface default methods
* Abstract class with partially implemented behavior
* `final` preventing override or reassignment

### Coding tasks

Good task types:

* Implement a small class hierarchy.
* Create a payment strategy using an interface.
* Refactor duplicate subclasses into composition.
* Implement immutable value object.
* Implement `equals()` and `hashCode()` for a domain object.
* Create a simple domain model with validation.
* Replace `if/else` logic with polymorphism.
* Create a service that depends on an interface and is easy to test.
* Model different notification senders: email, SMS, push.
* Model different discount calculation strategies.

### Debugging scenarios

Common scenarios:

* Overridden method not called as expected.
* Overloaded method selected unexpectedly.
* Object cannot be found in `HashSet` after mutation.
* Two objects look identical but `equals()` returns false.
* Subclass breaks parent class assumptions.
* Public mutable list causes external modification bug.
* Static shared state causes test pollution.
* Spring bean cannot be proxied due to final class/method.
* JSON deserialization fails due to constructor or missing accessors.
* Entity equality breaks after database ID assignment.

### System/design scenarios

Common scenarios:

* Design a payment processing module with multiple payment providers.
* Design notification handling with several delivery channels.
* Design a question-generation system with different question types.
* Design user scoring logic with replaceable strategies.
* Design backend validation rules without giant conditional blocks.
* Design domain entities and DTOs for a REST API.
* Decide whether to use inheritance, interface, or composition in a Spring Boot service.
* Refactor a large service class into smaller object-oriented components.
* Design extension points for future features without modifying core code.

---

## 6. Common mistakes and misconceptions

| Mistake                                               | Why it is wrong/risky                                                                 | Better approach                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Making fields public                                  | Breaks encapsulation and allows uncontrolled state changes.                           | Use private fields and expose controlled methods.                         |
| Creating getters/setters for everything automatically | Can produce anemic models and expose too much state.                                  | Expose behavior and only necessary data access.                           |
| Using inheritance only to reuse code                  | Creates fragile hierarchies and wrong “is-a” relationships.                           | Prefer composition for behavior reuse.                                    |
| Confusing overloading and overriding                  | Leads to wrong expectations about which method executes.                              | Remember overloading is compile-time, overriding is runtime polymorphism. |
| Forgetting `@Override`                                | Bugs may go unnoticed when method signatures do not actually override.                | Always use `@Override` for overridden methods.                            |
| Using `==` for object value comparison                | Compares references, not logical equality.                                            | Use `equals()` for value comparison.                                      |
| Overriding `equals()` but not `hashCode()`            | Breaks hash-based collections.                                                        | Override both together according to the contract.                         |
| Using mutable fields in `hashCode()`                  | Object may become unreachable in `HashMap`/`HashSet` after mutation.                  | Use immutable keys or stable identity fields.                             |
| Creating deep inheritance chains                      | Hard to understand, fragile, and difficult to change.                                 | Keep inheritance shallow; use composition.                                |
| Violating Liskov Substitution                         | Subclasses break behavior expected from parent type.                                  | Ensure subclasses preserve the parent contract.                           |
| Making everything static                              | Reduces testability, flexibility, and dependency injection compatibility.             | Use instance behavior and inject dependencies.                            |
| Exposing internal mutable lists                       | External code can modify object state unexpectedly.                                   | Return unmodifiable views or defensive copies.                            |
| Overusing abstract classes                            | Locks design into single inheritance and can create tight coupling.                   | Prefer interfaces unless shared implementation/state is needed.           |
| Treating interfaces as pointless wrappers             | Misses their value for abstraction, testing, and extension.                           | Use interfaces when multiple implementations or decoupling is useful.     |
| Putting business logic only in services               | Can create procedural service-heavy code.                                             | Put behavior in domain objects where appropriate.                         |
| Creating God classes                                  | Hard to test, maintain, and reason about.                                             | Split by responsibility and improve cohesion.                             |
| Ignoring framework proxy behavior                     | Final classes/methods or self-invocation can break Spring features.                   | Understand Spring proxy limitations.                                      |
| Assuming records replace all classes                  | Records are excellent data carriers but not always suitable for rich domain behavior. | Use records for simple immutable data, classes for richer behavior.       |

---

## 7. Real-world examples

### Spring Boot service abstraction

A payment service may depend on a `PaymentProvider` interface with implementations like:

* `StripePaymentProvider`
* `PayPalPaymentProvider`
* `BankTransferPaymentProvider`

This allows the service to use polymorphism instead of provider-specific `if/else` logic.

### REST API DTOs

A backend may use:

* `UserEntity` for database persistence
* `UserResponseDto` for API output
* `UpdateUserRequest` for input validation
* `User` domain object for business behavior

Understanding object roles prevents leaking database models directly through APIs.

### Question app domain model

A quiz application may model:

* `Question`
* `MultipleChoiceQuestion`
* `AnswerOption`
* `QuestionResult`
* `Difficulty`
* `QuestionCategory`

OOP helps keep validation and behavior close to the data.

### Notification system

Instead of:

```java
if (type.equals("EMAIL")) { ... }
else if (type.equals("SMS")) { ... }
else if (type.equals("PUSH")) { ... }
```

Use:

```java
interface NotificationSender {
    void send(Notification notification);
}
```

Then each sender has its own implementation.

### Database-backed systems

Entity equality can be tricky. If equality is based on database ID, behavior before persistence may differ from behavior after persistence. This matters in sets, caching, and ORM-managed collections.

### Microservices

OOP affects boundary design:

* Request DTOs
* Response DTOs
* Domain models
* Client abstractions
* Error models
* Retry policies
* Strategy objects for business rules

### Production debugging

Examples:

* A `HashSet` contains duplicate-looking users because `equals()` is not overridden.
* A `HashMap` cannot find a key after its field was changed.
* A Spring transactional method does not work because it is called from another method in the same class.
* A JSON mapper fails because an immutable class lacks a suitable constructor.
* Tests pass individually but fail together due to static mutable state.

---

## 8. Subtopics to generate questions for

| Subtopic                            | Description                                                                            |        Importance | Weight |
| ----------------------------------- | -------------------------------------------------------------------------------------- | ----------------: | -----: |
| Classes and objects                 | Basic structure of Java OOP: classes, instances, fields, methods.                      |         Mandatory |      5 |
| Constructors and initialization     | Constructors, constructor chaining, default constructors, initialization order basics. |         Mandatory |      4 |
| Encapsulation                       | Private state, controlled access, hiding implementation details.                       |         Mandatory |      5 |
| Access modifiers                    | `private`, package-private, `protected`, `public`, and API boundaries.                 |         Mandatory |      4 |
| Static vs instance                  | Class-level vs object-level state and behavior.                                        |         Mandatory |      4 |
| Inheritance                         | Parent-child relationships, `extends`, inherited behavior.                             |         Mandatory |      4 |
| Method overriding                   | Runtime polymorphism and replacing parent behavior.                                    |         Mandatory |      5 |
| Method overloading                  | Compile-time method selection with different parameters.                               |         Mandatory |      4 |
| Polymorphism                        | Using parent/interface types for multiple implementations.                             |         Mandatory |      5 |
| Abstraction                         | Modeling contracts and hiding implementation details.                                  |         Mandatory |      5 |
| Interfaces                          | Contracts, multiple implementations, default/static/private methods.                   |         Mandatory |      5 |
| Abstract classes                    | Partial implementation, shared state, template-style behavior.                         |         Mandatory |      4 |
| Interface vs abstract class         | Choosing the right abstraction mechanism.                                              |         Mandatory |      5 |
| Composition vs inheritance          | Design tradeoff between object collaboration and subclassing.                          |         Mandatory |      5 |
| Object identity vs equality         | `==`, references, logical equality.                                                    |         Mandatory |      5 |
| `equals()` and `hashCode()`         | Contracts and collection behavior.                                                     |         Mandatory |      5 |
| `Object` methods                    | `toString()`, `equals()`, `hashCode()`, `getClass()`.                                  |         Mandatory |      4 |
| Immutability                        | Immutable objects, final fields, defensive copies.                                     |         Mandatory |      4 |
| Mutable state risks                 | Shared mutable state, exposed collections, mutation bugs.                              |         Mandatory |      4 |
| `final` keyword in OOP              | Final fields, methods, classes.                                                        |         Mandatory |      3 |
| Records                             | Immutable data carriers and when to use them.                                          |          Optional |      3 |
| Sealed classes                      | Controlled inheritance hierarchies.                                                    | Advanced optional |      2 |
| Nested and inner classes            | Inner, static nested, anonymous classes.                                               |          Optional |      2 |
| Coupling and cohesion               | Class responsibility, dependency control, maintainability.                             |         Mandatory |      4 |
| SOLID principles                    | OOP design principles in Java.                                                         |         Mandatory |      4 |
| Liskov Substitution Principle       | Correct subtype behavior and inheritance safety.                                       |         Mandatory |      3 |
| OOP in Spring Boot                  | Controllers, services, repositories, dependency injection boundaries.                  |         Mandatory |      5 |
| Domain modeling                     | Representing business concepts and behavior.                                           |         Mandatory |      4 |
| DTO/entity/domain object separation | Different object roles in backend architecture.                                        |         Mandatory |      4 |
| Testability and OOP design          | Designing injectable, mockable, focused classes.                                       |         Mandatory |      4 |
| Framework/proxy limitations         | Spring proxy behavior, final methods/classes, self-invocation.                         | Advanced optional |      2 |

---

## 9. Difficulty progression

### Beginner

A beginner should know:

* What classes and objects are.
* How to define fields and methods.
* How constructors work.
* What encapsulation means.
* Why fields are usually private.
* What inheritance means.
* What interfaces are.
* Basic difference between overloading and overriding.
* Basic difference between `==` and `equals()`.
* How to create simple class hierarchies.

Beginner questions should focus on clear definitions and simple code-reading.

### Middle

A middle-level developer should know:

* How polymorphism works at runtime.
* When to use interface vs abstract class.
* Why composition is often better than inheritance.
* How to implement `equals()` and `hashCode()`.
* How mutable state causes bugs.
* How to design DTOs, entities, and services cleanly.
* How to refactor large classes.
* How to write testable object-oriented code.
* How Spring Boot uses OOP concepts.
* How SOLID principles apply in real Java code.

Middle-level questions should include practical design tradeoffs, code behavior, and refactoring.

### Senior

A senior developer should know:

* How OOP design affects architecture and long-term maintainability.
* How to avoid fragile inheritance hierarchies.
* How to model domain behavior cleanly.
* How to design extension points without overengineering.
* How framework behavior interacts with OOP design.
* How equality, identity, persistence, and serialization interact.
* How to evaluate whether a design is too abstract or too procedural.
* How to guide teams toward cleaner object boundaries.
* How to balance OOP with functional and procedural approaches where appropriate.

Senior questions should focus on design judgment, production tradeoffs, and failure analysis.

---

## 10. Must-have question themes

Essential themes for the final question suite:

* Difference between class and object in real Java code.
* How encapsulation prevents invalid object state.
* Why public fields are dangerous in backend models.
* Constructor behavior and initialization order basics.
* Difference between static and instance members.
* How inheritance works with parent and child classes.
* Why inheritance should model an “is-a” relationship.
* Difference between method overloading and method overriding.
* How Java chooses overloaded methods at compile time.
* How Java dispatches overridden methods at runtime.
* Interface vs abstract class decision-making.
* How polymorphism removes large conditional logic.
* Why composition is often safer than inheritance.
* How `==` differs from `equals()`.
* How `equals()` and `hashCode()` affect `HashMap` and `HashSet`.
* What breaks when mutable objects are used as map keys.
* How to design immutable value objects.
* How exposing mutable collections breaks encapsulation.
* How `final` changes class, method, and field behavior.
* How DTOs, entities, and domain objects differ.
* How OOP appears in Spring controllers, services, repositories, and beans.
* How dependency injection supports abstraction and testability.
* How Liskov Substitution violations appear in real code.
* How to identify and refactor God classes.
* How to replace procedural service logic with object collaboration.
* How bad OOP design causes production bugs.
* How records fit into modern Java OOP.
* How sealed classes restrict inheritance when appropriate.

---

## 11. Edge cases worth testing

Important edge cases and traps:

* `==` returning false for two logically equal objects.
* `equals()` overridden without `hashCode()`.
* `hashCode()` depending on mutable fields.
* Mutating an object after adding it to a `HashSet`.
* Overloaded method chosen differently than expected because of declared type.
* Overridden method called even when reference type is parent.
* Static methods hidden, not overridden.
* Field shadowing between parent and child classes.
* Constructor calling overridable methods.
* `protected` exposing more than intended.
* Returning a mutable internal list directly.
* Shallow immutability where final field points to mutable object.
* Inheritance hierarchy where child class cannot honor parent contract.
* Abstract class forcing unnecessary inheritance.
* Interface with too many unrelated methods.
* God service class with too many responsibilities.
* Static mutable state shared across tests or requests.
* Spring transactional method not applied due to self-invocation.
* Final class or method interfering with framework proxies.
* JSON deserialization failure for immutable class.
* Entity equality changing after persistence ID is assigned.
* Records used where richer behavior or controlled construction is needed.
* Lombok-generated `equals()` / `hashCode()` causing unexpected behavior.
* Circular dependencies caused by poor object design.
* Excessive abstraction with one interface for every class and no real benefit.

---

## 12. Related topics

| Related topic path                  | Relationship                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| Java / Object class                 | `equals()`, `hashCode()`, `toString()`, `getClass()` are central to object behavior.    |
| Java / Collections API              | Equality and hash code directly affect `HashMap`, `HashSet`, and collection behavior.   |
| Java / Generics                     | Interfaces, abstractions, and reusable object models often use generics.                |
| Java / Exceptions                   | Exception hierarchies are commonly designed with inheritance.                           |
| Java / Records                      | Modern Java feature related to immutable data carrier objects.                          |
| Java / Sealed classes               | Modern controlled inheritance feature.                                                  |
| Java / Functional programming       | Sometimes replaces or complements OOP strategies.                                       |
| Java / Concurrency                  | Mutable shared object state affects thread safety.                                      |
| JVM / Memory model                  | Object references, identity, and shared state relate to JVM behavior.                   |
| Spring / Dependency Injection       | Uses interfaces, classes, constructors, and object composition heavily.                 |
| Spring / AOP and proxies            | Proxy behavior can be affected by final classes, methods, and self-invocation.          |
| Spring / Transactions               | Transaction behavior can be affected by object boundaries and proxy calls.              |
| Persistence / JPA and Hibernate     | Entity identity, equality, constructors, proxies, and inheritance mapping are related.  |
| API Design / DTOs                   | OOP design affects request/response models and separation from entities.                |
| Software Design / SOLID             | SOLID principles are practical OOP design guidelines.                                   |
| Software Design / Design patterns   | Many patterns rely on interfaces, abstraction, polymorphism, and composition.           |
| Testing / Unit testing              | Testability depends heavily on class responsibility, dependencies, and abstraction.     |
| Architecture / Layered architecture | Controllers, services, repositories, domain objects, and DTOs depend on OOP boundaries. |

---

## 13. What not to ask

Usually avoid:

* Pure textbook questions with no Java relevance.
* Deep academic object theory.
* Obscure UML notation details.
* Memorizing every historical OOP language difference.
* Excessive focus on applets or outdated Java GUI inheritance examples.
* Questions about multiple inheritance in C++ unless comparing briefly to Java interfaces.
* Trivia about rarely used nested class combinations.
* Very obscure object initialization edge cases that never appear in normal backend work.
* Overly theoretical SOLID definitions without code or design context.
* Asking candidates to recite design patterns without applying them.
* Enterprise JavaBeans inheritance models unless specifically targeting legacy Java EE.
* Framework-specific proxy internals unless the role requires Spring expertise.
* Overly academic inheritance puzzles that do not reflect production code.
* Questions requiring exact bytecode knowledge for normal Java backend roles.
* Frontend-only OOP examples unrelated to Java/backend work.

---

## 14. Final structured summary

```json
{
  "topicPath": "Java / OOP",
  "importance": "Mandatory",
  "targetLevel": "All levels",
  "recommendedQuestionCountWeight": 5,
  "coreKnowledgeAreas": [
    "Classes and objects",
    "Fields and methods",
    "Constructors",
    "Encapsulation",
    "Access modifiers",
    "Static vs instance members",
    "Inheritance",
    "Method overriding",
    "Method overloading",
    "Polymorphism",
    "Abstraction",
    "Interfaces",
    "Abstract classes",
    "Interface vs abstract class",
    "Composition vs inheritance",
    "Object identity vs equality",
    "equals() and hashCode()",
    "Object class methods",
    "Immutability",
    "Mutable state risks",
    "final keyword",
    "Coupling and cohesion",
    "SOLID principles",
    "Liskov Substitution Principle",
    "OOP in Spring Boot",
    "DTO/entity/domain object separation",
    "Testability of OOP design"
  ],
  "practicalSkills": [
    "Create clear Java classes with fields, constructors, and methods",
    "Apply encapsulation to protect object state",
    "Choose between interface and abstract class",
    "Use polymorphism to remove conditional-heavy logic",
    "Refactor inheritance-based reuse into composition",
    "Implement equals() and hashCode() correctly",
    "Design immutable value objects",
    "Avoid exposing mutable internal state",
    "Model domain concepts using Java classes and interfaces",
    "Design Spring Boot services with clean dependencies",
    "Identify Liskov Substitution violations",
    "Refactor God classes into cohesive components",
    "Debug bugs caused by identity, equality, or shared mutable state"
  ],
  "mustHaveQuestionThemes": [
    "How encapsulation prevents invalid object state",
    "Difference between overloading and overriding",
    "How runtime polymorphism works in Java",
    "Interface vs abstract class tradeoffs",
    "Why composition is often preferred over inheritance",
    "How equals() and hashCode() affect hash-based collections",
    "What breaks when mutable objects are used as map keys",
    "How immutable value objects are designed",
    "How DTOs, entities, and domain objects differ",
    "How OOP appears in Spring Boot controllers, services, and repositories",
    "How dependency injection supports abstraction and testability",
    "How bad inheritance violates Liskov Substitution",
    "How to refactor procedural Java logic into object collaboration",
    "How framework proxies can interact with OOP design"
  ],
  "advancedOnlyAreas": [
    "Sealed classes",
    "Spring proxy limitations",
    "Entity equality with persistence lifecycle",
    "Constructor calls to overridable methods",
    "Deep Liskov Substitution analysis",
    "Framework interaction with final classes and methods"
  ],
  "relatedTopics": [
    "Java / Object class",
    "Java / Collections API",
    "Java / Generics",
    "Java / Exceptions",
    "Java / Records",
    "Java / Sealed classes",
    "Java / Concurrency",
    "JVM / Memory model",
    "Spring / Dependency Injection",
    "Spring / AOP and proxies",
    "Spring / Transactions",
    "Persistence / JPA and Hibernate",
    "API Design / DTOs",
    "Software Design / SOLID",
    "Software Design / Design patterns",
    "Testing / Unit testing",
    "Architecture / Layered architecture"
  ]
}
```
