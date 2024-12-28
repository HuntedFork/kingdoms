# /etc/postgres/11/kingdoms MUST be a persistent file mount or else data will be wiped whenever the container changes

set -e # if any command  fails stop processing
set -x # print every command as we run it


# If uninitialized run intializtion
if [ ! -f /etc/postgresql/11/kingdoms/postgresql.conf ]; then
    mkdir -p /etc/postgresql/11/kingdoms /etc/postgresql/11/kingdoms/data /etc/postgresql/11/kingdoms/logs;
    touch /etc/postgresql/11/kingdoms/logs/log.txt
    pg_createcluster  -p 5432 -d /etc/postgresql/11/kingdoms/data -l /etc/postgresql/11/kingdoms/logs/log.txt --start 11 kingdoms
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    sudo -u postgres psql supply -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS'; GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO $DB_USER;"
    python manage.py migrate
    pg_ctlcluster 11 kingdoms stop # bring it down again so the rest of the script can work as expected.
fi;

pg_ctlcluster 11 kingdoms start

python manage.py runserver 0.0.0.0:8080

function cleanup()
{
    pg_ctlcluster 11 kingdoms stop
}

trap cleanup EXIT