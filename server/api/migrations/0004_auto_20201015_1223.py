# Generated by Django 2.2.10 on 2020-10-15 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_card_cost'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='id',
        ),
        migrations.AlterField(
            model_name='card',
            name='name',
            field=models.CharField(max_length=100, primary_key=True, serialize=False, unique=True),
        ),
    ]