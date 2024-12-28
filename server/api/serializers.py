from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Prefetch

from .models import Card, Kingdom, Rating, Metric

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['name', 'set', 'cost', 'supply', 'landscape', 'image_name', 'types']

class KingdomSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Kingdom
        fields = ['pk', 'name', 'supply', 'user', 'landscapes', 'description', 'shelters', 'prosperity', 'sets', 'published', 'score', 'created']
    @staticmethod
    def prefetch_related(qs, context):
        #http://ses4j.github.io/2015/11/23/optimizing-slow-django-rest-framework-performance/
        new_qs = qs.select_related('user')
        user = context.get('user', None)
        if user:
            new_qs = new_qs.prefetch_related(
                Prefetch('ratings', queryset=Rating.objects.filter(user__id=user.id), to_attr='prefetched_ratings')
            )
        return new_qs
    def to_representation(self, instance):
        data = super(KingdomSerializer, self).to_representation(instance)
        user = self.context.get('user', None)
        if user:
            if hasattr(instance, 'prefetched_ratings'):
                user_rating = instance.prefetched_ratings[0] if len(instance.prefetched_ratings) else None
            else:
                user_rating = instance.ratings.filter(user__id=user.id).first()
            if user_rating != None:
                data['rating'] = user_rating.rating
        return data

class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = ['created', 'accounts', 'kingdoms', 'published_kingdoms', 'ratings']
    def to_new_relic(self):
        instance = self.instance
        metrics = [
            ('Custom/accounts', instance.accounts),
            ('Custom/kingdoms', instance.kingdoms),
            ('Custom/published', instance.published_kingdoms),
            ('Custom/ratings', instance.ratings)
        ]
        return metrics
