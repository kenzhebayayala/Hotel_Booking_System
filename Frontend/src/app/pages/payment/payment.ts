import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="page">
    <div class="grid">
      <section class="left">
        <div class="brand">
          <a routerLink="/my-bookings" aria-label="Back to my bookings" class="back">←</a>
          <span class="name">HotelBooking</span><span class="test">TEST MODE</span>
        </div>

        @if (booking(); as b) {
          <p class="lbl">Pay HotelBooking</p>
          <div class="total">\${{ b.total_price }}</div>

          <div class="item">
            <div>
              <div class="t">{{ b.room_name }}</div>
              <div class="s">{{ b.check_in }} → {{ b.check_out }}</div>
              <div class="s">{{ b.guests }} guests</div>
            </div>
            <div class="r">
              <div class="t">\${{ b.total_price }}</div>
              <div class="s">{{ nights() }} nights × \${{ perNight() }}</div>
            </div>
          </div>
        } @else {
          <p class="lbl">Loading booking…</p>
        }
        <div class="foot">Demo checkout · No real money is charged</div>
      </section>

      <section class="right">
        @if (done()) {
          <div class="ok">
            <div class="tick" aria-hidden="true">✓</div>
            <h2>Payment successful</h2>
            <p>Card ending {{ last4() }} was charged \${{ booking()?.total_price }}. Your booking is confirmed.</p>
            <a class="pay link" routerLink="/my-bookings">View my bookings</a>
          </div>
        } @else if (booking() && booking().status !== 'pending') {
          <div class="ok">
            <h2>Nothing to pay</h2>
            <p>This booking is already {{ booking().status }}.</p>
            <a class="pay link" routerLink="/my-bookings">Go to my bookings</a>
          </div>
        } @else {
          <form (ngSubmit)="pay()">
            <label for="em">Email</label>
            <input id="em" name="em" type="email" [(ngModel)]="email" required>

            <label for="cn">Card information</label>
            <div class="cardbox">
              <div class="num">
                <input id="cn" name="cn" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234"
                       [ngModel]="card" (ngModelChange)="formatCard($event)" required>
                <span class="brand-tag">{{ brand() }}</span>
              </div>
              <div class="row2">
                <input name="x" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY"
                       [ngModel]="expiry" (ngModelChange)="formatExpiry($event)" aria-label="Expiry" required>
                <input name="v" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="CVC"
                       [(ngModel)]="cvv" aria-label="CVC" required>
              </div>
            </div>

            <label for="nm">Name on card</label>
            <input id="nm" name="nm" autocomplete="cc-name" [(ngModel)]="holder" required>

            <label for="co">Country or region</label>
            <div class="cardbox">
              <select id="co" name="co" [(ngModel)]="country">
                <option>Kazakhstan</option><option>Kyrgyzstan</option><option>United States</option>
                <option>Turkey</option><option>Other</option>
              </select>
              <input name="zip" placeholder="ZIP" [(ngModel)]="zip" aria-label="ZIP" class="zip">
            </div>

            @if (error()) { <p class="err" role="alert">{{ error() }}</p> }
            <p class="hint">Test card: 4242 4242 4242 4242, any future date, any CVC.</p>
            <button class="pay" type="submit" [disabled]="loading() || !booking()">{{ loading() ? 'Processing…' : 'Pay' }}</button>
          </form>
        }
      </section>
    </div>
  </div>`,
  styles: `
  .page{background:#0d1b52;min-height:calc(100vh - 64px);padding:48px 20px;color:#fff}
  .grid{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
  .brand{display:flex;align-items:center;gap:10px;margin-bottom:36px}
  .back{color:#fff;font-size:20px;text-decoration:none}
  .name{font-weight:700;font-family:'Lora',serif;font-size:18px}
  .test{background:#f7d77a;color:#5a4300;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px}
  .lbl{margin:0;color:#c3ccf0}
  .total{font-size:36px;font-weight:700;margin:6px 0 30px}
  .item{display:flex;justify-content:space-between;gap:16px;padding:16px 0;border-top:1px solid rgba(255,255,255,.18)}
  .t{font-weight:600}.s{font-size:13px;color:#c3ccf0;margin-top:3px}.r{text-align:right}
  .foot{margin-top:60px;font-size:13px;color:#c3ccf0}
  .right{background:#fff;color:#1c1c1c;border-radius:12px;padding:28px;box-shadow:0 10px 40px rgba(0,0,0,.25)}
  label{display:block;font-size:14px;font-weight:500;margin:16px 0 6px;color:#30313d}
  label:first-child{margin-top:0}
  input,select{width:100%;padding:11px 12px;border:1px solid #d6d9e0;border-radius:6px;font:inherit;background:#fff;color:#1c1c1c}
  input:focus,select:focus{outline:2px solid #3560e8;outline-offset:-1px;border-color:#3560e8}
  .cardbox{border:1px solid #d6d9e0;border-radius:6px;overflow:hidden}
  .cardbox input,.cardbox select{border:0;border-radius:0}
  .cardbox .row2{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #d6d9e0}
  .cardbox .row2 input:first-child{border-right:1px solid #d6d9e0}
  .cardbox .zip,.cardbox select + .zip{border-top:1px solid #d6d9e0}
  .num{position:relative}
  .brand-tag{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:12px;font-weight:700;color:#0d1b52}
  .err{color:#b3261e;font-size:14px;margin:14px 0 0}
  .hint{font-size:13px;color:#6b7280;margin:14px 0}
  .pay{display:block;width:100%;text-align:center;border:0;border-radius:6px;background:#0d1b52;color:#fff;padding:13px;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
  .pay:disabled{opacity:.55;cursor:not-allowed}
  .pay:focus-visible{outline:2px solid #3560e8;outline-offset:2px}
  .ok{text-align:center;padding:30px 0}
  .tick{width:56px;height:56px;border-radius:50%;background:#d9f0e1;color:#1e7a3c;font-size:28px;display:grid;place-items:center;margin:0 auto 14px}
  .ok p{color:#4b5563;margin:10px 0 22px}
  @media(max-width:820px){.grid{grid-template-columns:1fr;gap:28px}}`,
})
export class Payment {
  private api = inject(Api);
  private bookingId = Number(inject(ActivatedRoute).snapshot.paramMap.get('bookingId'));

  booking = signal<any>(null);
  email = ''; card = ''; expiry = ''; cvv = ''; holder = ''; country = 'Kazakhstan'; zip = '';
  error = signal(''); done = signal(false); loading = signal(false); last4 = signal('');

  constructor() {
    this.api.get<any>(`bookings/${this.bookingId}/`).subscribe({
      next: b => { this.booking.set(b); this.email = b.guest_email ?? ''; },
      error: () => this.error.set('Booking not found. Log in and try again.'),
    });
  }

  nights() {
    const b = this.booking();
    return b ? Math.max(1, Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000)) : 0;
  }
  perNight() { return this.nights() ? (Number(this.booking().total_price) / this.nights()).toFixed(2) : '0.00'; }

  brand() {
    const d = this.card[0];
    return d === '4' ? 'VISA' : d === '5' ? 'MASTERCARD' : d === '3' ? 'AMEX' : '';
  }

  formatCard(v: string) {
    this.card = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }
  formatExpiry(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 4);
    this.expiry = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  }

  private validate(): string {
    if (!/^\S+@\S+\.\S+$/.test(this.email)) return 'Enter a valid email.';
    if (this.card.replace(/\s/g, '').length !== 16) return 'Enter a 16-digit card number.';
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(this.expiry);
    if (!m) return 'Enter the expiry date as MM/YY.';
    const now = new Date();
    if (2000 + +m[2] < now.getFullYear() || (2000 + +m[2] === now.getFullYear() && +m[1] < now.getMonth() + 1))
      return 'This card has expired.';
    if (!/^\d{3,4}$/.test(this.cvv)) return 'Enter the 3 or 4 digit CVC.';
    if (this.holder.trim().length < 2) return 'Enter the name on the card.';
    return '';
  }

  pay() {
    const problem = this.validate();
    if (problem) { this.error.set(problem); return; }
    this.error.set('');
    this.loading.set(true);
    // CVC, name, email and ZIP stay in the browser. Only the card number and expiry go to the demo API.
    this.api.post<any>('payments/', { booking: this.bookingId, card_number: this.card, expiry: this.expiry }).subscribe({
      next: r => { this.last4.set(r.card_last4); this.done.set(true); this.loading.set(false); },
      error: e => { this.error.set(e.error?.detail ?? 'Payment failed. Check the card details and try again.'); this.loading.set(false); },
    });
  }
}
