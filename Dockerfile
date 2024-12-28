FROM python:3.8.5

WORKDIR /app/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo postgresql postgresql-client

ENV DB_NAME=supply
ENV DB_USER=server
ENV DB_HOST=localhost

COPY ./server /app/
COPY ../website/build /app/build
RUN pip install -r requirements.txt
RUN pip install Werkzeug django-debug-toolbar

ENV PYTHONPATH=/app/
ENV DJANGO_SETTINGS_MODULE=conf.settings.prod

RUN DJANGO_SECRET_KEY=justforshow python manage.py collectstatic

EXPOSE 8080

RUN chmod +x ./runserver.sh
CMD ["bash", "./runserver.sh"]
