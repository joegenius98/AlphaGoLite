# Generated by Django 3.2.3 on 2021-05-21 23:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_room_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='board',
        ),
    ]