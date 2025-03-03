FROM python:3.11.11

WORKDIR /app/

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        sudo tini postgresql postgresql-client

ENV DJANGO_SUPERUSER_USERNAME=fork
ENV DJANGO_SUPERUSER_EMAIL=admin@dominionkingdoms.net

COPY ./server /app/
COPY ./website/build /app/build

RUN pip install -r requirements.txt
RUN pip install Werkzeug django-debug-toolbar

ENV PYTHONPATH=/app/
ENV DJANGO_SETTINGS_MODULE=conf.settings.prod

RUN DJANGO_SECRET_KEY=justforshow python manage.py collectstatic
COPY ./website/build/sets /app/media/sets
COPY ./website/build/cards /app/media/cards

EXPOSE 8080

CMD ["gunicorn", "-w2", "conf.wsgi"]
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]

