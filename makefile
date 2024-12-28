build:
	yarn --cwd website build && docker build -t kingdoms .

interactive:
	docker run -it -e DJANGO_SECRET_KEY='somethingsilly' -e DJANGO_SETTINGS_MODULE='conf.settings.dev' -e DB_PASS='example' kingdoms bash

shell:
	docker compose exec server bash

run:
	docker compose up

clean:
	docker compose down -v

.PHONY: build run