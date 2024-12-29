#!/bin/bash
# /etc/postgres/15/kingdoms MUST be a persistent file mount or else data will be wiped whenever the container changes

function cleanup ()
{
    pg_ctlcluster 15 kingdoms stop
}
trap cleanup EXIT


set -e # if any command  fails stop processing
set -x # print every command as we run it


# If uninitialized run intializtion
#TODO: operationally this is kinda ass as a deploy strategy. 
# We cant run any of these commands individually without wiping the ENTIRE database. 
# So like, migrations are hella blocked until I figure something else out.
if [ ! -f /etc/postgresql/15/kingdoms/postgresql.conf ]; then
    mkdir -p /etc/postgresql/15/kingdoms /etc/postgresql/15/kingdoms/data /etc/postgresql/15/kingdoms/logs;
    touch /etc/postgresql/15/kingdoms/logs/log.txt
    pg_createcluster  -p 5432 -d /etc/postgresql/15/kingdoms/data -l /etc/postgresql/15/kingdoms/logs/log.txt --start 15 kingdoms
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    sudo -u postgres psql supply -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS'; GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO $DB_USER; ALTER DATABASE "$DB_NAME" OWNER TO $DB_USER;"
    python manage.py migrate
    python manage.py createsuperuser --username $DJANGO_SUPERUSER_USERNAME --email $DJANGO_SUPERUSER_EMAIL --noinput # Password is whatever is in $DJANGO_SUPERUSER_PASSWORD
    pg_ctlcluster 15 kingdoms stop # bring it down again so the rest of the script can work as expected.
fi;

pg_ctlcluster 15 kingdoms start

python manage.py runserver 0.0.0.0:8080
