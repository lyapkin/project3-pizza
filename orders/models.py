from django.db import models


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