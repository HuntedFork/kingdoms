build_server: 
	docker build -t kingdoms .

build_web:
	yarn --cwd website build

build: build_server build_web

interactive:
	docker run -it -e DJANGO_SECRET_KEY='somethingsilly' -e DJANGO_SETTINGS_MODULE='conf.settings.dev' -e DB_PASS='example' kingdoms bash

shell:
	docker compose exec server bash

run:
	docker compose up

clean:
	docker container prune -f && docker compose down -v

.PHONY: build run