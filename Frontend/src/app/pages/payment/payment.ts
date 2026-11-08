import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-payment',
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
  <div class="page">
    <div class="wrap">
      <ol class="steps">
        <li class="done">1. Room reservation</li>
        <li class="done">2. Check-out</li>
        <li [class.on]="!done()" [class.done]="done()">3. Payment</li>
        <li [class.on]="done()">4. Confirmation</li>
      </ol>

      <div class="titlebar">
        <h1>{{ done() ? 'Booking confirmed' : 'Guarantee your booking' }}</h1>
        @if (!done() && booking()?.status === 'pending') {
          <div class="timer" [class.out]="left() === 0" role="timer">
            {{ left() > 0 ? 'Room(s) held for ' + mmss() : 'Hold expired. Please start a new booking.' }}
          </div>
        }
      </div>

      <div class="cols">
        <aside class="summary">
          <div class="photo" [style.background-image]="'url(' + image() + ')'"></div>
          @if (booking(); as b) {
            <div class="sbody">
              <h2>HotelBooking, {{ b.room_name }}</h2>
              <div class="two">
                <div><span class="k">Check-in</span><b>{{ b.check_in | date:'EEE, MMM d, y' }}</b></div>
                <div><span class="k">Check-out</span><b>{{ b.check_out | date:'EEE, MMM d, y' }}</b></div>
              </div>
              <div class="blk"><span class="k">Occupancy</span><b>1 Room, {{ b.guests }} guests</b></div>
              <div class="blk"><span class="k">Room type</span><b>{{ b.room_name }}</b></div>
              <div class="blk"><span class="k">Nights</span><b>{{ nights() }}</b></div>
              <hr>
              <div class="line"><span>Total (USD)</span><b>\${{ b.total_price }}</b></div>
              <div class="line big"><span>Pay now</span><b>{{ done() ? '0.00' : b.total_price }}</b></div>
            </div>
          } @else {
            <div class="sbody"><p>Loading booking…</p></div>
          }
        </aside>

        <section>
          @if (done()) {
            <div class="box ok">
              <div class="tick" aria-hidden="true">✓</div>
              <h2>Payment successful</h2>
              <p>Card ending {{ last4() }} was charged \${{ booking()?.total_price }}. Your booking is confirmed.</p>
              <a class="btn primary" routerLink="/my-bookings">View my bookings</a>
            </div>
          } @else if (booking() && booking().status !== 'pending') {
            <div class="box ok">
              <h2>Nothing to pay</h2>
              <p>This booking is already {{ booking().status }}.</p>
              <a class="btn primary" routerLink="/my-bookings">Go to my bookings</a>
            </div>
          } @else {
            <form (ngSubmit)="pay()">
              <div class="box">
                <h2>Payment details</h2>
                <div class="method">
                  <label class="radio"><input type="radio" name="m" checked> <span>Credit or Debit Card</span></label>
                  <hr>
                  <div class="fields">
                    <div class="f num"><label for="cn">Card number</label>
                      <input id="cn" name="cn" inputmode="numeric" autocomplete="cc-number" placeholder="1234 1234 1234 1234"
                             [ngModel]="card" (ngModelChange)="formatCard($event)" required></div>
                    <div class="f"><label for="ex">Expiry date</label>
                      <input id="ex" name="ex" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY"
                             [ngModel]="expiry" (ngModelChange)="formatExpiry($event)" required></div>
                    <div class="f"><label for="cv">CVV</label>
                      <input id="cv" name="cv" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="4"
                             [(ngModel)]="cvv" required></div>
                    <div class="f holder"><label for="nm">Cardholder’s name</label>
                      <input id="nm" name="nm" autocomplete="cc-name" [(ngModel)]="holder" required></div>
                  </div>
                  <hr>
                  <div class="accept"><b>WE ACCEPT</b>
                    <div class="cards"><span>VISA</span><span>Mastercard</span><span>AMEX</span></div>
                  </div>
                </div>
                <div class="method off">
                  <label class="radio"><input type="radio" name="m" disabled> <span>Wallets (coming soon)</span></label>
                </div>
              </div>

              <div class="box terms">
                <label class="chk"><input type="checkbox" name="terms" [(ngModel)]="terms">
                  <span>I have read and I accept the Terms and Conditions, including the cancellation and refund policy. This is a demo checkout and no real money is charged.</span></label>
              </div>

              @if (error()) { <p class="err" role="alert">{{ error() }}</p> }
              <p class="hint">Test card: 4242 4242 4242 4242, any future date, any CVV.</p>

              <div class="actions">
                <button class="btn primary" type="submit" [disabled]="loading() || !booking() || left() === 0">
                  {{ loading() ? 'Processing…' : 'Guarantee' }}</button>
                <a class="btn light" routerLink="/my-bookings">Cancel</a>
              </div>
            </form>
          }
        </section>
      </div>
    </div>
  </div>`,
  styles: `
  :host{--accent:#0d1b52}
  .page{background:#f2f2f2;min-height:calc(100vh - 64px);padding:32px 0 60px}
  .steps{list-style:none;display:flex;gap:8px;justify-content:center;margin:0 0 36px;padding:0;flex-wrap:wrap}
  .steps li{flex:1;min-width:150px;max-width:270px;text-align:center;padding:10px 4px;border-bottom:3px solid #1c1c1c;font-size:15px}
  .steps li.on{border-bottom-color:var(--accent);font-weight:700;color:var(--accent)}
  .steps li.done{border-bottom-color:var(--accent)}
  .titlebar{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin-bottom:22px}
  h1{font:600 30px 'Cabin',sans-serif;margin:0}
  .timer{color:#b3261e;font-weight:700}
  .timer.out{color:#6b7280}
  .cols{display:grid;grid-template-columns:380px 1fr;gap:30px;align-items:start}
  .summary{background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .photo{height:210px;background-color:#c9c3b8;background-size:cover;background-position:center}
  .sbody{padding:22px}
  .sbody h2{font:600 19px 'Cabin',sans-serif;margin:0 0 20px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
  .k{display:block;color:#4b5563;font-size:15px;margin-bottom:2px}
  b{font-weight:600}
  .blk{margin-bottom:14px}
  hr{border:0;border-top:1px solid #dcdcdc;margin:18px 0}
  .line{display:flex;justify-content:space-between;margin:8px 0}
  .line.big{font-size:20px}
  .box{background:#fff;border-radius:6px;padding:26px;margin-bottom:22px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .box h2{font:600 22px 'Cabin',sans-serif;margin:0 0 20px}
  .method{border:1px solid #9a9a9a;border-radius:4px;padding:18px 20px;margin-bottom:18px}
  .method.off{opacity:.6}
  .radio{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:600}
  .radio input{width:22px;height:22px;accent-color:var(--accent)}
  .fields{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:14px 20px}
  .f label{display:block;margin-bottom:6px;font-size:15px}
  .f.holder{grid-column:1 / 3}
  .fields input{width:100%;padding:12px;border:1px solid #9a9a9a;border-radius:3px;font:inherit;background:#fff}
  .fields input:focus{outline:2px solid var(--accent);outline-offset:0}
  .accept b{font-size:15px;letter-spacing:.04em}
  .cards{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
  .cards span{border:1px solid #dcdcdc;border-radius:4px;padding:6px 12px;font-size:12px;font-weight:700;color:#374151}
  .terms{padding:22px 26px}
  .chk{display:flex;gap:14px;align-items:flex-start;color:#4b5563;font-size:15px;line-height:1.5}
  .chk input{width:20px;height:20px;margin-top:2px;flex:none;accent-color:var(--accent)}
  .err{color:#b3261e;margin:0 0 10px}
  .hint{color:#6b7280;font-size:14px;margin:0 0 16px}
  .actions{display:flex;justify-content:space-between;gap:16px}
  .btn{display:inline-block;border:0;border-radius:4px;padding:16px 34px;font:600 18px 'Cabin',sans-serif;cursor:pointer;text-decoration:none;text-align:center}
  .btn.primary{background:var(--accent);color:#fff;min-width:230px}
  .btn.light{background:#e6e6e6;color:#1c1c1c;padding:16px 38px}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  .btn:focus-visible{outline:2px solid #3560e8;outline-offset:2px}
  .ok{text-align:center;padding:40px 26px}
  .tick{width:60px;height:60px;border-radius:50%;background:#d9f0e1;color:#1e7a3c;font-size:30px;display:grid;place-items:center;margin:0 auto 14px}
  .ok p{color:#4b5563;margin:10px 0 24px}
  @media(max-width:900px){.cols{grid-template-columns:1fr}.fields{grid-template-columns:1fr 1fr}.f.num{grid-column:1 / 3}.f.holder{grid-column:1 / 3}.actions{flex-direction:column}}`,
})
export class Payment {
  private api = inject(Api);
  private bookingId = Number(inject(ActivatedRoute).snapshot.paramMap.get('bookingId'));

  booking = signal<any>(null);
  card = ''; expiry = ''; cvv = ''; holder = ''; terms = false;
  error = signal(''); done = signal(false); loading = signal(false); last4 = signal('');
  left = signal(15 * 60); // visual hold timer only, the server does not release rooms

  constructor() {
    this.api.get<any>(`bookings/${this.bookingId}/`).subscribe({
      next: b => this.booking.set(b),
      error: () => this.error.set('Booking not found. Log in and try again.'),
    });
    const id = setInterval(() => this.left.update(v => Math.max(0, v - 1)), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  mmss() { const l = this.left(); return `${Math.floor(l / 60)} min ${String(l % 60).padStart(2, '0')} sec`; }
  image() { const b = this.booking(); return b ? `assets/images/room${((b.room - 1) % 6) + 1}.jpg` : ''; }
  nights() {
    const b = this.booking();
    return b ? Math.max(1, Math.round((new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000)) : 0;
  }

  formatCard(v: string) { this.card = v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
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
    if (this.holder.trim().length < 2) return 'Enter the cardholder name.';
    if (!this.terms) return 'Please accept the Terms and Conditions.';
    return '';
  }

  pay() {
    const problem = this.validate();
    if (problem) { this.error.set(problem); return; }
    this.error.set('');
    this.loading.set(true);
    // CVV and cardholder name stay in the browser. Only the card number and expiry go to the demo API.
    this.api.post<any>('payments/', { booking: this.bookingId, card_number: this.card, expiry: this.expiry }).subscribe({
      next: r => { this.last4.set(r.card_last4); this.done.set(true); this.loading.set(false); },
      error: e => { this.error.set(e.error?.detail ?? 'Payment failed. Check the card details and try again.'); this.loading.set(false); },
    });
  }
}
