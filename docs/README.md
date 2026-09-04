# Qolling Documentation

This folder is the human-facing cross-project documentation root. Use it for durable project memory: why the system works the way it does, how to run it, how Hera and Zeus coordinate, and which rules matter across repositories.

Codex-only memory lives in [codex/](codex/).

## Start Here

- [Architecture overview](architecture/overview.md) - system shape and runtime flow.
- [Frontend sharing architecture](architecture/frontend-sharing.md) - package boundaries between Hera, Athena, and the public blog.
- [API contract map](reference/api-contract-map.md) - Hera service calls mapped to Zeus endpoints.
- [Documentation standards](reference/documentation-standards.md) - sorting, grouping, naming, and placement rules for all docs.
- [Product UX principles](product/ux-principles.md) - cross-project product and play-loop guidance.
- [Local development runbook](runbooks/local-dev.md) - common local setup and runtime commands.
- [Deployment runbook](runbooks/deploy.md) - pipeline and deployment notes.

## Feature Docs

- [Auth and onboarding](features/auth-and-onboarding.md)
- [Play flow](features/play-flow.md)
- [Collections](features/collections.md)
- [Messaging and friends](features/messaging-and-friends.md)
- [Question generation](features/question-generation.md)

## Project-Specific Docs

- [Hera frontend docs](../hera/docs/README.md)
- [Zeus backend docs](../zeus/docs/README.md)
- [Athena product docs](../athena/docs/README.md)
- [Frontend shared package docs](../frontend-shared/docs/README.md)
- [Blog docs](../blog/docs/README.md)
- [Business tests](../business-tests/README.md)

## Placement Rules

- Put cross-project product, architecture, runbook, or API coordination docs here.
- Put frontend-only rules in `hera/docs/`.
- Put backend-only rules in `zeus/docs/`.
- Put Codex-only shortcuts, lessons, and execution playbooks in `docs/codex/`.
- Do not manually duplicate generated truth such as OpenAPI specs, dependency lists, or full database schemas.
