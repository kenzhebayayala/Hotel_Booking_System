import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="wrap" style="max-width:520px">
    <div class="page-title"><h1>Payment</h1></div>

    @if (done()) {
      <div class="panel">
        <h2>Booking confirmed</h2>
        <p>Card ending {{ last4() }} was charged {{ booking()?.total_price }}$.
          <a routerLink="/my-bookings" style="color:var(--gold)">View my bookings</a></p>
      </div>
    } @else {
      @if (booking(); as b) {
        <div class="panel" style="margin-bottom:20px">
          <h3>{{ b.room_name }}</h3>
          <div class="row">{{ b.check_in }} → {{ b.check_out }} · {{ b.guests }} guests</div>
          <div class="price">{{ b.total_price }}$</div>
        </div>
      }

      @if (booking() && booking().status !== 'pending') {
        <p>This booking is already {{ booking().status }}.
          <a routerLink="/my-bookings" style="color:var(--gold)">Go to my bookings</a></p>
      } @else {
        <form class="panel" (ngSubmit)="pay()">
          <label for="c">Card number</label>
          <input id="c" name="c" inputmode="numeric" placeholder="1234 5678 9012 3456"
                 [ngModel]="card" (ngModelChange)="formatCard($event)" required>
          <div class="two">
            <div><label for="x">Expiry</label>
              <input id="x" name="x" inputmode="numeric" placeholder="MM/YY"
                     [ngModel]="expiry" (ngModelChange)="formatExpiry($event)" required></div>
            <div><label for="v">CVV</label>
              <input id="v" name="v" type="password" inputmode="numeric" maxlength="4" [(ngModel)]="cvv" required></div>
          </div>
          <p style="color:var(--muted);font-size:14px">Demo payment. No real money is charged. Test card: 4242 4242 4242 4242.</p>
          @if (error()) { <p style="color:#b3261e">{{ error() }}</p> }
          <button class="btn" style="width:100%" type="submit" [disabled]="loading()">
            {{ loading() ? 'Processing…' : 'Pay now' }}
          </button>
        </form>
      }
    }
  </div>`,
  styles: `.btn:disabled{opacity:.6;cursor:not-allowed}`,
})
export class Payment {
  private api = inject(Api);
  private bookingId = Number(inject(ActivatedRoute).snapshot.paramMap.get('bookingId'));

  booking = signal<any>(null);
  card = ''; expiry = ''; cvv = '';
  error = signal(''); done = signal(false); loading = signal(false); last4 = signal('');

  constructor() {
    this.api.get<any>(`bookings/${this.bookingId}/`).subscribe({
      next: b => this.booking.set(b),
      error: () => this.error.set('Booking not found. Log in and try again.'),
    });
  }

  formatCard(v: string) {
    this.card = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 4);
    this.expiry = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  }

  private validate(): string {
    if (this.card.replace(/\s/g, '').length !== 16) return 'Enter a 16-digit card number.';
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(this.expiry);
    if (!m) return 'Enter the expiry date as MM/YY.';
    const now = new Date();
    if (2000 + +m[2] < now.getFullYear() || (2000 + +m[2] === now.getFullYear() && +m[1] < now.getMonth() + 1))
      return 'This card has expired.';
    if (!/^\d{3,4}$/.test(this.cvv)) return 'Enter the 3 or 4 digit CVV.';
    return '';
  }

  pay() {
    const problem = this.validate();
    if (problem) { this.error.set(problem); return; }
    this.error.set('');
    this.loading.set(true);
    // CVV stays in the browser and is never sent to the server
    this.api.post<any>('payments/', { booking: this.bookingId, card_number: this.card, expiry: this.expiry }).subscribe({
      next: r => { this.last4.set(r.card_last4); this.done.set(true); this.loading.set(false); },
      error: e => { this.error.set(e.error?.detail ?? 'Payment failed. Check the card details and try again.'); this.loading.set(false); },
    });
  }
}
