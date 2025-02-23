import { Reservation } from './modules/reservation.js';
import { Menu } from './modules/menu.js';
import { Cart } from './modules/cart.js';
import { UI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UI();
    const reservation = new Reservation();
    const menu = new Menu();
    const cart = new Cart();

    await menu.loadMenu();
    ui.displayMenu(menu, cart);
    ui.setupEventListeners(reservation, menu, cart);
});
