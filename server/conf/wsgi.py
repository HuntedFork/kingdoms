import os
import newrelic.agent
from django.core.wsgi import get_wsgi_application


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "conf.settings.prod")

# Technically this also starts the newrelic agent while developing locally
newrelic.agent.initialize('/app/newrelic.ini')


application = get_wsgi_application()
