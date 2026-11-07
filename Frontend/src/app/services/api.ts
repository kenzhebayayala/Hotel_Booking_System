import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Api {
  private http = inject(HttpClient);
  private base = 'http://127.0.0.1:8000/api';
  private headers() {
    const t = localStorage.getItem('access');
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
  get<T>(path: string) { return this.http.get<T>(`${this.base}/${path}`, { headers: this.headers() }); }
  post<T>(path: string, body: unknown = {}) { return this.http.post<T>(`${this.base}/${path}`, body, { headers: this.headers() }); }
}
