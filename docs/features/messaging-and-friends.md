# Messaging and Friends

## Purpose

Messaging supports system-to-user updates, admin broadcasts, friend discovery, friend requests, and friend-only user messages.

## Main Contracts

Friend API:

- `POST /friends/requests` with `{ "receiverId": "<userId>" }`
- `POST /friends/requests/{requestId}/accept`
- `GET /friends/requests/pending`
- `GET /friends`
- `GET /friends/feed`

User discovery:

- `GET /users/search?username=<query>` returns up to 10 users and excludes the current user.
- `GET /users/{userId}/summary` resolves public profile display data.

Messaging API:

- `POST /messages/system` sends one admin-only system message.
- `POST /messages/system/broadcast` broadcasts an admin-only system message.
- `POST /messages` sends a user message to an accepted friend.
- `GET /messages/unread-count`
- `GET /messages/threads`
- `GET /messages/threads/{threadKey}`
- `POST /messages/threads/{threadKey}/read`
- `POST /messages/inbox/read`
- `GET /messages/inbox`

## Rules

- All endpoints require bearer JWT authentication except public profile summary where permitted by security config.
- System message send/broadcast requires admin role.
- User messages require accepted friendship; Zeus returns `FRIENDSHIP_REQUIRED` for friend-only violations.
- Hera should render system senders as `System` and resolve user display names through a cached profile summary lookup.
- Thread keys and the `SYSTEM` sender value must remain coordinated between Hera and Zeus.


## Important Files

- Hera: `src/pages/Messages*.jsx`, `src/pages/messages/**`, `src/services/messageService.js`, `src/services/socialService.js`.
- Zeus: `messaging/**`, `friend/**`, `user/profile/PublicUserProfileController.java`.
