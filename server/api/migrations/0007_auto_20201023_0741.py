# Generated by Django 2.2.10 on 2020-10-23 07:41

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20201022_0935'),
    ]

    operations = [
        migrations.AddField(
            model_name='kingdom',
            name='sets',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=100), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='kingdom',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
