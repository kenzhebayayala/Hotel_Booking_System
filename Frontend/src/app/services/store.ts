import { Injectable, computed, signal } from '@angular/core';

export interface Room { id: number; name: string; price: number; size: number; capacity: number; image: string; }

// TODO (Alua): replace mock data with GET /api/rooms/ from Django
@Injectable({ providedIn: 'root' })
export class Store {
  rooms: Room[] = [
    { id: 1, name: 'Deluxe Room', price: 159, size: 40, capacity: 3, image: 'assets/images/room1.jpg' },
    { id: 2, name: 'Family Room', price: 169, size: 30, capacity: 5, image: 'assets/images/room2.jpg' },
    { id: 3, name: 'Double Room', price: 129, size: 20, capacity: 2, image: 'assets/images/room3.jpg' },
    { id: 4, name: 'Single Room', price: 89, size: 15, capacity: 1, image: 'assets/images/room4.jpg' },
    { id: 5, name: 'Suite', price: 249, size: 55, capacity: 4, image: 'assets/images/room5.jpg' },
    { id: 6, name: 'Superior Room', price: 139, size: 28, capacity: 2, image: 'assets/images/room6.jpg' },
  ];
  cart = signal<Room[]>([]);
  nights = signal(1);
  subtotal = computed(() => this.cart().reduce((s, r) => s + r.price, 0) * this.nights());

  add(r: Room) { if (!this.cart().some(x => x.id === r.id)) this.cart.update(c => [...c, r]); }
  remove(id: number) { this.cart.update(c => c.filter(x => x.id !== id)); }
}
