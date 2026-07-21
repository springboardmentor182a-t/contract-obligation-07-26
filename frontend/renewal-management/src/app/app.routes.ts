import { Routes } from '@angular/router';
import { authGuard, renewalAccessGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./pages/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },
  {
    path: 'renewals',
    canActivate: [renewalAccessGuard],
    loadComponent: () => import('./pages/renewal-dashboard/renewal-dashboard.component').then(m => m.RenewalDashboardComponent)
  },
  {
    path: 'renewals/:id',
    canActivate: [renewalAccessGuard],
    loadComponent: () => import('./pages/renewal-detail/renewal-detail.component').then(m => m.RenewalDetailComponent)
  }
];
