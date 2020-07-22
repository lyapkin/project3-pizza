document.addEventListener('DOMContentLoaded', () => {

	const menu = document.getElementById('menu-wrapper');

	
	menu.addEventListener('click', (event) => {
		if (event.target.tagName === 'BUTTON') {
			const row = event.target.closest('tr');
			const prices = [];
			row.querySelectorAll('.price').forEach(price => prices.push(price.innerHTML));
			
			let product = {
				type: event.target.closest('table').firstElementChild.firstElementChild.firstElementChild.dataset.type,
				section: event.target.closest('table').firstElementChild.firstElementChild.firstElementChild.innerHTML,
				name: row.firstElementChild.innerHTML,
				price: prices,
				count: {
					usual: 1,
					large: 0
				}
			};

			if (product.name.includes('topping')) {
				const toppings = document.querySelectorAll('.topping-name');
				product.toppings = [];
				product.count.usual = 0;
				for (let topping of toppings) {
					product.toppings.push(topping.innerHTML);
				}
			}
			
			let productName = product.section + ' ' + product.name;
			productName = productName.toLowerCase().split(' ').join('_');
			
			product = JSON.stringify(product);
			localStorage[productName] = product;
		}
		
	});
	
});