export class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addToCart(item) {
        this.items.push(item);
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.displayCart();
    }

    displayCart() {
        const cartContainer = document.getElementById('cartContainer');
        cartContainer.innerHTML = '';
        this.items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<p>${item.nombre} - $${item.precio}</p>`;
            cartContainer.appendChild(div);
        });
    }
}