import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink],
  template: `
  <section class="hero">
    <div class="wrap hero-in">
      <div class="txt">
        <h1>Luxury Hotel</h1>
        <p>Find a hotel, pick a room and book it in a few clicks.</p>
        <a routerLink="/rooms" class="disc">Discover now</a>
      </div>
      <div class="panel form">
        <h2>Booking Your Hotel</h2>
        <label for="ci">Check In:</label><input id="ci" type="date" [(ngModel)]="checkIn">
        <label for="co">Check Out:</label><input id="co" type="date" [(ngModel)]="checkOut">
        <label for="g">Guests:</label>
        <select id="g" [(ngModel)]="guests">
          <option [ngValue]="1">1 Adult</option><option [ngValue]="2">2 Adults</option>
          <option [ngValue]="3">3 Adults</option><option [ngValue]="4">4 Adults</option>
        </select>
        <label for="r">Room:</label>
        <select id="r" [(ngModel)]="rooms">
          <option [ngValue]="1">1 Room</option><option [ngValue]="2">2 Rooms</option><option [ngValue]="3">3 Rooms</option>
        </select>
        <button class="btn line" style="margin-top:20px" (click)="search()">Check availability</button>
      </div>
    </div>
  </section>`,
  styles: `
  .hero{min-height:calc(100vh - 70px);background:#2a2f45 url('/assets/images/hero.jpg') center/cover;color:#fff;display:flex;align-items:center}
  .hero-in{display:flex;justify-content:space-between;align-items:center;gap:40px;width:100%;padding-top:30px;padding-bottom:30px}
  h1{font-size:72px;font-weight:400}
  .txt p{max-width:460px;font-size:18px;line-height:1.5}
  .disc{display:inline-block;margin-top:24px;border-bottom:2px solid var(--gold);padding-bottom:6px;letter-spacing:.1em;text-transform:uppercase;font-size:13px}
  .form{color:var(--ink);width:340px;flex:none}
  .form h2{font-size:26px}
  @media(max-width:850px){.hero-in{flex-direction:column;align-items:stretch}h1{font-size:48px}.form{width:auto}}`,
})
export class Home {
  private router = inject(Router);
  checkIn = ''; checkOut = ''; guests = 2; rooms = 1;
  search() {
    this.router.navigate(['/rooms'], { queryParams: { guests: this.guests, checkIn: this.checkIn, checkOut: this.checkOut } });
  }
}
