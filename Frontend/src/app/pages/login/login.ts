import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="split">
    <div class="pic img" style="background-image:url('/assets/images/login.jpg')"></div>
    <form class="form" (ngSubmit)="submit()">
      <h2>Sign in</h2>
      <p>Don't have an account? <a routerLink="/register" class="lnk">Register here</a></p>
      <label for="e">Email</label><input id="e" name="email" type="email" [(ngModel)]="email" placeholder="Enter email" required>
      <label for="p">Password</label><input id="p" name="password" type="password" [(ngModel)]="password" placeholder="Enter password" required>
      <div class="opts"><label><input type="checkbox" name="rem" style="width:auto"> Remember me</label><a class="lnk">Forgot Password?</a></div>
      <button class="btn blue" type="submit">Sign in</button>
    </form>
  </div>`,
  styles: `
  .split{display:grid;grid-template-columns:1.3fr 1fr;min-height:calc(100vh - 70px)}
  .form{padding:80px 40px;max-width:520px}.form h2{font-size:30px;font-weight:700}
  .lnk{color:var(--blue);font-weight:600;cursor:pointer}
  .opts{display:flex;justify-content:space-between;align-items:center;margin:8px 0 20px}
  @media(max-width:800px){.split{grid-template-columns:1fr}.pic{display:none}}`,
})
export class Login {
  private router = inject(Router);
  email = ''; password = '';
  // TODO (Eleonora): POST /api/token/ and save JWT
  submit() { this.router.navigate(['/profile']); }
}
