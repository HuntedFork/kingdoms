# Generated by Django 2.2.10 on 2021-01-25 05:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_metric'),
    ]

    operations = [
        migrations.AddField(
            model_name='metric',
            name='ratings',
            field=models.IntegerField(default=0),
        ),
    ]