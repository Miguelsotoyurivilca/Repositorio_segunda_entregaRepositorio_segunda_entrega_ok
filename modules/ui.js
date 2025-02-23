export class UI {
    displayMenu(menu, cart) {
        const menuContainer = document.getElementById('menuContainer');
        menu.menu.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('card', 'mb-3');
            div.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text">${item.descripcion}</p>
                    <p class="card-text"><strong>$${item.precio}</strong></p>
                    <button class="btn btn-success" data-id="${item.id}">Agregar al Carrito</button>
                </div>
            `;
            menuContainer.appendChild(div);
        });
        
        document.querySelectorAll('.btn-success').forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = event.target.getAttribute('data-id');
                const selectedItem = menu.menu.find(item => item.id == itemId);
                cart.addToCart(selectedItem);
                Swal.fire('Producto agregado al carrito');
            });
        });
    }
    
    setupEventListeners(reservation, menu, cart) {
        document.getElementById('reserveBtn').addEventListener('click', (e) => {
            e.preventDefault();
            Swal.fire('Reserva confirmada');
        });
    }
}

