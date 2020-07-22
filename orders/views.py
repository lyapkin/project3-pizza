from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import Menu, Order, Dish
import json

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


def cart(request):
	orders = Order.objects.filter(user=request.user)

	obj = []

	for order in orders:
		order_obj = {
			'number': order.id,
			'dishes': []
		}
		obj.append(order_obj)

		
		for dish in order.dish_set.all():
			dish_obj = {
				'section': dish.section,
				'name': dish.name,
				'sets': []
			}
			order_obj['dishes'].append(dish_obj)
			
			for pizza_set in dish.pizzasetorder_set.all():
				dish_obj['sets'].append({
						'toppings': pizza_set.toppings,
						'size': pizza_set.size,
						'count': pizza_set.count
					})
	
	return render(request, 'orders/cart.html', {'orders': obj})


def order(request):
	data = json.loads(request.body)
	order = Order(user=request.user)
	order.save()

	'''obj = {
		'number': order.id,
		'dishes': []
	}'''

	for product in data:
		dish = order.dish_set.create(dish_type=product['type'], name=product['name'], section=product['section'], usual_size_count=product['count']['usual'], large_size_count=product['count']['large'])
		'''obj['dishes'].append({
			'section': product['section'],
			'name': product['name']
			})'''
		dish.save()
		if 'sets' in product:
			for pizza_set in product['sets']:
				dish.pizzasetorder_set.create(toppings=', '.join(pizza_set['toppings']), size=pizza_set['size'], count=pizza_set['count']).save()
				#obj['dishes']['sets'] = product['sets']
	
	# return render(request, 'orders/made_orders.html', obj)
	return HttpResponseRedirect(reverse('cart'))