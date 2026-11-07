import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Hotel { id: number; name: string; city: string; rating: number; reviews: number; price: number; was: number; image: string; }
interface Dest { name: string; from: number; }

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  template: `
  <section class="hero">
    <div class="wrap">
      <h1>Your next trip starts here</h1>
      <form class="search" (ngSubmit)="search()">
        <div class="f where"><input name="where" placeholder="Where to?" [(ngModel)]="where" aria-label="Destination"></div>
        <div class="f dates">
          <input type="date" name="ci" [(ngModel)]="checkIn" [min]="today" aria-label="Check in">
          <span aria-hidden="true">–</span>
          <input type="date" name="co" [(ngModel)]="checkOut" [min]="checkIn || today" aria-label="Check out">
        </div>
        <div class="f">
          <select name="g" [(ngModel)]="guests" aria-label="Travellers">
            <option [ngValue]="1">1 traveller</option><option [ngValue]="2">2 travellers</option>
            <option [ngValue]="3">3 travellers</option><option [ngValue]="4">4 travellers</option>
          </select>
          <select name="r" [(ngModel)]="rooms" aria-label="Rooms">
            <option [ngValue]="1">1 room</option><option [ngValue]="2">2 rooms</option><option [ngValue]="3">3 rooms</option>
          </select>
        </div>
        <button class="go" type="submit">Search</button>
      </form>
    </div>
  </section>

  <div class="wrap">
    <section class="block">
      <div class="head">
        <div><h2>Last-minute deals, right on time</h2><p>Best prices for the coming weekend</p></div>
        <button class="pill" type="button" (click)="open()">See all deals</button>
      </div>
      <div class="deals">
        @for (h of hotels; track h.id) {
          <article class="deal">
            <div class="photo" [style.background-image]="'url(' + h.image + ')'" (click)="open()">
              <button type="button" class="heart" [class.on]="isFav(h.id)" (click)="toggleFav(h.id); $event.stopPropagation()"
                [attr.aria-label]="isFav(h.id) ? 'Remove from favourites' : 'Save to favourites'">{{ isFav(h.id) ? '♥' : '♡' }}</button>
            </div>
            <h3>{{ h.name }}</h3>
            <div class="city">{{ h.city }}</div>
            <div class="rate"><b>{{ h.rating }}</b> {{ label(h.rating) }} ({{ h.reviews }} reviews)</div>
            <span class="off">{{ off(h) }}% off</span>
            <div class="price"><b>\${{ h.price * 2 }}</b> <s>\${{ h.was * 2 }}</s></div>
            <div class="small">for 2 nights, 1 room<br>\${{ h.price }} per night<br>includes taxes &amp; fees</div>
          </article>
        }
      </div>
    </section>

    <section class="block">
      <h2>Your style. These stays. A perfect match.</h2>
      <p>Average prices based on current calendar month</p>
      <div class="tabs" role="tablist">
        @for (t of tabs; track t) {
          <button type="button" role="tab" [class.on]="tab() === t" [attr.aria-selected]="tab() === t" (click)="tab.set(t)">{{ t }}</button>
        }
      </div>
      <div class="dests">
        @for (d of dests[tab()]; track d.name) {
          <article class="dest" (click)="open()">
            <div class="dphoto" [style.background-image]="'url(' + tabImage[tab()] + ')'"></div>
            <h3>{{ d.name }}</h3>
            <div class="small">From \${{ d.from }} per night</div>
          </article>
        }
      </div>
    </section>
  </div>`,
  styles: `
  .hero{height:340px;display:flex;align-items:center;text-align:center;color:#fff;
    background:linear-gradient(rgba(5,12,40,.55),rgba(5,12,40,.55)),#2a2f45 url('/assets/images/hero.jpg') center/cover}
  .hero h1{font-size:34px;margin-bottom:28px}
  .search{display:flex;align-items:center;background:#fff;color:var(--ink);border-radius:40px;padding:6px 6px 6px 10px;max-width:880px;margin:0 auto;gap:4px}
  .f{display:flex;align-items:center;padding:0 8px;border-left:1px solid var(--line)}
  .f.where{flex:1.4;border-left:0}
  .search input,.search select{width:auto;border:0;background:transparent;padding:12px 6px;font:inherit;min-width:0}
  .where input{width:100%}
  .dates input{width:132px}
  .go{border:0;background:#0d1b52;color:#fff;border-radius:30px;padding:13px 26px;font:inherit;font-weight:600;cursor:pointer}
  .go:focus-visible,.pill:focus-visible,.tabs button:focus-visible,.heart:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
  .block{margin-top:44px}
  .block h2{font-size:28px;font-weight:500}
  .block p{color:var(--muted);margin:4px 0 0;font-size:14px}
  .head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
  .pill{background:#fff;border:1px solid #0d1b52;color:#0d1b52;border-radius:30px;padding:9px 20px;font:inherit;font-weight:600;cursor:pointer}
  .deals,.dests{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:20px;margin-top:20px}
  .photo{height:190px;border-radius:10px;background-color:#d9d3c9;background-size:cover;background-position:center;position:relative;cursor:pointer;margin-bottom:10px}
  .heart{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;border:0;background:#fff;font-size:18px;cursor:pointer;color:#0d1b52}
  .heart.on{color:#d93025}
  .deal h3,.dest h3{font:600 15px 'Cabin',sans-serif;margin:0}
  .city{font-size:14px;color:var(--muted)}
  .rate{font-size:14px;margin:6px 0}
  .rate b{background:#1e7a3c;color:#fff;padding:2px 6px;border-radius:4px;margin-right:4px}
  .off{display:inline-block;background:#d93025;color:#fff;font-size:13px;font-weight:600;padding:2px 6px;border-radius:4px}
  .price{margin-top:6px}.price s{color:var(--muted);font-size:14px}
  .small{font-size:13px;color:var(--muted);line-height:1.4}
  .tabs{display:flex;gap:6px;margin-top:16px;border-bottom:1px solid var(--line);overflow-x:auto}
  .tabs button{background:none;border:0;border-bottom:3px solid transparent;padding:12px 14px;font:inherit;font-weight:500;cursor:pointer;white-space:nowrap}
  .tabs button.on{border-bottom-color:#0d1b52}
  .dest{cursor:pointer}
  .dphoto{height:170px;border-radius:10px;background-color:#d9d3c9;background-size:cover;background-position:center;margin-bottom:10px}
  @media(max-width:760px){.search{flex-direction:column;border-radius:16px;align-items:stretch;padding:10px}.f{border-left:0;border-top:1px solid var(--line);padding:4px}.f.where{border-top:0}.dates input{width:auto;flex:1}.hero{height:auto;padding:36px 0}}`,
})
export class Home {
  private router = inject(Router);

