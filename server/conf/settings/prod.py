'''Use this for production'''

from .base import *
import os

DEBUG = False
ALLOWED_HOSTS += ['localhost', '127.0.0.1', 'dominionkingdoms.net', 'kingdoms-slhr255gcq-uw.a.run.app']
WSGI_APPLICATION = 'conf.wsgi.prod.application'

DATABASES = {
    'default': {
        #'ENGINE': 'django.db.backends.postgresql',
        'ENGINE': 'django_cockroachdb',
        "OPTIONS": {
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASS"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT")
        }
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


EMAIL_BACKEND = 'django_mailjet.backends.MailjetBackend'
MAILJET_API_KEY = os.getenv('MAILJET_USERNAME')
MAILJET_API_SECRET = os.getenv('MAILJET_PASS')
DEFAULT_FROM_EMAIL = 'noreply@dominionkingdoms.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
