import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-my-bookings',
  imports: [RouterLink],
  template: `
  <div class="wrap">
    <div class="page-title"><h1>My Bookings</h1></div>
    @if (error()) { <p style="color:#b3261e">{{ error() }} <a routerLink="/login" style="color:var(--gold)">Log in</a></p> }
    @for (b of bookings(); track b.id) {
      <div class="card item">
        <div><h3>{{ b.room_name }}</h3>
          <div class="row">{{ b.check_in }} → {{ b.check_out }} · {{ b.guests }} guests</div>
          <div class="price">{{ b.total_price }}$</div></div>
        <div class="side">
          <span class="st" [class.ok]="b.status === 'confirmed'" [class.no]="b.status === 'cancelled'">{{ b.status }}</span>
          @if (b.status === 'pending') { <a class="btn" [routerLink]="['/payment', b.id]">Pay</a> }
          @if (b.status !== 'cancelled') { <button class="btn dark" (click)="cancel(b.id)">Cancel booking</button> }
        </div>
      </div>
    } @empty { @if (!error()) { <p>No bookings yet. <a routerLink="/rooms" style="color:var(--gold)">Choose a room</a>.</p> } }
  </div>`,
  styles: `.item{display:flex;justify-content:space-between;align-items:center;padding:20px;margin-bottom:14px;gap:16px;flex-wrap:wrap}
  .side{display:flex;align-items:center;gap:10px}.st{padding:4px 12px;border-radius:20px;background:#f3e9d8;font-size:14px}
  .st.ok{background:#d9f0e1}.st.no{background:#f5d9d6}`,
})
export class MyBookings {
  private api = inject(Api);
  bookings = signal<any[]>([]);
  error = signal('');
  constructor() { this.load(); }
  load() {
    this.api.get<any[]>('bookings/').subscribe({
      next: l => { this.bookings.set(l); this.error.set(''); },
      error: () => this.error.set('Could not load your bookings. Please log in.'),
    });
  }
  cancel(id: number) { this.api.post(`bookings/${id}/cancel/`).subscribe(() => this.load()); }
}
