# Generated by Django 3.0.6 on 2020-07-17 04:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_auto_20200716_0940'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pizzasetorder',
            name='topping_1',
        ),
        migrations.RemoveField(
            model_name='pizzasetorder',
            name='topping_2',
        ),
        migrations.RemoveField(
            model_name='pizzasetorder',
            name='topping_3',
        ),
    ]