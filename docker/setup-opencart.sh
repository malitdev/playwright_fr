#!/usr/bin/env bash
# Downloads OpenCart, starts the Docker stack, installs OpenCart and seeds the test customer.
# Usage (repo root): bash docker/setup-opencart.sh
set -euo pipefail

OC_VERSION="${OC_VERSION:-4.1.0.4}"
APP_EMAIL="${APP_EMAIL:-pavanol@xyz.com}"
APP_PASSWORD="${APP_PASSWORD:-test@123}"
DB_ROOT_PASSWORD="root"
OC_DIR="/var/www/html/opencart/upload"
COMPOSE="docker compose -f docker/docker-compose.yml"

echo "==> Downloading OpenCart ${OC_VERSION}"
curl -fsSL -o /tmp/opencart.zip "https://github.com/opencart/opencart/releases/download/${OC_VERSION}/opencart-${OC_VERSION}.zip"
rm -rf opencart-src /tmp/oc-extract && mkdir -p /tmp/oc-extract opencart-src
unzip -q /tmp/opencart.zip -d /tmp/oc-extract
UPLOAD_SRC="$(find /tmp/oc-extract -maxdepth 3 -type d -name upload | head -n1)"
cp -r "$UPLOAD_SRC" opencart-src/upload

cp opencart-src/upload/config-dist.php opencart-src/upload/config.php
cp opencart-src/upload/admin/config-dist.php opencart-src/upload/admin/config.php
chmod -R 777 opencart-src/upload

echo "==> Starting containers"
$COMPOSE up -d --build --wait

echo "==> Installing OpenCart"
$COMPOSE exec -T web php "$OC_DIR/install/cli_install.php" install \
  --db_hostname db --db_username root --db_password "$DB_ROOT_PASSWORD" \
  --db_database openshop --db_driver mysqli --db_port 3306 \
  --username admin --password admin --email admin@example.com \
  --http_server "http://localhost/opencart/upload/"

rm -rf opencart-src/upload/install
chmod -R 777 opencart-src/upload

echo "==> Seeding customer ${APP_EMAIL}"
HASH="$($COMPOSE exec -T web php -r 'echo password_hash($argv[1], PASSWORD_DEFAULT);' "$APP_PASSWORD")"
$COMPOSE exec -T db mariadb -uroot -p"$DB_ROOT_PASSWORD" openshop -e "
SET SESSION sql_mode='';
INSERT INTO oc_customer (customer_group_id, store_id, language_id, firstname, lastname, email, telephone, password, status, date_added)
VALUES (1, 0, 1, 'Pavan', 'Kumar', '${APP_EMAIL}', '', '${HASH}', 1, NOW());"

echo "==> Waiting for the storefront"
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://localhost/opencart/upload/"; then echo "OpenCart is up"; exit 0; fi
  sleep 2
done
echo "OpenCart did not respond" >&2
$COMPOSE logs web | tail -30
exit 1
