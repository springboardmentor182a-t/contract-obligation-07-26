import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthToken, User } from '../models/renewal.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  // Roles allowed to access the Renewal Module
  private readonly ALLOWED_ROLES = ['legal_manager', 'compliance_officer', 'contract_manager'];

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    try {
      const data = localStorage.getItem('contractiq_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('contractiq_token', response.access_token);
        localStorage.setItem('contractiq_user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('contractiq_token');
    localStorage.removeItem('contractiq_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('contractiq_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  hasRenewalAccess(): boolean {
    const user = this.getCurrentUser();
    return !!user && this.ALLOWED_ROLES.includes(user.role);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.API}/auth/me`);
  }
}
