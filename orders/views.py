from django.http import HttpResponse
from django.shortcuts import render
from .models import Menu

# Create your views here.
def index(request):
    return render(request, 'orders/base.html')


def menu(request):
	menu = {
		'regular_pizza': Menu.objects.filter(section__name__contains='Regular pizza'),
		'sicilian_pizza': Menu.objects.filter(section__name__contains='Sicilian pizza'),
		'toppings': Menu.objects.filter(section__name__contains='Toppings'),
		'subs': Menu.objects.filter(section__name__contains='Subs'),
		'pasta': Menu.objects.filter(section__name__contains='Pasta'),
		'salads': Menu.objects.filter(section__name__contains='Salads'),
		'dinner_platters': Menu.objects.filter(section__name__contains='Dinner platters')
	}

	return render(request, 'orders/menu.html', {'menu': menu})