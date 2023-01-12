from rest_framework.decorators import api_view,authentication_classes,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from ..serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token

@api_view(['POST'])
@csrf_exempt
def create_user(request):
    username = request.data.get('username', None)
    password = request.data.get('password', None)
    email = request.data.get('email', None)

    if username and password and email:
       u = User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists()
       if not u:
          user=User.objects.create_user(username=username,
                                 email=email,
                                 password=password)
          login(request, user)
          return Response({"message":"user created"},status=status.HTTP_201_CREATED)
       else:
          return Response({"message":"user already exists"},status=status.HTTP_400_BAD_REQUEST)

    return Response({"message":"mising argunments"},status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@csrf_exempt
def login_user(request):
    username = request.data.get('username', None)
    password = request.data.get('password', None)

    if password and username:
       user = authenticate(request=request,
                                username=username, password=password)
       if not user:
        return Response({"message":"Invalid details"},status=status.HTTP_400_BAD_REQUEST)
       else:
        login(request, user)
        return Response({"message":"logged in"},status=status.HTTP_202_ACCEPTED)

    return Response({"message":"mising argunments"},status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def get_user(request):
    user=UserSerializer(request.user)
    return Response(user.data)

	