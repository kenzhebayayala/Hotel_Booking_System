import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '../../services/store';

@Component({
  selector: 'app-booking',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="wrap">
    <h2 style="margin:48px 0 28px;font-weight:700">Your booking rooms</h2>
    <div class="layout">
      <div>
        @for (r of store.cart(); track r.id) {
          <div class="item card">
            <div class="img thumb" [style.background-image]="'url(' + r.image + ')'"></div>
            <div class="info"><h3>{{ r.name }}</h3><div class="price">{{ r.price }}$<small>/Pernight</small></div></div>
            <button class="btn dark" (click)="store.remove(r.id)">Remove</button>
          </div>
        } @empty {
          <p class="empty">No rooms yet. <a routerLink="/rooms" style="color:var(--gold)">Choose a room</a> to start booking.</p>
        }
        @if (store.cart().length) {
          <label for="n">Nights</label>
          <input id="n" type="number" min="1" [ngModel]="store.nights()" (ngModelChange)="store.nights.set(+$event || 1)" style="max-width:120px">
        }
      </div>
      <aside class="panel">
        <h3>Reservation Summary</h3>
        <div class="sum"><span>Subtotal</span><b>{{ store.subtotal() }}.00$</b></div>
        <div class="sum"><span>Tax</span><b>Free</b></div>
        <div class="sum"><span>Total</span><b>{{ store.subtotal() }}.00$</b></div>
        <button class="btn" style="width:100%" [disabled]="!store.cart().length" (click)="paid.set(true)">Make Payment</button>
        @if (paid()) { <p class="ok">Demo payment accepted. Your booking is confirmed.</p> }
        <h3 style="margin-top:20px;font-size:16px">Secure payment</h3>
        <p class="small">This is a demo payment screen. No real money is charged.</p>
      </aside>
    </div>
  </div>`,
  styles: `
  .layout{display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
  .item{display:flex;align-items:center;gap:16px;padding:12px;margin-bottom:14px}
  .thumb{width:110px;height:80px;border-radius:4px}.info{flex:1}
  .sum{display:flex;justify-content:space-between;color:var(--muted);margin:10px 0}
  .ok{color:#1d7a3c}.small,.empty{color:var(--muted);font-size:14px;line-height:1.5}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  @media(max-width:800px){.layout{grid-template-columns:1fr}}`,
})
export class Booking {
  store = inject(Store);
  paid = signal(false);
}
