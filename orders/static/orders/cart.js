import {products} from './cart-classes.js';

document.addEventListener('DOMContentLoaded', () => {

	const wrapper = document.querySelector('.cart-orders');
	
	if (localStorage.length > 0) {
		for (let i = 0; i < localStorage.length; i++) {
			let key = localStorage.key(i);
			let item = localStorage[key];
			item = JSON.parse(item);
			const product = new products[item.type](item.section, item.name, key, item.count, item.price, item.sets);
			wrapper.append(product.toHTML());
		}
	} else {
		const text = document.createElement('p');
		text.innerHTML = 'No products in your cart';
		wrapper.append(text);
	}

	// To place an order
	const orderButton = document.getElementById('order-button');

	orderButton.addEventListener('click', (event) => {

		const productsToOrder = [];

		let orderTotalPrice = 0;

		const confirmWindow = document.createElement('div');

		for (let i = 0; i < localStorage.length; i++) {
			let key = localStorage.key(i);
			let item = localStorage[key];
			item = JSON.parse(item);

			if (item.count.usual + item.count.large > 0) {
				const product = {
					type: item.type,
					section: item.section,
					name: item.name,
					count: item.count
				};

				if (item.name.includes('topping')) {
					product.sets = item.sets;
				}

				productsToOrder.push(product);

				orderTotalPrice += Number( (item.price[0] * item.count.usual).toFixed(2) ) + Number( (( item.price[1] || 0 ) * item.count.large).toFixed(2) );
				
				confirmWindow.insertAdjacentHTML('afterbegin', `<div>${item.section}: ${item.name}. Usual: ${item.count.usual}, Large: ${item.count.large}</div>`);
			}
		}

		confirmWindow.insertAdjacentHTML('beforeend', `<p>Total price: ${orderTotalPrice}</p>`)

		const confirmButton = document.createElement('button');
		confirmButton.innerHTML = 'Confirm the order';
		confirmButton.addEventListener('click', (event) => {
			
			const csrftoken = getCookie('csrftoken');
			
			fetch('/order/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
					'X-CSRFToken': csrftoken
				},
				body: JSON.stringify(productsToOrder)
			})
				.then(response => {
					if (response.ok) {
						localStorage.clear();
						// return response.text();
						location.reload();
					}
				})
				// .then(response => {
				// 	const orders = document.querySelector('#made_orders');
				// 	console.log(response);
				// 	orders.insertAdjacentHTML('beforeend', response);
				// });
		});

		const cancelButton = document.createElement('button');
		cancelButton.innerHTML = 'Cancel';
		cancelButton.addEventListener('click', () => {
			confirmWindow.remove();
		});

		confirmWindow.style.position = 'absolute';
		confirmWindow.style.top = '0';
		confirmWindow.style.background = 'gray';
		confirmWindow.style.zIndex = '1';
		confirmWindow.append(confirmButton, cancelButton);
		document.body.append(confirmWindow);
	});

});







function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}