class Product {
	constructor(section, name, storageName, count) {
		this.section = section
		this.name = name;
		this.storageName = storageName;
		this.count = count;
	}

	toHTML() {
		const poductBlock = document.createElement('div');
		const name = document.createElement('h3');
		const button = document.createElement('button');
		name.innerHTML = this.section + ' | ' + this.name;
		button.innerHTML = 'Delete';
		poductBlock.append(name, button);

		button.addEventListener('click', () => {
			localStorage.removeItem(this.storageName);
			poductBlock.remove();
		});

		return [poductBlock, name];
	}

	_toUsualView(name) {
		const priceWrapper = document.createElement('div');
		priceWrapper.addEventListener('input', (event) => {
			this.count[event.target.name] = Number(event.target.value);
			const object = JSON.parse(localStorage[this.storageName]);
			object.count = this.count;
			localStorage[this.storageName] = JSON.stringify(object);
		});

		name.after(priceWrapper);

		const usualPrice = document.createElement('div');
		usualPrice.innerHTML = `Usual size: ${this.price} Count: <input type="number" name="usual" value="${this.count.usual}" min="0">`;
		priceWrapper.append(usualPrice);

		if (this.largePrice) {
			const largePrice = document.createElement('div');
			largePrice.innerHTML = `Large size: ${this.largePrice} Count: <input type="number" name="large" value="${this.count.large}" min="0">`;
			priceWrapper.append(largePrice);
		}
	}	
}

class Pizza extends Product {

	constructor(section, name, storageName, count, price, sets) {
		super(section, name, storageName, count);
		this.price = price[0];
		this.largePrice = price[1];
		this.sets = sets || [];
		this.toppingsAmount = parseInt(name);

		Pizza.statToppings = JSON.parse(localStorage[this.storageName]).toppings;
	}

	toHTML() {
		const [poductBlock, name] = super.toHTML();
		if (this.name.includes('topping')) {
			const usualPrice = document.createElement('p');
			usualPrice.innerHTML = 'Usual size: ' + this.price;

			const largePrice = document.createElement('p');
			largePrice.innerHTML = 'Large size: ' + this.largePrice;

			const setButton = document.createElement('button');
			setButton.innerHTML = 'Set pizza';
			setButton.addEventListener('click', this._toOpenSetFrame.bind(this));

			if (this.sets.length > 0) {
				const setsBlock = this._toDisplaySets();

				poductBlock.append(setsBlock);
			}
			
			name.after(usualPrice, largePrice, setButton);
		} else {
			this._toUsualView(name);
		}
		
		return poductBlock;
	}

	_toOpenSetFrame(event) {
		event.preventDefault();
		const setFrame = document.createElement('div');
		const form = document.createElement('form');
		form.name = 'pizzaSet';
		const usual = document.createElement('label');
		const large = document.createElement('label');
		const count = document.createElement('label');
		const toppings = document.createElement('div');
		const addSetButton = document.createElement('button');
		const closeButton = document.createElement('button');

		usual.innerHTML = 'Usual size <input type="radio" name="size" value="usual_size">';
		large.innerHTML = 'Large size <input type="radio" name="size" value="large_size">';
		count.innerHTML = 'Count <input type="number" name="count" value="1" min="1">';
		
		Pizza.statToppings.forEach(item => {
			toppings.insertAdjacentHTML('afterbegin', `<label>${item} <input type="checkbox" name="toppings" value="${item}"><label/>`);
		});
		toppings.addEventListener('change', (event) => {
			const chosenToppings = event.currentTarget.querySelectorAll('[name=toppings]:checked');
			if (chosenToppings.length > this.toppingsAmount) {
				event.target.checked = false;
			}
		});

		addSetButton.innerHTML = 'Add';
		closeButton.innerHTML = 'Close';
		addSetButton.dataset.action = 'add';
		closeButton.dataset.action = 'close';

		form.append(usual, large, count, toppings, addSetButton, closeButton);
		setFrame.append(form);
		setFrame.style.position = 'absolute';
		setFrame.style.top = '100px';
		setFrame.style.zIndex = '1';
		setFrame.addEventListener('click', this._toHandleSetFrame.bind(this));
		
		event.currentTarget.parentElement.append(setFrame);
	}

