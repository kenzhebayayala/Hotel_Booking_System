import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then(m => m.About) },
  { path: 'rooms', loadComponent: () => import('./pages/rooms/rooms').then(m => m.Rooms) },
  { path: 'news', loadComponent: () => import('./pages/news/news').then(m => m.News) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then(m => m.Contact) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'booking', loadComponent: () => import('./pages/booking/booking').then(m => m.Booking) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
  { path: '**', redirectTo: 'home' },
  { path: 'booking/:roomId', loadComponent: () => import('./pages/booking/booking').then(m => m.Booking) },
  { path: 'payment/:bookingId', loadComponent: () => import('./pages/payment/payment').then(m => m.Payment) },
  { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings').then(m => m.MyBookings) },
];
