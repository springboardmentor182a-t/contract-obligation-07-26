import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="denied-root">
      <div class="denied-card">
        <div class="icon-wrapper">
          <div class="icon-bg">
            <span class="icon">🔒</span>
          </div>
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
        </div>
        <h1>Access Restricted</h1>
        <p class="subtitle">You don't have permission to access the <strong>Renewal Management Module</strong>.</p>
        <div class="role-info" *ngIf="currentUser">
          <span class="role-chip">Your role: {{ currentUser.role | titlecase }}</span>
        </div>
        <div class="allowed-roles">
          <p class="allowed-title">This module is accessible to:</p>
          <div class="roles">
            <span class="role-allowed">✔ Legal Manager</span>
            <span class="role-allowed">✔ Compliance Officer</span>
            <span class="role-allowed">✔ Contract Manager</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn-back" (click)="goBack()">← Go Back</button>
          <button class="btn-logout" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .denied-root {
      min-height: 100vh;
      background: #0a0b14;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      padding: 24px;
    }

    .denied-card {
      text-align: center;
      max-width: 480px;
      width: 100%;
    }

    .icon-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 32px;
    }

    .icon-bg {
      width: 100px; height: 100px;
      background: rgba(255,107,107,0.1);
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      position: relative;
      z-index: 2;
      border: 1px solid rgba(255,107,107,0.2);
    }

    .ring {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(255,107,107,0.15);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }

    .ring-1 { width: 140px; height: 140px; animation: expand 2s infinite; }
    .ring-2 { width: 180px; height: 180px; animation: expand 2s 0.5s infinite; }

    @keyframes expand {
      0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 12px;
    }

    .subtitle {
      color: rgba(255,255,255,0.5);
      font-size: 0.95rem;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .subtitle strong { color: rgba(255,255,255,0.8); }

    .role-info { margin-bottom: 24px; }

    .role-chip {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .allowed-roles {
      background: rgba(72,201,176,0.07);
      border: 1px solid rgba(72,201,176,0.2);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 32px;
    }

    .allowed-title {
      color: rgba(255,255,255,0.45);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .roles { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

    .role-allowed {
      background: rgba(72,201,176,0.1);
      color: #48C9B0;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .actions { display: flex; gap: 12px; }

    .btn-back, .btn-logout {
      flex: 1;
      padding: 13px;
      border-radius: 12px;
      border: none;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-back {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .btn-back:hover { background: rgba(255,255,255,0.1); }

    .btn-logout {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
    }

    .btn-logout:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(255,107,107,0.35);
    }
  `]
})
export class AccessDeniedComponent {
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.getCurrentUser();
  }

  goBack(): void { window.history.back(); }
  logout(): void { this.authService.logout(); }
}
