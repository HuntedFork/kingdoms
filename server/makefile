# This file exists to put commands on the server I can trigger using cloud run functions

# Password is whatever is in $DJANGO_SUPERUSER_PASSWORD
admin:
	python manage.py createsuperuser --username ${DJANGO_SUPERUSER_USERNAME} --email ${DJANGO_SUPERUSER_EMAIL} --noinput 

migrate:
	python manage.py migrate

init: migrate admin

.PHONY: admin init migrate