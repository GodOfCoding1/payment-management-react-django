from rest_framework import serializers
from .models import Transaction
from django.contrib.auth.models import User

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email',"password")

class TransactionSerilaizer(serializers.ModelSerializer):
    payers=UserSerializer(many=True,read_only=True)
    payee=UserSerializer(read_only=True)
    class Meta:
        model=Transaction
        fields=("__all__")
        extra_kwargs = {'payers': {'required': False}}
    def create(self, validated_data):
        payers = validated_data.pop('payers') 
        transactions = Transaction.objects.create(**validated_data)
        transactions.payers.add(*payers)
        return transactions

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user