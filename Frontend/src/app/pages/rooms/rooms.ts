import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Room, Store } from '../../services/store';

@Component({
  selector: 'app-rooms',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="wrap">
    <div class="page-title"><h1>Our Rooms</h1>
      <div class="crumbs"><a routerLink="/home">Home</a> &gt; Rooms</div></div>

    <div class="filters">
      <input [ngModel]="q()" (ngModelChange)="q.set($event)" placeholder="Search anything" aria-label="Search rooms">
      <select [ngModel]="sort()" (ngModelChange)="sort.set($event)" aria-label="Sort by price">
        <option value="">Sort by price</option><option value="asc">Lowest first</option><option value="desc">Highest first</option>
      </select>
      <select [ngModel]="guests()" (ngModelChange)="guests.set($event)" aria-label="Guests">
        <option [ngValue]="0">Any guests</option><option [ngValue]="1">1+</option><option [ngValue]="2">2+</option><option [ngValue]="3">3+</option><option [ngValue]="4">4+</option>
      </select>
    </div>

    <div class="grid3">
      @for (r of list(); track r.id) {
        <article class="card">
          <div class="img" [style.background-image]="'url(' + r.image + ')'"></div>
          <div class="body">
            <div class="price">{{ r.price }}$<small>/Pernight</small></div>
            <h3 style="margin:8px 0">{{ r.name }}</h3>
            <div class="row"><b>Size:</b>{{ r.size }} ft</div>
            <div class="row"><b>Capacity:</b>Max person {{ r.capacity }}</div>
            <button class="btn" (click)="book(r)">Book now</button>
          </div>
        </article>
      } @empty { <p>No rooms match your search. Try fewer filters.</p> }
    </div>
  </div>`,
  styles: `.filters{display:flex;gap:12px;max-width:760px;margin:0 auto 36px;flex-wrap:wrap}.filters input{flex:2;min-width:200px;border-radius:30px}.filters select{flex:1;min-width:140px;border-radius:30px}`,
})
export class Rooms {
  private store = inject(Store);
  private router = inject(Router);
  q = signal('');
  sort = signal('');
  guests = signal(Number(inject(ActivatedRoute).snapshot.queryParamMap.get('guests') ?? 0));
  list = computed(() => {
    let l = this.store.rooms.filter(r =>
      r.name.toLowerCase().includes(this.q().toLowerCase()) && r.capacity >= this.guests());
    if (this.sort()) l = [...l].sort((a, b) => this.sort() === 'asc' ? a.price - b.price : b.price - a.price);
    return l;
  });
  book(r: Room) { this.store.add(r); this.router.navigate(['/booking']); }
}
