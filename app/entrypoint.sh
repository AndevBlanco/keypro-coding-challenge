#!/bin/sh

echo "Waiting for the database to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

flask db init
flask db migrate
flask db upgrade

exec flask run --host=0.0.0.0
