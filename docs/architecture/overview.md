# Architecture Overview

Qolling is split into independently deployable repositories inside one workspace.

## Components

- Hera: Vite, React 18, React Router, Tailwind, Vitest, Testing Library.
- Athena: Vite, React 18, React Router, Tailwind, Vitest.
- Frontend Shared: publishable frontend packages for product-neutral configuration and future headless shared logic.
- Blog: standalone Astro site for the canonical public blog.
- Zeus: Java 17, Spring Boot 3, Spring Security, MongoDB, Maven wrapper, Springdoc OpenAPI.
- Business tests: Playwright project for browser-level flows.
- Task manager: local Node app that reads and writes Markdown task boards.
- Deployment: Docker Compose plus the root pipeline script.

## Runtime Flow

```mermaid
flowchart LR
  Browser --> Hera
  Browser --> Athena
  Browser --> Blog
  Hera --> Zeus
  Athena --> Zeus
  Zeus --> MongoDB
  Zeus --> "AI providers"
  Zeus --> "Email provider"
```

In local Docker Compose, Zeus exposes `http://localhost:8080`. Hera normally runs at `http://localhost:5173` during development and uses the `/api/v1` Zeus servlet path through the configured API base. Athena uses the same Zeus backend through its own frontend configuration. The blog is a separate public web surface and does not need Zeus for ordinary static page delivery.

## Main Domains

- Auth, OAuth, email verification, terms acceptance, and onboarding.
- Question authoring, drafts, moderation, images, likes, comments, and favorites.
- Feed/play flow, answer submission, skip handling, performance tracking, and personalization.
- Question collections and collection learning sessions.
- Friends, user discovery, in-app messages, and system messages.
- Admin AI question generation and batch generation.

## Ownership Boundaries

- Zeus is the source of backend behavior and API contracts.
- Hera and Athena each own their UI state, route behavior, visual system, and user-facing async states.
- `frontend-shared/` owns only product-neutral frontend packages that can be versioned independently.
- `blog/` owns the canonical public blog surface.
- OpenAPI/Swagger files are generated API truth; Markdown only documents intent, coordination rules, and important usage notes.
