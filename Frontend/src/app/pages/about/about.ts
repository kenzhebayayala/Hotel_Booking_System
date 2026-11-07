import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
  <div class="wrap">
    <div class="page-title"><h1>About Us</h1><div class="crumbs"><a routerLink="/home">Home</a> &gt; About Us</div></div>
    <div class="cols">
      <div><h2>Welcome to our hotels.</h2>
        <p>Replace this text with your team's description of the booking system and partner hotels.</p></div>
      <ul><li>20% off on accommodation</li><li>Complimentary daily breakfast</li><li>Free Wi-Fi</li><li>24/7 support</li></ul>
    </div>
    <h2 style="text-align:center;margin:70px 0 30px;font-weight:700">Our results in numbers</h2>
    <div class="nums"><div><b>120</b>Hotels</div><div><b>2 400</b>Rooms</div><div><b>15 000</b>Bookings</div><div><b>4.8</b>Average rating</div></div>
  </div>`,
  styles: `.cols{display:grid;grid-template-columns:1fr 1fr;gap:40px}h2{font-size:34px}p,li{color:var(--muted);line-height:1.7;font-size:17px}ul{list-style:none;padding:0}
  .nums{display:flex;justify-content:space-around;text-align:center;flex-wrap:wrap;gap:20px}.nums b{display:block;font:500 40px 'Lora',serif;color:var(--gold)}
  @media(max-width:700px){.cols{grid-template-columns:1fr}}`,
})
export class About {}
