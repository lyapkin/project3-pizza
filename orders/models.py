from django.db import models
from django.conf import settings


class Menu(models.Model):
	item = models.ForeignKey('Item', on_delete=models.CASCADE)
	section = models.ForeignKey('Section', on_delete=models.CASCADE)
	price = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
	large_price = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)

	class Meta:
		verbose_name_plural = 'menu'

	def __str__(self):
		return f'{self.section} - {self.item}'


class Item(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return f'{self.name}'


class Section(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return f'{self.name}'


class Order(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Dish(models.Model):
	order_number = models.ForeignKey('Order', on_delete=models.CASCADE)
	dish_type = models.CharField(max_length=30)
	name = models.CharField(max_length=30)
	section = models.CharField(max_length=30)
	usual_size_count = models.IntegerField()
	large_size_count = models.IntegerField()


class PizzaSetOrder(models.Model):
	dish = models.ForeignKey('Dish', on_delete=models.CASCADE)
	toppings = models.CharField(max_length=100)
	size = models.CharField(max_length=30)
	count = models.IntegerField()
