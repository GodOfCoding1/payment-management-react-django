from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet,TransactionViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'transactions', TransactionViewSet, basename='transaction')

  
urlpatterns = [
    path('', views.ApiOverview, name='home'),
    path('auth/token',views.csrf),
    path('auth/isLoggedin',views.isLoggedin),
    path('auth/logout',views.user_logout),
    path('user/',include('api.routers.user_router')),
    path(r'', include(router.urls)),
]