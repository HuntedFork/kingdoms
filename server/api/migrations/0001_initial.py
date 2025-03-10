# Generated by Django 2.2.10 on 2020-10-01 00:47

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('name', models.CharField(max_length=100, primary_key=True, serialize=False, unique=True)),
                ('set', models.CharField(default='', max_length=100)),
                ('supply', models.BooleanField(default=True)),
                ('image_name', models.CharField(default='', max_length=100)),
                ('types', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=20), blank=True, size=None)),
            ],
        ),
    ]
