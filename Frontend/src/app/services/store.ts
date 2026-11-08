import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

export interface Room { id: number; name: string; price: number; size: number; capacity: number; image: string; }

@Injectable({ providedIn: 'root' })
export class Store {
  private http = inject(HttpClient);

  rooms = signal<Room[]>([]);
  cart = signal<Room[]>([]);
  nights = signal(1);
  subtotal = computed(() => this.cart().reduce((s, r) => s + r.price, 0) * this.nights());

  constructor() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/rooms/').subscribe(list =>
      this.rooms.set(list.map(r => ({
        id: r.id,
        name: r.name,
        price: Number(r.price_per_night),
        size: 30,
        capacity: r.capacity,
        image: `assets/images/room${((r.id - 1) % 6) + 1}.jpg`,
      }))));
  }

  add(r: Room) { if (!this.cart().some(x => x.id === r.id)) this.cart.update(c => [...c, r]); }
  remove(id: number) { this.cart.update(c => c.filter(x => x.id !== id)); }
}
