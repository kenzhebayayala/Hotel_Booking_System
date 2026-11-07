import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [RouterLink],
  template: `
  <div class="wrap">
    <div class="page-title"><h1>LATEST BLOGS</h1><div class="crumbs"><a routerLink="/home">Home</a> &gt; News</div></div>
    <div class="grid3">
      @for (p of posts; track p.title) {
        <article class="post img" [style.background-image]="'url(' + p.image + ')'">
          <div class="cap"><time>{{ p.date }}</time><h3>{{ p.title }}</h3><p>{{ p.text }}</p></div>
        </article>
      }
    </div>
  </div>`,
  styles: `.post{height:340px;border-radius:6px;position:relative;overflow:hidden}
  .cap{position:absolute;inset:auto 0 0 0;padding:70px 20px 20px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.7))}
  time{color:#f5c542;font-weight:600;font-size:14px}h3{font-weight:700;margin:6px 0}p{margin:0;font-size:14px}`,
})
export class News {
  // TODO: load from API when a blog endpoint exists
  posts = [
    { date: '2026-06-10', title: 'Adventure Time', text: 'Exploring the Alps.', image: 'assets/images/news1.jpg' },
    { date: '2026-06-15', title: 'Beach Vacation', text: 'Relaxing in the Maldives.', image: 'assets/images/news2.jpg' },
    { date: '2026-06-20', title: 'Historic Tour', text: 'Ancient Rome discoveries.', image: 'assets/images/news3.jpg' },
  ];
}
