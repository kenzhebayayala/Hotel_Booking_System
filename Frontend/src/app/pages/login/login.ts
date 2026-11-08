import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      <p>Do not have an account? <a routerLink="/register" class="lnk">Register here</a></p>
      <label for="e">Username</label><input id="e" name="username" [(ngModel)]="username" placeholder="Enter username" required>
      <label for="p">Password</label><input id="p" name="password" type="password" [(ngModel)]="password" placeholder="Enter password" required>
      @if (error) { <p style="color:#b3261e" role="alert">{{ error }}</p> }
      <button class="btn blue" style="margin-top:16px" type="submit">Sign in</button>
    </form>
  </div>`,
  styles: `
  .split{display:grid;grid-template-columns:1.3fr 1fr;min-height:calc(100vh - 64px)}
  .form{padding:80px 40px;max-width:520px}.form h2{font-size:30px;font-weight:700}
  .lnk{color:var(--blue);font-weight:600;cursor:pointer}
  @media(max-width:800px){.split{grid-template-columns:1fr}.pic{display:none}}`,
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);
  username = ''; password = ''; error = '';

  // TODO (Eleonora): email login, refresh token, logout
  submit() {
    this.error = '';
    this.http.post<any>('http://127.0.0.1:8000/api/token/', { username: this.username, password: this.password })
      .subscribe({
        next: t => { localStorage.setItem('access', t.access); this.router.navigate(['/rooms']); },
        error: () => this.error = 'Wrong username or password.',
      });
  }
}
