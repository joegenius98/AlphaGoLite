# Generated by Django 3.1.6 on 2022-01-03 23:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_room_host1'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='host1',
            field=models.CharField(default='NONE', max_length=50),
        ),
    ]