  today = new Date().toISOString().slice(0, 10);
  where = ''; checkIn = ''; checkOut = ''; guests = 2; rooms = 1;
  tab = signal('Beach');
  fav = signal<number[]>([]);

  // TODO: replace with GET /api/hotels/ when the Hotels API is ready
  hotels: Hotel[] = [
    { id: 1, name: 'Alatau Boutique Hotel', city: 'Almaty', rating: 8.6, reviews: 4, price: 188, was: 251, image: 'assets/images/room1.jpg' },
    { id: 2, name: 'Medeu Garden Hotel', city: 'Almaty', rating: 9.4, reviews: 16, price: 64, was: 81, image: 'assets/images/room2.jpg' },
    { id: 3, name: 'Ala-Too City Stay', city: 'Bishkek', rating: 9.0, reviews: 27, price: 81, was: 114, image: 'assets/images/room3.jpg' },
    { id: 4, name: 'Issyk-Kul Five Hotel', city: 'Bishkek', rating: 9.0, reviews: 30, price: 96, was: 140, image: 'assets/images/room4.jpg' },
  ];

  tabs = ['Beach', 'Culture', 'Ski', 'Family', 'Wellness and Relaxation'];
  tabImage: Record<string, string> = {
    'Beach': 'assets/images/news1.jpg', 'Culture': 'assets/images/news2.jpg', 'Ski': 'assets/images/news3.jpg',
    'Family': 'assets/images/room2.jpg', 'Wellness and Relaxation': 'assets/images/room5.jpg',
  };
  dests: Record<string, Dest[]> = {
    'Beach': [{ name: 'Antalya', from: 74 }, { name: 'Phuket', from: 68 }, { name: 'Dubai', from: 112 }, { name: 'Bali', from: 59 }],
    'Culture': [{ name: 'Istanbul', from: 66 }, { name: 'Rome', from: 98 }, { name: 'Samarkand', from: 45 }, { name: 'Tbilisi', from: 57 }],
    'Ski': [{ name: 'Shymbulak', from: 85 }, { name: 'Karakol', from: 52 }, { name: 'Gudauri', from: 70 }, { name: 'Sheregesh', from: 60 }],
    'Family': [{ name: 'Almaty', from: 64 }, { name: 'Bishkek', from: 49 }, { name: 'Antalya', from: 81 }, { name: 'Istanbul', from: 72 }],
    'Wellness and Relaxation': [{ name: 'Burabay', from: 58 }, { name: 'Issyk-Kul', from: 55 }, { name: 'Dubai', from: 120 }, { name: 'Bali', from: 66 }],
  };

  label(r: number) { return r >= 9.3 ? 'Exceptional' : r >= 9 ? 'Wonderful' : r >= 8 ? 'Excellent' : 'Very good'; }
  off(h: Hotel) { return Math.round((1 - h.price / h.was) * 100); }
  isFav(id: number) { return this.fav().includes(id); }
  toggleFav(id: number) { this.fav.update(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]); }
  open() { this.router.navigate(['/rooms']); }

  search() {
    this.router.navigate(['/rooms'], { queryParams: { guests: this.guests, q: this.where, checkIn: this.checkIn, checkOut: this.checkOut } });
  }
}
