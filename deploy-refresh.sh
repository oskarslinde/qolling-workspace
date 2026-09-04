#!/usr/bin/env bash
set -euo pipefail
# Note: this flow does git pull and is intended for EC2-style remote deploys.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERA_DIR="${ROOT_DIR}/hera"
ZEUS_DIR="${ROOT_DIR}/zeus"

echo "[1/13] docker-compose stop"
cd "${ROOT_DIR}"
docker-compose stop

echo "[2/13] docker system prune -a -f"
docker system prune -a -f

echo "[3/13] cd hera && git pull"
cd "${HERA_DIR}"
git pull

echo "[4/13] npm install"
npm install

echo "[5/13] npm run build"
npm run build

echo "[6/13] sudo nginx -t"
sudo nginx -t

echo "[7/13] sudo systemctl reload nginx"
sudo systemctl reload nginx

echo "[8/13] back to root"
cd "${ROOT_DIR}"

echo "[9/13] cd zeus && git pull"
cd "${ZEUS_DIR}"
git pull

echo "[10/13] ./mvnw clean package -DskipTests"
./mvnw clean package -DskipTests

echo "[11/13] back to root"
cd "${ROOT_DIR}"

echo "[12/13] docker-compose --env-file .env build"
docker-compose --env-file .env build

echo "[13/13] docker-compose --env-file .env up"
docker-compose --env-file .env up
