#!/usr/bin/env bash
set -euo pipefail
# Note: this flow does git pull and is intended for EC2-style remote deploys.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERA_DIR="${ROOT_DIR}/hera"
ZEUS_DIR="${ROOT_DIR}/zeus"
DEPLOY_DOCKERFILE="${ZEUS_DIR}/Dockerfile.deploy-refresh"
DEPLOY_COMPOSE_OVERRIDE="${ROOT_DIR}/docker-compose.deploy-refresh.yml"

cleanup() {
  rm -f "${DEPLOY_DOCKERFILE}" "${DEPLOY_COMPOSE_OVERRIDE}"
}

trap cleanup EXIT

echo "[1/15] docker-compose stop"
cd "${ROOT_DIR}"
docker-compose stop

echo "[2/15] docker system prune -a -f"
docker system prune -a -f

echo "[3/15] cd hera && git pull"
cd "${HERA_DIR}"
git pull

echo "[4/15] npm install"
npm install

echo "[5/15] npm run build"
npm run build

echo "[6/15] sudo nginx -t"
sudo nginx -t

echo "[7/15] sudo systemctl reload nginx"
sudo systemctl reload nginx

echo "[8/15] back to root"
cd "${ROOT_DIR}"

echo "[9/15] cd zeus && git pull"
cd "${ZEUS_DIR}"
git pull

echo "[10/15] ./mvnw clean package -DskipTests"
./mvnw clean package -DskipTests

echo "[11/15] create EC2 deploy-only Zeus Dockerfile"
cat > "${DEPLOY_DOCKERFILE}" <<'EOF'
FROM public.ecr.aws/amazoncorretto/amazoncorretto:17
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
EOF

echo "[12/15] create EC2 deploy-only compose override"
cat > "${DEPLOY_COMPOSE_OVERRIDE}" <<'EOF'
services:
  zeus:
    build:
      dockerfile: Dockerfile.deploy-refresh
EOF

echo "[13/15] back to root"
cd "${ROOT_DIR}"

echo "[14/15] docker-compose --env-file .env build"
docker-compose -f docker-compose.yml -f "${DEPLOY_COMPOSE_OVERRIDE}" --env-file .env build

echo "[15/15] docker-compose --env-file .env up"
docker-compose -f docker-compose.yml -f "${DEPLOY_COMPOSE_OVERRIDE}" --env-file .env up
