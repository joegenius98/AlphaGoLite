# Generated by Django 3.2.3 on 2021-05-21 23:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_room_board'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='board',
        ),
    ]