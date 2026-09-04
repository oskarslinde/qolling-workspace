# Deployment Runbook

## Main Pipeline

Use the root pipeline when refreshing deployable artifacts:

```powershell
.\pipeline.sh
```

The pipeline prompts whether backend tests should run and whether Hera should
be built as a production bundle or started as a development server.

The pipeline first verifies that the configured MongoDB Atlas SRV record resolves, then owns Hera install/lint checks, Zeus formatting/unit tests, Swagger snapshot export, backend packaging, Docker Compose build, and Zeus startup. Set `MONGODB_DNS_CHECK_TIMEOUT_SECONDS` to override the five-second Atlas DNS preflight timeout.

Do not run standalone Swagger regeneration as a separate manual follow-up; the pipeline owns that export.

## Docker Compose

Start or rebuild the local/prod-like stack:

```powershell
docker compose --env-file .env.dev up --build
```

Start existing containers:

```powershell
docker compose --env-file .env.dev up
```

Run Zeus detached:

```powershell
docker compose --env-file .env.dev up -d zeus
```

## Health and Logs

Zeus health:

```powershell
curl http://localhost:8080/api/v1/actuator/health
```

Zeus logs are mounted at `zeus/logs` from `/app/logs` in the container.

## Production Notes

- CORS is controlled by `app.cors.allowed-origins` or `APP_CORS_ALLOWED_ORIGINS`.
- Public actuator exposure is limited to health.
- Secrets and provider credentials belong in environment configuration, not committed docs or code.
