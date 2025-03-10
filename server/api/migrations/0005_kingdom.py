# Generated by Django 2.2.10 on 2020-10-22 03:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0003_card_cost'),
    ]

    operations = [
        migrations.CreateModel(
            name='Kingdom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('shelters', models.BooleanField(default=False)),
                ('prosperity', models.BooleanField(default=False)),
                ('cards', models.ManyToManyField(to='api.Card')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
