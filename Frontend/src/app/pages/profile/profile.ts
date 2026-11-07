import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  template: `
  <div class="wrap" style="max-width:900px;margin-top:50px">
    <div class="panel">
      <h2 style="font-weight:700">Profile</h2>
      <div class="cover img" style="background-image:url('/assets/images/cover.jpg')"></div>
      <div class="ava img" style="background-image:url('/assets/images/avatar.jpg')"></div>
      <form (ngSubmit)="save()" class="two">
        <div><label for="n">Your Name</label><input id="n" name="name" [(ngModel)]="user.name"></div>
        <div><label for="e">Email</label><input id="e" name="email" [(ngModel)]="user.email"></div>
        <div><label for="p">Phone Number</label><input id="p" name="phone" [(ngModel)]="user.phone"></div>
        <div><label for="a">Address</label><input id="a" name="address" [(ngModel)]="user.address"></div>
        <button class="btn" style="grid-column:1/-1;margin-top:20px" type="submit">Save changes</button>
      </form>
      @if (saved) { <p style="color:#1d7a3c">Changes saved.</p> }
    </div>
  </div>`,
  styles: `.cover{height:200px;margin-top:14px;border-radius:4px}.ava{width:120px;height:120px;border-radius:50%;border:4px solid #fff;margin:-60px auto 10px;position:relative;background-color:#cfc8bd}`,
})
export class Profile {
  user = { name: '', email: '', phone: '', address: '' };
  saved = false;
  // TODO (Eleonora): GET/PUT /api/users/me/
  save() { this.saved = true; }
}
