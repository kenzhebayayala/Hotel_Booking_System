import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-booking',
  imports: [FormsModule],
  template: `
  <div class="wrap">
    <h2 style="margin:48px 0 28px;font-weight:700">Your booking</h2>
    <div class="layout">
      <form class="panel" (ngSubmit)="submit()">
        <div class="two">
          <div><label for="ci">Check In</label><input id="ci" name="ci" type="date" [min]="today" [(ngModel)]="f.check_in" required></div>
          <div><label for="co">Check Out</label><input id="co" name="co" type="date" [min]="f.check_in || today" [(ngModel)]="f.check_out" required></div>
          <div><label for="g">Guests</label><input id="g" name="g" type="number" min="1" [(ngModel)]="f.guests" required></div>
          <div><label for="n">Full name</label><input id="n" name="n" [(ngModel)]="f.guest_name" required></div>
          <div><label for="e">Email</label><input id="e" name="e" type="email" [(ngModel)]="f.guest_email" required></div>
          <div><label for="p">Phone</label><input id="p" name="p" [(ngModel)]="f.guest_phone"></div>
        </div>
        @if (error()) { <p style="color:#b3261e" role="alert">{{ error() }}</p> }
        <button class="btn" style="margin-top:20px" type="submit">Continue to payment</button>
      </form>
      <aside class="panel">
        <h3>Reservation Summary</h3>
        <div class="sum"><span>Room</span><b>{{ room()?.name }}</b></div>
        <div class="sum"><span>Price per night</span><b>{{ room()?.price_per_night }}$</b></div>
        <div class="sum"><span>Nights</span><b>{{ nights() }}</b></div>
        <div class="sum"><span>Total</span><b>{{ total() }}$</b></div>
      </aside>
    </div>
  </div>`,
  styles: `.layout{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
  .sum{display:flex;justify-content:space-between;color:var(--muted);margin:10px 0}
  @media(max-width:800px){.layout{grid-template-columns:1fr}}`,
})
export class Booking {
  private api = inject(Api);
  private router = inject(Router);
  private roomId = Number(inject(ActivatedRoute).snapshot.paramMap.get('roomId'));
  today = new Date().toISOString().slice(0, 10);
  room = signal<any>(null);
  error = signal('');
  f = { check_in: '', check_out: '', guests: 1, guest_name: '', guest_email: '', guest_phone: '' };

  constructor() { this.api.get<any>(`rooms/${this.roomId}/`).subscribe(r => this.room.set(r)); }

  nights() {
    const d = (new Date(this.f.check_out).getTime() - new Date(this.f.check_in).getTime()) / 86400000;
    return d > 0 ? d : 0;
  }
  total() { return this.nights() * Number(this.room()?.price_per_night ?? 0); }

  submit() {
    this.error.set('');
    this.api.post<any>('bookings/', { room: this.roomId, ...this.f }).subscribe({
      next: b => this.router.navigate(['/payment', b.id]),
      error: e => this.error.set(
        e.status === 401
          ? 'Please log in first, then try again.'
          : ((Object.values(e.error ?? {}) as string[][]).flat()).join(' ') || 'Could not create the booking.'),
    });
  }
}
