# Generated by Django 4.1.5 on 2023-01-06 09:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date_added', models.DateField(auto_now_add=True)),
                ('amount', models.IntegerField()),
                ('payee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payee', to=settings.AUTH_USER_MODEL)),
                ('payers', models.ManyToManyField(blank=True, related_name='payingUsers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]