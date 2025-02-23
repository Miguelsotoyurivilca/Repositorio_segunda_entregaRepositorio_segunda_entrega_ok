export class Menu {
    constructor() {
        this.menu = [];
    }

    async loadMenu() {
        try {
            const response = await fetch('./data/menu.json');
            this.menu = await response.json();
        } catch (error) {
            console.error('Error cargando el menú', error);
        }
    }
}
