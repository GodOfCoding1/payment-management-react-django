from django.db import models
import uuid
from django.contrib.auth.models import User

class Transaction(models.Model):
    class PayementStatus(models.TextChoices):
        COMPLETED = 'complete' 
        PENDING = 'pending'
        CANCELED = 'canceled'
        FAILED = 'failed'
    class PayementType(models.TextChoices):
        NORMAL = 'NO' 
        SPLIT = 'SP'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payee = models.ForeignKey(User, on_delete=models.CASCADE,related_name='payee')
    payers= models.ManyToManyField(User,related_name='payingUsers',blank=True)
    date_added = models.DateField(auto_now_add=True)
    #only works with inr
    about= models.CharField(default='',blank=True,null=True,max_length=100)
    type= models.CharField(max_length=2,choices=PayementType.choices, default=PayementType.NORMAL)
    category= models.CharField(default='',blank=True,null=True,max_length=100)
    status= models.CharField(max_length=10,null=True,choices=PayementStatus.choices, default=PayementStatus.PENDING)
    amount= models.IntegerField()
    def __str__(self):
        return str(self.id)