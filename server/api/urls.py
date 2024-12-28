from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'cards', views.CardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('kingdoms/', views.KingdomList.as_view()),
    path('kingdoms/<int:pk>/', views.KingdomDetail.as_view()),
    path('kingdoms/<int:pk>/rate/', views.RateKingdom),
    path('metrics/create/', views.RecordMetrics)
]
