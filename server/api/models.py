from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db.models import F
from django.db.models.signals import pre_save
from django.dispatch import receiver


class Card(models.Model):
    name = models.CharField(max_length = 100, unique=True, primary_key=True)
    set = models.CharField(max_length = 100, default='')
    cost = models.DecimalField(default = None, null=True, blank = True, max_digits = 5, decimal_places = 2)
    supply = models.BooleanField(default=True)
    landscape = models.BooleanField(default=False)
    image_name = models.CharField(max_length = 100, default='')
    types = ArrayField(models.CharField(max_length = 20), blank=True)

    def __str__(self):
        return self.name

def validate_card_exists(cardname):
    try:
        card = Card.objects.get(name=cardname)
    except:
        raise ValidationError(cardname + " is not a valid card")

class Kingdom(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    supply = ArrayField(models.CharField(max_length = 100, validators=[validate_card_exists]), default=list, blank=True)
    landscapes = ArrayField(models.CharField(max_length = 100, validators=[validate_card_exists]), default=list, blank=True)
    shelters = models.BooleanField(default=False)
    prosperity = models.BooleanField(default=False)

    #metadata
    sets = ArrayField(models.CharField(max_length=100), null=True, blank=True)
    published = models.BooleanField(default=False, db_index=True)
    score = models.IntegerField(default=0, db_index=True)
    created = models.DateTimeField(auto_now_add=True)

@receiver(pre_save, sender=Kingdom)
def add_kingdom_metadata(sender, instance, *args, **kwargs):
    #sets
    sets = set()
    for cardname in instance.supply + instance.landscapes:
        card = Card.objects.get(name=cardname)
        sets.add(card.set)
    sets = list(sets)
    instance.sets = sets
    #published
    if len(instance.supply) >= 10:
        instance.published = True


class Rating(models.Model):
    id = models.AutoField(primary_key=True)
    rating = models.IntegerField()
    kingdom = models.ForeignKey(Kingdom, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

def make_score(rating):
    if rating == 3:
        return 1
    elif rating == 4:
        return 2
    elif rating >= 5:
        return 3
    else:
        return 0

@receiver(pre_save, sender=Rating)
def update_kingdom_score(sender, instance, *args, **kwargs):
    old_rating = 0
    if instance.id != None:
        old_rating = Rating.objects.get(id=instance.id).rating
    score_change = make_score(instance.rating) - make_score(old_rating)
    if score_change != 0:
        instance.kingdom.score = F('score') + score_change
        instance.kingdom.save()

class Metric(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    accounts = models.IntegerField(default=0)
    kingdoms = models.IntegerField(default=0)
    published_kingdoms = models.IntegerField(default=0)
    ratings = models.IntegerField(default=0)
