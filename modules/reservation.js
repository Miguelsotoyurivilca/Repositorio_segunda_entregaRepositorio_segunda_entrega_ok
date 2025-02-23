export class Reservation {
    constructor() {
        this.reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    }

    bookTable(name, date, time, tableNumber) {
        const reservation = { name, date, time, tableNumber };
        this.reservations.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(this.reservations));
        return reservation;
    }
}