	_toHandleSetFrame(event) {
		if (event.target.tagName === 'BUTTON') {
			event.preventDefault();
			const action = event.target.dataset.action;
			if (action === 'close') {
				event.currentTarget.remove();
			} else if (action === 'add') {
				const form = document.forms.pizzaSet;
				const toppings = [];
				const size = form.elements.size.value.split('_')[0];
				const count = Number(form.elements.count.value);
				const nodeList = form.querySelectorAll('[name=toppings]:checked');

				nodeList.forEach(node => {
					toppings.push(node.value);
				});

				if (!(toppings.length === this.toppingsAmount && size && count)) {
					return;
				}

				form.reset();

				this.sets.push({
					toppings,
					size,
					count
				});

				this.count[size] += count;
				console.log(this.count);

				this._toUpdateLocalStorageSets();

				const setsBlock = this._toDisplaySets();
				event.currentTarget.parentElement.append(setsBlock);
			}
		}
	}

	_toDisplaySets() {
		let setsBlock = document.getElementById('sets-wrapper' + this.toppingsAmount);
		if (setsBlock) {
			setsBlock.remove();
		} 
		setsBlock = document.createElement('div');
		setsBlock.id = 'sets-wrapper' + this.toppingsAmount;
		setsBlock.addEventListener('click', (event) => {
			if (event.target.tagName === 'BUTTON') {
				event.preventDefault();
				const index = Number(event.target.dataset.index);
				const item = this.sets.splice(index, 1)[0];
				const poductBlock = event.currentTarget.parentElement;
				poductBlock.append(this._toDisplaySets());

				this.count[item.size] -= item.count;
				console.log(this.count);

				this._toUpdateLocalStorageSets();
			}
		});

		this.sets.forEach((set, index) => {
			const p = document.createElement('p');
			const deleteSet = document.createElement('button');
			deleteSet.innerHTML = 'Delete';
			deleteSet.dataset.index = index;
			p.innerHTML = `Size: ${set.size} Toppings: ${set.toppings.join(', ')} Count: ${set.count}`;
			setsBlock.append(p, deleteSet);
		});
		return setsBlock;
	}

	_toUpdateLocalStorageSets() {
		const object = JSON.parse(localStorage[this.storageName]);
		object.sets = this.sets;
		object.count = this.count;
		localStorage[this.storageName] = JSON.stringify(object);
	}
}


class Sub extends Product {
	constructor(section, name, storageName, count, price) {
		super(section, name, storageName, count);
		this.price = price[0];
		this.largePrice = price[1];
	}

	toHTML() {
		const [poductBlock, name] = super.toHTML();

		this._toUsualView(name);
		
		return poductBlock;
	}
}


class Pasta extends Product {
	constructor(section, name, storageName, count, price) {
		super(section, name, storageName, count);
		this.price = price[0];
	}

	toHTML() {
		const [poductBlock, name] = super.toHTML();

		this._toUsualView(name);
		
		return poductBlock;
	}
}


class Salad extends Product {
	constructor(section, name, storageName, count, price) {
		super(section, name, storageName, count);
		this.price = price[0];
	}

	toHTML() {
		const [poductBlock, name] = super.toHTML();

		this._toUsualView(name);
		
		return poductBlock;
	}
}


class DinnerPlatter extends Product {
	constructor(section, name, storageName, count, price) {
		super(section, name, storageName, count);
		this.price = price[0];
		this.largePrice = price[1];
	}

	toHTML() {
		const [poductBlock, name] = super.toHTML();

		this._toUsualView(name);
		
		return poductBlock;
	}
}

export const products = {
	pizza: Pizza,
	sub: Sub,
	salad: Salad,
	pasta: Pasta,
	dinner: DinnerPlatter
}