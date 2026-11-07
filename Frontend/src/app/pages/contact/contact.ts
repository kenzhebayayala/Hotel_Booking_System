import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="wrap" style="max-width:640px">
    <div class="page-title"><h1>Contact</h1><div class="crumbs"><a routerLink="/home">Home</a> &gt; Contact</div></div>
    <form class="panel" (ngSubmit)="sent = true">
      <label for="n">Name</label><input id="n" name="name" [(ngModel)]="name" required>
      <label for="e">Email</label><input id="e" name="email" type="email" [(ngModel)]="email" required>
      <label for="m">Message</label><textarea id="m" name="msg" rows="5" [(ngModel)]="msg" required></textarea>
      <button class="btn" style="margin-top:18px" type="submit">Send message</button>
      @if (sent) { <p style="color:#1d7a3c">Message sent. We will reply by email.</p> }
    </form>
  </div>`,
})
export class Contact { name = ''; email = ''; msg = ''; sent = false; }
