# Codex Lessons

Search this file by task keyword after a similar mistake. Do not load it routinely. Stable policy belongs in `AGENTS.md`; this file keeps only project-specific failure patterns.

## Workspace And Delivery

- **Git boundaries:** Check status in the repository being edited; use the workspace root only for root-owned files.
- **New files:** Stage files intentionally created by Codex. Never commit, amend, push, or rewrite history without explicit approval.
- **Instruction drift:** Root `AGENTS.md` owns shared policy. Project files add only local rules; update one source instead of copying changes everywhere.
- **Zeus scripts:** Durable Zeus deployment tooling belongs in `zeus/scripts/`; root copies are temporary only when requested.

## Investigation

- **Mongo inspection:** Try Python with `pymongo` before assuming `mongosh` is available.
- **Data origin:** Correlate IDs, timestamps, image names, payloads, and import/export artifacts before ruling a reported source in or out.
- **API pagination:** Inspect the actual DTO and an existing caller; Zeus question paging uses `totalElements` and `hasNext`, not assumed `totalPages`.

## Implementation

- **Athena and Hera:** Use Hera as a behavioral reference when useful, but do not couple products or add runtime dependencies.
- **Visual changes:** Confirm design-token values differ before claiming a size or color adjustment has visible effect.
- **Collection edits:** Metadata actions must not resend membership or publication state unless that action owns those fields.
- **Model changes:** Update explicit constructor call sites for new required fields; do not add compatibility overloads unless requested.
- **Zeus formatting:** Let Spotless format touched Java files with scoped `spotless:apply`, then inspect the diff. Do not run repository-wide apply for a focused change.
- **Windows Maven:** Use the known-good `mvn` or `cmd /c mvn` path on Windows; reserve `./mvnw` for Git Bash or Unix-like shells.

## Maintaining This File

- Add a lesson only after a recurring mistake or explicit user correction.
- Consolidate overlapping lessons and remove entries promoted into authoritative docs.
