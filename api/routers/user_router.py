from django.urls import path
from ..controllers.users_controller import create_user,get_user,login_user

urlpatterns = [
    path('register/',create_user),
    path('login/',login_user),
    path('',get_user)
]
