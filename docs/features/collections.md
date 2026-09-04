# Collections

## Purpose

Collections let users group questions into curated learning paths, themed quizzes, or personal study sets. They bridge authoring, public discovery, moderation, and collection learning sessions.

## State Model

Zeus stores collection state as:

- `PRIVATE` - owner-only draft/private collection.
- `WAITING_APPROVAL` - pending admin review.
- `PUBLIC` - approved public collection.
- `REJECTED` - returned from review.

Hera normalizes user-facing collection state to:

- `DRAFT`
- `PENDING`
- `PUBLIC`

The API may accept aliases such as `PENDING` for `WAITING_APPROVAL`; Hera should keep using its normalization helper.

## Main Contracts

- `GET /question-collections/public?page=&size=&keyword=&state=&sort=`
- `GET /question-collections/my?page=&size=&keyword=&state=&sort=`
- `GET /question-collections/{id}`
- `GET /question-collections/{id}/play-questions`
- `GET /question-collections/admin/review?page=&size=&sort=`
- `POST /question-collections`
- `PUT /question-collections/{id}`
- `DELETE /question-collections/{id}`
- `POST /question-collections/{id}/questions`
- `DELETE /question-collections/{id}/questions/{questionId}`
- `POST /question-collections/{collectionId}/learning-sessions`
- `GET /question-collections/{collectionId}/learning-sessions/current`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/answer`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/next`
- `POST /question-collections/{collectionId}/learning-sessions/{sessionId}/end`
- `GET /question-collections/{collectionId}/learning-sessions/{sessionId}/results`

## Data Rules

- `questionCount` is stored membership count.
- `playableQuestionCount` is active, non-deleted playable count.
- Public learner-facing UI should prefer `playableQuestionCount`.
- Authoring and management UI can show `questionCount`.
- Soft-deleted collections are excluded from normal queries.
- Public submission requires the product-approved minimum collection size and complete metadata.

## Important Files

- Hera: `src/services/collectionService.js`, `src/utils/collectionStates.js`, collection pages and feature components.
- Zeus: `question/collection/**`, `question/collection/session/**`.
- Contract checks: generated Hera collection contracts and Zeus collection controller/service tests.
