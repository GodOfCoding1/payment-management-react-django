from rest_framework.decorators import api_view,action,permission_classes
from rest_framework import routers, serializers, viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, User,TransactionSerilaizer
from .models import Transaction
from rest_framework import filters
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import logout
import json

def csrf(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['GET'])
def isLoggedin(request):
    if request.user.is_authenticated:
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_logout(request):
    logout(request)
    return Response(status=status.HTTP_200_OK)



@api_view(['GET'])
def ApiOverview(request):
    api_urls = {
        'all_transactions': '/',
        'Search by Category': '/?category=category_name',
        'Search by Subcategory': '/?subcategory=category_name',
        'add transaction': '/transaction (method:post)',
        'update transaction': '/transaction put',
        'delete transaction': '/transaction'
    }
  
    return Response(api_urls)
# ViewSets define the view behavior.

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    

class TransactionViewSet(viewsets.ViewSet):
  
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]


    def list(self, request):
        userData=UserSerializer(request.user)
        u_id=userData.data.get("id",None)

        res={}
        incoming=TransactionSerilaizer(Transaction.objects.filter(payee=u_id), many=True)
        outgoing=TransactionSerilaizer(Transaction.objects.filter(payers=u_id), many=True)
        res["incoming"]=incoming.data
        res["outgoing"]=outgoing.data
        
        return Response(res)

    def create(self, request):

        data=request.data
        data=dict(data)

        for i in data:
            data[i]= data[i][0] if len(data[i])<2 else data[i]
        payers = data.get('payers', None)

        if not payers:
            return Response({"message":"invalid payers"},status=status.HTTP_400_BAD_REQUEST)

        userData=UserSerializer(request.user)
        u_id=userData.data.get("id",None)
        payee=User.objects.get(id=u_id)
        data["payee"]=payee
        trans=TransactionSerilaizer()
        trans.create(validated_data=data)
            
        return Response({"message":"transaction succesfully created"},status=status.HTTP_201_CREATED)
    
    def partial_update(self, request, pk=None):
        trans=Transaction.objects.get(pk=pk)
        data=request.data
        trans.status=data.get("status")
        trans.save()
        return Response(status=status.HTTP_206_PARTIAL_CONTENT)

    def destroy(self, request, pk=None):
        trans=Transaction.objects.get(pk=pk)
        trans.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


	