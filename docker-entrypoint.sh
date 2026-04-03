#!/bin/sh
set -e

echo "Rodando migrations do banco de dados..."
./node_modules/.bin/drizzle-kit push
echo "Migrations concluídas."

exec "$@"
