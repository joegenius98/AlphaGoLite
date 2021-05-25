# Generated by Django 3.1.6 on 2021-05-22 02:21

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_room_board'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='guest_can_pause',
        ),
        migrations.RemoveField(
            model_name='room',
            name='votes_to_skip',
        ),
        migrations.AddField(
            model_name='room',
            name='num_spectators',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='room',
            name='player1',
            field=models.CharField(default=api.models.randomNameP1, max_length=50, unique=True),
        ),
        migrations.AddField(
            model_name='room',
            name='player1Color',
            field=models.CharField(default=api.models.pickRandomColor, max_length=7),
        ),
        migrations.AddField(
            model_name='room',
            name='player2',
            field=models.CharField(default=api.models.randomNameP2, max_length=50, unique=True),
        ),
        migrations.AddField(
            model_name='room',
            name='player2Color',
            field=models.CharField(default=api.models.pickRandomColor, max_length=7),
        ),
        migrations.AddField(
            model_name='room',
            name='spectatorArray',
            field=models.CharField(default='[]', max_length=275),
        ),
        migrations.AddField(
            model_name='room',
            name='turn',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='room',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]