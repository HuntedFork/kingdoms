FROM python:3.11.11

WORKDIR /app/

COPY ./server/requirements.txt /app/

RUN pip install -r requirements.txt
RUN pip install Werkzeug django-debug-toolbar

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo tini postgresql postgresql-client nginx supervisor

ENV DJANGO_SUPERUSER_USERNAME=fork
ENV DJANGO_SUPERUSER_EMAIL=admin@dominionkingdoms.net

COPY ./server /app/
COPY ./website/build /app/build

ENV PYTHONPATH=/app/
ENV DJANGO_SETTINGS_MODULE=conf.settings.prod

RUN DJANGO_SECRET_KEY=justforshow python manage.py collectstatic
COPY ./website/build/sets /app/media/sets
COPY ./website/build/cards /app/media/cards

RUN ln -s /app/nginx.conf /etc/nginx/sites-available/
RUN ln -s /app/nginx.conf /etc/nginx/sites-enabled/

EXPOSE 80
EXPOSE 8080

CMD ["supervisord", "-c", "/app/supervisor.conf"]
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

