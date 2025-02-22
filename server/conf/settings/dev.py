'''Use this for development'''

from .base import *
import socket
import os

ALLOWED_HOSTS += ['127.0.0.1', 'localhost', 'testserver']
DEBUG = True

## Enables Debug Toolbar
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + '1' for ip in ips] + ['127.0.0.1', '10.0.2.2']
## END

WSGI_APPLICATION = 'conf.wsgi.dev.application'

DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.postgresql',
        'ENGINE': 'django_cockroachdb',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASS"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT")
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

CORS_ORIGIN_ALLOW_ALL = True
