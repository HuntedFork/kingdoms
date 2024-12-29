FROM python:3.11.11

WORKDIR /app/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo tini postgresql postgresql-client

ENV DB_NAME=supply
ENV DB_USER=server
ENV DB_HOST=localhost

ENV DJANGO_SUPERUSER_USERNAME=fork
ENV DJANGO_SUPERUSER_EMAIL=admin@dominionkingdoms.net

COPY ./server /app/
COPY ../website/build /app/build
RUN pip install -r requirements.txt
RUN pip install Werkzeug django-debug-toolbar

ENV PYTHONPATH=/app/
ENV DJANGO_SETTINGS_MODULE=conf.settings.prod

RUN DJANGO_SECRET_KEY=justforshow python manage.py collectstatic

EXPOSE 8080

RUN chmod +x ./runserver.sh
# tini lets the process intercept sigint b/c pid 1 processes are immune for some reason
CMD ["tini", "./runserver.sh"]
