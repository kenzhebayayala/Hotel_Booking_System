import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="wrap" style="max-width:520px">
    <div class="page-title"><h1>Register</h1>
      <div class="crumbs">Already have an account? <a routerLink="/login" style="color:var(--blue)">Sign in</a></div></div>
    <form class="panel" (ngSubmit)="submit()">
      <label for="n">Your Name</label><input id="n" name="name" [(ngModel)]="name" required>
      <label for="e">Email</label><input id="e" name="email" type="email" [(ngModel)]="email" required>
      <label for="ph">Phone Number</label><input id="ph" name="phone" [(ngModel)]="phone">
      <label for="p">Password</label><input id="p" name="password" type="password" minlength="8" [(ngModel)]="password" required>
      <button class="btn blue" style="margin-top:20px" type="submit">Create account</button>
    </form>
  </div>`,
})
export class Register {
  private router = inject(Router);
  name = ''; email = ''; phone = ''; password = '';
  // TODO (Eleonora): POST /api/users/register/
  submit() { this.router.navigate(['/login']); }
}
