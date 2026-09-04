# Local Development Runbook

## Start the Stack

From the workspace root:

```powershell
docker compose --env-file .env.dev up --build
```

Expected targets:

- Hera: `http://localhost:5173`
- Zeus: `http://localhost:8080`
- Zeus health: `http://localhost:8080/api/v1/actuator/health`

## Hera

```powershell
cd hera
npm ci
npm run dev
```

Hera is npm-only; use the committed `package-lock.json` as the single lockfile.

Useful checks, run only when needed:

```powershell
npm run lint
npm run test:ui:report
```

## Zeus

Use the Maven wrapper when present:

```powershell
cd zeus
.\mvnw -DskipTests compile
```

Useful focused suites:

```powershell
.\mvnw -Punit-tests test
.\mvnw -Pspring-tests test
.\mvnw -Ptestcontainers-tests test
```

## Local OAuth

For `SPRING_PROFILES_ACTIVE=dev`, Zeus runs on HTTP at `http://localhost:8080`.

Set these in `.env.dev` before starting Docker Compose:

```text
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/api/v1/login/oauth2/code/{registrationId}
```

Google Cloud settings:

- Authorized JavaScript origin: `http://localhost:5173`
- Authorized redirect URI: `http://localhost:8080/api/v1/login/oauth2/code/google`

## Local Mongo Direction

Default local development should use local Docker Mongo rather than cloud Atlas; do not add runtime fallbacks that silently switch databases.
