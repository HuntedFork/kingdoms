# script to execute when starting the django-admin shell command
# This script just helps debugging and doesnt have anything to do with starting the app.

# Notes: this script was leftover from iteration 1 of the website. I dont know how to use it anymore

import importlib
import sys

from django.contrib.auth.models import User
from django.core.cache import cache

from api.models import Kingdom, Card, Metric, Rating
from api.serializers import CardSerializer, KingdomSerializer

def reload():
    global Kingdom, Card, Metric, Rating, CardSerializer, KingdomSerializer
    importlib.reload(sys.modules['api.models'])
    from api.models import Kingdom, Card, Metric, Rating
    importlib.reload(sys.modules['api.serializers'])
    from api.serializers import CardSerializer, KingdomSerializer

print("Welcome back Forrest")
