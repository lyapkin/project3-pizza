from django.contrib import admin
from .models import Menu, Item, Dish, PizzaSetOrder, Order

# Register your models here.
admin.site.register(Menu)
admin.site.register(Item)
admin.site.register(Dish)
admin.site.register(PizzaSetOrder)
admin.site.register(Order)
