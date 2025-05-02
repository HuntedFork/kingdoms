from rest_framework import viewsets, status, mixins, generics, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.core.exceptions import ValidationError
from django.core.cache import cache
import logging
logger = logging.getLogger(__name__)

from django.contrib.auth.models import User
from .serializers import CardSerializer, KingdomSerializer, MetricSerializer
from .models import Card, Kingdom, Rating, Metric

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all().order_by('name')
    serializer_class = CardSerializer
    permission_classes=[AllowAny]

    def list(self, request):
        search = self.request.query_params.get('search', None)
        queryset = Card.objects.all().order_by('name')
        if search:
            queryset = queryset.filter(name__icontains=search)
        serializer = CardSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        if not request.user.is_superuser:
            return Response('Not for you!', status=status.HTTP_401_UNAUTHORIZED)
        newCard = Card(
                        name=request.data.get("name"),
                        set=request.data.get("set"),
                        cost=request.data.get('cost', None),
                        types=request.data.get("types", []),
                        supply=request.data.get("supply", True),
                        landscape=request.data.get("landscape", False),
                        image_name=request.data.get("image_name")
                    )
        newCard.save()
        return Response(CardSerializer(newCard).data, status=status.HTTP_201_CREATED)
    
    def update(self, request):
        self.create(request)

class KingdomList(views.APIView):

    def get(self, request):
        username = request.query_params.get('user', None)
        queryset = Kingdom.objects.all().order_by('-score')
        if request.query_params.get('limit_self', None):
            if request.user.is_anonymous:
                return Response([], status=status.HTTP_200_OK)
            username = request.user
        if username:
            queryset = queryset.filter(user__username=username)
        if request.query_params.get('published', None):
            queryset = queryset.filter(published=True)
        sort = request.query_params.get('sort', None)
        if sort == 'date':
            queryset.order_by('-created', '-score')
        elif sort == 'name':
            queryset.order_by('name', '-score')
        else:
            queryset.order_by('-score', 'name')
        context = {'user': request.user} if not request.user.is_anonymous else {}
        queryset = KingdomSerializer.prefetch_related(queryset, context)
        serializer = KingdomSerializer(queryset, many=True, context=context)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.is_anonymous:
            return Response('You must be logged in to create a kingdom', status=status.HTTP_401_UNAUTHORIZED)
        shelters = True if request.data.get('shelters', False) else False
        prosperity = True if request.data.get('prosperity', False) else False
        newKingdom = Kingdom(
                                name=request.data.get("name"),
                                description=request.data.get("description", ''),
                                supply=request.data.get('supply'),
                                landscapes=request.data.get('landscapes'),
                                user=request.user,
                                shelters=shelters,
                                prosperity=prosperity
                            )
        try:
            newKingdom.full_clean() #run validation
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        newKingdom.save()
        metric_checkpoint()
        return Response(KingdomSerializer(newKingdom).data, status=status.HTTP_201_CREATED)

class KingdomDetail(generics.GenericAPIView):
    queryset = Kingdom.objects.all()
    serializer_class = KingdomSerializer

    def get(self, request, pk):
        kingdom = Kingdom.objects.get(pk=pk)
        context = {'user': request.user} if not request.user.is_anonymous else {}
        serializer = KingdomSerializer(kingdom, context=context)
        return Response(serializer.data, status=status.HTTP_200_OK)



    def put(self, request, pk):
        kingdom = Kingdom.objects.get(pk=pk)
        if request.user != kingdom.user:
            return Response("You don't have permission to modify this kingdom. Are you logged in?", status=status.HTTP_401_UNAUTHORIZED)
        kingdom.name = request.data.get("name", kingdom.name)
        kingdom.description = request.data.get("description", kingdom.description)
        kingdom.supply = request.data.get("supply", kingdom.supply)
        kingdom.landscapes = request.data.get("landscapes", kingdom.landscapes)
        kingdom.shelters = request.data.get("shelters", kingdom.shelters)
        kingdom.prosperity = request.data.get("prosperity", kingdom.prosperity)
        try:
            kingdom.full_clean() #run validation
        except ValidationError as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        kingdom.save()
        return Response(KingdomSerializer(kingdom).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        kingdom = Kingdom.objects.get(pk=pk)
        if request.user != kingdom.user:
            return Response("You don't have permission to modify this kingdom. Are you logged in?", status=status.HTTP_401_UNAUTHORIZED)
        kingdom.delete()
        return Response("Deleted successfully", status=status.HTTP_200_OK)

@api_view(http_method_names=['PUT'])
def RateKingdom(request, pk):
    if not request.user or request.user.is_anonymous:
        return Response("Anonymous users can't rate kingdoms. Sign up with an account!", status=status.HTTP_401_UNAUTHORIZED)
    rating = request.data.get('rating', None)
    if not isinstance(rating, int) or rating > 5 or rating < 1:
        return Response("A rating has to be between 1 and 5", status=status.HTTP_400_BAD_REQUEST)
    kingdom = Kingdom.objects.get(pk=pk)
    userRating = Rating.objects.filter(kingdom__id=kingdom.id, user__id=request.user.id).first()
    if userRating == None:
        userRating = Rating(rating=rating, user=request.user, kingdom=kingdom)
    userRating.rating = rating
    userRating.save()
    kingdom = Kingdom.objects.get(pk=pk) # Need to refresh score after rating change.
    context = {'user': request.user}
    metric_checkpoint()
    return Response(KingdomSerializer(kingdom, context=context).data, status=status.HTTP_200_OK)

def metric_checkpoint():
        # triggering metrics can be tricky in a world where the docker container is down when we try to hit the endpoint
        # Attach metric recording to something natural to get metrics to come out 
        try:
            record_custom_metrics()
        except Exception as e:
            logger.exception("New Relic is borked?")


@api_view(http_method_names=['POST'])
def RecordMetrics(request):
    return record_custom_metrics(request)

def record_custom_metrics(request=None):
    metrics = Metric(
                        accounts=User.objects.count(),
                        kingdoms=Kingdom.objects.count(),
                        published_kingdoms=Kingdom.objects.filter(published=True).count(),
                        ratings=Rating.objects.count()
                    )
    metrics.save()
    serializer = MetricSerializer(metrics)
    try:
        import newrelic.agent
        newrelic.agent.record_custom_metrics(serializer.to_new_relic())
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except ModuleNotFoundError as err:
        return Response(serializer.data, status=status.HTTP_200_OK)
