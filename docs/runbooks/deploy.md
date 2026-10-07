# Deployment Runbook

This is the cross-project source for Qolling production infrastructure status. The Zeus server procedure is in the [Lightsail deployment guide](../../zeus/docs/deployment/lightsail.md).

## Current Production Topology

- **Hera:** Cloudflare Pages project `qolling-hera` deploys production on every commit to `main`. `https://qolling.com` is the production custom domain, and `www.qolling.com` is attached to the same Pages project. Cloudflare manages DNS; Namecheap remains the domain registrar.
- **Zeus:** runs as a pre-built Docker image on the `qolling-zeus` AWS Lightsail Ubuntu instance. MongoDB remains hosted by MongoDB Atlas.
- **Frontend API:** Hera production is built with `VITE_API_BASE_URL=https://api.qolling.com/api`, which produces API requests under `https://api.qolling.com/api/v1/...`.
- **Backend health:** `https://api.qolling.com/api/v1/actuator/health` is the public health-check target. The Lightsail container exposes the corresponding internal endpoint at `https://localhost:8443/api/v1/actuator/health`.

## Current CI and Delivery

GitHub Actions is the Zeus CI system:

- The test workflow runs the unit, Spring, Testcontainers, and combined coverage stages on pushes.
- On pushes to `main`, the container workflow builds and publishes `ghcr.io/oskarslinde/qolling-zeus` to GitHub Container Registry (GHCR), with both `latest` and commit-SHA tags.
- Lightsail only pulls the published image, restarts the Zeus container, and waits for its health check. It must not run Maven or build the image.

Deployment to Lightsail is currently a manual host-side step after image publication: run `deploy/deploy.sh` from `/opt/qolling/zeus`. GitHub Actions does not yet connect to the server or restart it remotely.

## Zeus Runtime Configuration

Copy `zeus/deploy/.env.example` to `/opt/qolling/zeus/.env` and set values only on the host. The required deployment configuration includes `SPRING_PROFILES_ACTIVE`, `MONGODB_URI`, `JWT_SECRET`, `APP_CORS_ALLOWED_ORIGINS`, `APP_OAUTH2_HERA_FRONTEND_BASE_URL`, `SSL_KEYSTORE_PASSWORD`, Google OAuth settings, and mail settings. The template also lists optional object-storage, AI, search, and provider settings.

Do not commit production `.env` files, MongoDB connection strings, JWT secrets, OAuth credentials, mail credentials, provider tokens, or GHCR credentials.

## Local Tooling

The root `pipeline.sh` and `docker-compose.yml` remain local validation and development tools. They are not production deployment mechanisms. Run the pipeline when its validation or Swagger export is required; do not run standalone Swagger regeneration.

For local Zeus health checks:

```powershell
curl http://localhost:8080/api/v1/actuator/health
```

## Remaining Migration Work

- Automate the Lightsail pull/restart only after a secure GitHub Actions-to-server delivery mechanism is established.
- Verify `api.qolling.com` uses a Lightsail Static IP and the intended Cloudflare DNS/proxy and HTTPS reverse-proxy configuration before treating that endpoint as fully migrated.
- Add `https://qolling.com` (and the final `www` origin when applicable) to the production CORS and OAuth frontend-origin settings; the committed template currently uses the Pages URL.

## Legacy Infrastructure

EC2 deployment scripts, AWS S3 frontend hosting, and AWS CodeBuild/ECR/ECS deployment paths are retired. They are not supported production options.
