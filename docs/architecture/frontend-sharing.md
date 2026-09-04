# Frontend Sharing Architecture

Qolling frontends may reuse shared capabilities without becoming one inseparable application.

## Components

- `frontend-shared/`: publishable, product-neutral frontend packages.
- `hera/`: Qolling social-learning frontend with its own routes, shell, and design system.
- `athena/`: focused-learning frontend with its own routes, shell, and design system.
- `blog/`: standalone Astro site for the canonical public blog.

## Sharing Model

- Share configuration, endpoint builders, pure utilities, and headless feature logic.
- Keep environment lookup, routing, navigation, page shells, themes, and product copy inside each host app.
- Prefer shared logic with host-owned presentation over shared full pages.
- Do not make Hera and Athena import source directly from one another.

## Package Consumption

- Local workspace or file links are allowed as a development bridge while package boundaries are being proven.
- Independent CI and production deployments should consume versioned published packages.
- Shared packages must remain independently releasable so Hera and Athena can upgrade on different schedules.

## Blog Model

- The public blog is one canonical Astro site, not duplicate SPA routes inside Hera and Athena.
- Hera and Athena link to the canonical blog origin.
- Blog implementation and content configuration stay separate so future product-specific content variants can be supported without forking the codebase.

