build_server: 
	docker build -t kingdoms .

build_web:
	yarn --cwd website build

build: build_web build_server

interactive:
	docker run -it -e DJANGO_SECRET_KEY='somethingsilly' -e DJANGO_SETTINGS_MODULE='conf.settings.dev' -e DB_PASS='example' kingdoms bash

shell:
	docker compose exec server bash

run:
	docker compose up

migrate:
	docker compose run server make migrate

init:
	docker compose run server make init

# Use this command to make the server start without starting the server. Useful in combination with shell
idle:
	docker compose run server tail -f /dev/null

clean:
	docker container prune -f && docker compose down -v

push-prod: build
	docker tag kingdoms us.gcr.io/kingdoms-289503/kingdoms
	docker push us.gcr.io/kingdoms-289503/kingdoms

.PHONY: build run