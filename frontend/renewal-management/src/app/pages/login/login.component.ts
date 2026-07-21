import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-root">
      <!-- Left panel: branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="logo-ring">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="url(#g1)" stroke-width="3"/>
              <path d="M14 24h20M24 14v20" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="24" cy="24" r="6" fill="url(#g2)"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stop-color="#6C63FF"/>
                  <stop offset="100%" stop-color="#48C9B0"/>
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="48" y2="48">
                  <stop offset="0%" stop-color="#6C63FF"/>
                  <stop offset="100%" stop-color="#48C9B0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="brand-name">ContractIQ</h1>
          <p class="brand-tagline">Contract Obligation & Compliance Platform</p>
          <div class="module-badge">
            <span class="badge-dot"></span>
            Renewal Management Module
          </div>
          <div class="feature-pills">
            <span class="pill">📅 Renewal Tracking</span>
            <span class="pill">⏰ Expiry Monitoring</span>
            <span class="pill">🔔 Auto Reminders</span>
            <span class="pill">✅ Approval Workflow</span>
            <span class="pill">📊 Renewal History</span>
          </div>
          <div class="access-notice">
            <div class="notice-icon">🔐</div>
            <div>
              <strong>Restricted Access</strong>
              <p>This module is accessible to:</p>
              <ul>
                <li>Legal Manager</li>
                <li>Compliance Officer</li>
                <li>Contract Manager</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel: form -->
      <div class="form-panel">
        <div class="form-card">
          <div class="form-header">
            <h2>Welcome back</h2>
            <p>Sign in to access your Renewal Dashboard</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" autocomplete="on">
            <div class="field-group">
              <label for="email">Email Address</label>
              <div class="input-wrap" [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <span class="input-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="you@contractiq.com"
                  autocomplete="email"
                />
              </div>
              <span class="field-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Valid email is required
              </span>
            </div>

            <div class="field-group">
              <label for="password">Password</label>
              <div class="input-wrap" [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <span class="input-icon">🔒</span>
                <input
                  id="password"
                  [type]="showPwd ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <button type="button" class="toggle-pwd" (click)="showPwd = !showPwd">
                  {{ showPwd ? '🙈' : '👁' }}
                </button>
              </div>
              <span class="field-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </span>
            </div>

            <div class="alert-error" *ngIf="errorMsg">
              <span>⚠️</span> {{ errorMsg }}
            </div>

            <button type="submit" class="btn-submit" [class.loading]="loading" [disabled]="loading">
              <span *ngIf="!loading">Sign In to ContractIQ</span>
              <span *ngIf="loading" class="loader-dots">
                <span></span><span></span><span></span>
              </span>
            </button>
          </form>

          <div class="demo-creds">
            <p class="demo-label">Demo Credentials</p>
            <div class="cred-grid">
              <button class="cred-btn" (click)="fillCred('legal.manager@contractiq.com', 'Password@123')">
                <span class="cred-role">Legal Manager</span>
                <span class="cred-email">sarah.mitchell</span>
              </button>
              <button class="cred-btn" (click)="fillCred('compliance@contractiq.com', 'Password@123')">
                <span class="cred-role">Compliance Officer</span>
                <span class="cred-email">david.chen</span>
              </button>
              <button class="cred-btn" (click)="fillCred('contracts@contractiq.com', 'Password@123')">
                <span class="cred-role">Contract Manager</span>
                <span class="cred-email">priya.sharma</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .login-root {
      display: flex;
      min-height: 100vh;
      font-family: 'Inter', sans-serif;
      background: #0a0b14;
    }

    /* ── Brand Panel ── */
    .brand-panel {
      flex: 0 0 440px;
      background: linear-gradient(160deg, #0f0e2a 0%, #13162e 50%, #0d1a2a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
      position: relative;
      overflow: hidden;
    }

    .brand-panel::before {
      content: '';
      position: absolute;
      top: -120px; left: -120px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .brand-panel::after {
      content: '';
      position: absolute;
      bottom: -80px; right: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(72,201,176,0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .brand-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .logo-ring {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px; height: 80px;
      background: rgba(108,99,255,0.12);
      border-radius: 24px;
      margin-bottom: 20px;
      border: 1px solid rgba(108,99,255,0.3);
    }

    .brand-name {
      font-size: 2.4rem;
      font-weight: 800;
      background: linear-gradient(135deg, #6C63FF, #48C9B0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      color: rgba(255,255,255,0.5);
      font-size: 0.85rem;
      margin-top: 6px;
      margin-bottom: 28px;
    }

    .module-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(108,99,255,0.15);
      border: 1px solid rgba(108,99,255,0.3);
      color: #a09af5;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 32px;
    }

    .badge-dot {
      width: 6px; height: 6px;
      background: #6C63FF;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.4); }
    }

    .feature-pills {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 32px;
    }

    .pill {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.7);
      font-size: 0.82rem;
      padding: 8px 16px;
      border-radius: 10px;
      transition: all 0.2s;
    }

    .pill:hover {
      background: rgba(108,99,255,0.1);
      border-color: rgba(108,99,255,0.2);
    }

    .access-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(72,201,176,0.08);
      border: 1px solid rgba(72,201,176,0.2);
      border-radius: 14px;
      padding: 16px;
      text-align: left;
    }

    .notice-icon { font-size: 1.4rem; }

    .access-notice strong {
      color: #48C9B0;
      font-size: 0.85rem;
      display: block;
      margin-bottom: 4px;
    }

    .access-notice p {
      color: rgba(255,255,255,0.5);
      font-size: 0.75rem;
      margin-bottom: 4px;
    }

    .access-notice ul {
      list-style: none;
      color: rgba(255,255,255,0.7);
      font-size: 0.8rem;
    }

    .access-notice ul li::before {
      content: '✓ ';
      color: #48C9B0;
    }

    /* ── Form Panel ── */
    .form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: #0d0e1a;
    }

    .form-card {
      width: 100%;
      max-width: 440px;
    }

    .form-header {
      margin-bottom: 36px;
    }

    .form-header h2 {
      font-size: 1.9rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .form-header p {
      color: rgba(255,255,255,0.45);
      font-size: 0.9rem;
    }

    .field-group {
      margin-bottom: 20px;
    }

    .field-group label {
      display: block;
      color: rgba(255,255,255,0.65);
      font-size: 0.82rem;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .input-wrap {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input-wrap:focus-within {
      border-color: #6C63FF;
      box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
    }

    .input-wrap.error {
      border-color: #ff6b6b;
    }

    .input-icon {
      padding: 0 14px;
      font-size: 1rem;
      opacity: 0.6;
    }

    .input-wrap input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 0.92rem;
      font-family: 'Inter', sans-serif;
      padding: 14px 0;
    }

    .input-wrap input::placeholder { color: rgba(255,255,255,0.25); }

    .toggle-pwd {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0 14px;
      font-size: 1rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .toggle-pwd:hover { opacity: 1; }

    .field-error {
      display: block;
      color: #ff8a8a;
      font-size: 0.75rem;
      margin-top: 5px;
    }

    .alert-error {
      background: rgba(255,107,107,0.1);
      border: 1px solid rgba(255,107,107,0.3);
      color: #ff9999;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin-bottom: 18px;
    }

    .btn-submit {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #6C63FF, #9B59B6);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(108,99,255,0.4);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loader-dots {
      display: inline-flex;
      gap: 6px;
    }

    .loader-dots span {
      width: 6px; height: 6px;
      background: white;
      border-radius: 50%;
      animation: blink 1.2s infinite;
    }

    .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loader-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 80%, 100% { opacity: 0.2; }
      40% { opacity: 1; }
    }

    .demo-creds {
      margin-top: 32px;
      border-top: 1px solid rgba(255,255,255,0.07);
      padding-top: 24px;
    }

    .demo-label {
      color: rgba(255,255,255,0.35);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .cred-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cred-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 10px;
      padding: 10px 14px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .cred-btn:hover {
      background: rgba(108,99,255,0.08);
      border-color: rgba(108,99,255,0.25);
    }

    .cred-role {
      font-size: 0.82rem;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
    }

    .cred-email {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.35);
    }

    @media (max-width: 768px) {
      .login-root { flex-direction: column; }
      .brand-panel { flex: none; padding: 32px 24px; }
      .feature-pills { flex-direction: row; flex-wrap: wrap; justify-content: center; }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  showPwd = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // If already logged in, redirect
    if (this.authService.hasRenewalAccess()) {
      this.router.navigate(['/renewals']);
    }
  }

  fillCred(email: string, password: string): void {
    this.loginForm.patchValue({ email, password });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        if (!this.authService.hasRenewalAccess()) {
          this.authService.logout();
          this.errorMsg = `Access denied. Your role (${response.user.role.replace('_', ' ')}) cannot access the Renewal Management Module.`;
        } else {
          this.router.navigate(['/renewals']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.detail || 'Login failed. Please check your credentials.';
      }
    });
  }
}
