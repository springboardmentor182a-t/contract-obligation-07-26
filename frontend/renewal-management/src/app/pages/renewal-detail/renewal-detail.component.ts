import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RenewalService } from '../../services/renewal.service';
import { AuthService } from '../../services/auth.service';
import { Renewal, User } from '../../models/renewal.models';

@Component({
  selector: 'app-renewal-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="detail-root">
  <div class="detail-topbar">
    <button class="back-btn" (click)="goBack()">← Back to Dashboard</button>
    <div class="topbar-actions" *ngIf="renewal">
      <span class="status-badge" [class]="'status-' + renewal.status">{{ renewal.status | titlecase }}</span>
      <button class="btn-outline" *ngIf="renewal.status === 'in_progress'" (click)="openCompleteModal()">Mark as Renewed</button>
    </div>
  </div>

  <div class="detail-loading" *ngIf="loading">
    <div class="spinner"></div><span>Loading renewal details...</span>
  </div>

  <div class="detail-content" *ngIf="renewal && !loading">
    <!-- Header -->
    <div class="detail-header">
      <div class="header-left">
        <span class="renewal-num-lg">{{ renewal.renewal_number }}</span>
        <h1>{{ renewal.contract.title }}</h1>
        <p class="vendor">{{ renewal.contract.vendor_name }} · {{ renewal.contract.category }}</p>
      </div>
      <div class="priority-pill" [class]="'priority-' + renewal.priority">
        {{ renewal.priority | titlecase }} Priority
      </div>
    </div>

    <!-- Key Dates -->
    <div class="dates-band">
      <div class="date-item">
        <span class="date-label">Contract Expiry</span>
        <span class="date-value" [class.urgent]="daysUntil(renewal.original_end_date) <= 30">
          {{ renewal.original_end_date | date:'MMMM d, y' }}
        </span>
        <span class="days-badge" [class.overdue]="daysUntil(renewal.original_end_date) < 0">
          {{ getDaysLabel(renewal.original_end_date) }}
        </span>
      </div>
      <div class="date-sep">→</div>
      <div class="date-item" *ngIf="renewal.proposed_end_date">
        <span class="date-label">Proposed Renewal Date</span>
        <span class="date-value">{{ renewal.proposed_end_date | date:'MMMM d, y' }}</span>
      </div>
      <div class="date-sep" *ngIf="renewal.renewed_end_date">→</div>
      <div class="date-item" *ngIf="renewal.renewed_end_date">
        <span class="date-label">Renewed Until</span>
        <span class="date-value success">{{ renewal.renewed_end_date | date:'MMMM d, y' }}</span>
      </div>
    </div>

    <div class="two-col">

      <!-- Left: Contract + Reminders -->
      <div class="col-left">

        <div class="detail-card">
          <h3 class="card-title">Contract Information</h3>
          <div class="info-grid">
            <div class="info-row"><span class="info-label">Contract #</span><span class="info-val mono">{{ renewal.contract.contract_number }}</span></div>
            <div class="info-row"><span class="info-label">Category</span><span class="info-val">{{ renewal.contract.category }}</span></div>
            <div class="info-row"><span class="info-label">Contract Value</span><span class="info-val">{{ formatCurrency(renewal.contract.value) }}</span></div>
            <div class="info-row"><span class="info-label">Renewal Value</span><span class="info-val highlight">{{ formatCurrency(renewal.renewal_value) }}</span></div>
            <div class="info-row"><span class="info-label">Assigned Manager</span><span class="info-val">{{ renewal.manager.full_name }}</span></div>
            <div class="info-row"><span class="info-label">Manager Role</span><span class="info-val">{{ renewal.manager.role | titlecase }}</span></div>
          </div>
          <div class="notes-box" *ngIf="renewal.notes">
            <span class="notes-label">Notes</span>
            <p>{{ renewal.notes }}</p>
          </div>
        </div>

        <!-- Reminder Schedule -->
        <div class="detail-card">
          <div class="card-title-row">
            <h3 class="card-title">Auto Reminder Schedule</h3>
            <button class="btn-sm" (click)="openReminderModal()">+ Add Custom</button>
          </div>
          <div class="reminder-list">
            <div class="reminder-row" *ngFor="let rem of renewal.reminders" [class.sent]="rem.is_sent">
              <div class="rem-type-badge">{{ rem.reminder_type }}</div>
              <div class="rem-info">
                <span class="rem-date">{{ rem.scheduled_date | date:'MMM d, y' }}</span>
                <span class="rem-email">{{ rem.recipient_email }}</span>
              </div>
              <div class="rem-status">
                <span *ngIf="rem.is_sent" class="tag-sent">✓ Sent</span>
                <span *ngIf="!rem.is_sent" class="tag-pending">Pending</span>
              </div>
            </div>
            <div class="empty-list" *ngIf="renewal.reminders.length === 0">No reminders scheduled yet</div>
          </div>
        </div>

      </div>

      <!-- Right: Approval + History -->
      <div class="col-right">

        <!-- Approval Workflow -->
        <div class="detail-card">
          <h3 class="card-title">Approval Workflow</h3>
          <div class="approval-list">
            <div class="approval-row" *ngFor="let ap of renewal.approvals">
              <div class="ap-step">Step {{ ap.step }}</div>
              <div class="ap-info">
                <span class="ap-name">{{ ap.approver.full_name }}</span>
                <span class="ap-role">{{ ap.approver.role | titlecase }}</span>
                <span class="ap-comment" *ngIf="ap.comments">{{ ap.comments }}</span>
                <span class="ap-date" *ngIf="ap.decided_at">{{ ap.decided_at | date:'MMM d, y h:mm a' }}</span>
              </div>
              <span class="ap-status" [class]="'ap-' + ap.status">{{ ap.status | titlecase }}</span>
            </div>
            <div class="empty-list" *ngIf="renewal.approvals.length === 0">No approval records</div>
          </div>

          <!-- Approve/Reject if pending -->
          <div class="approval-actions" *ngIf="hasPendingApproval()">
            <p class="pending-notice">⏳ Your approval is required for this renewal</p>
            <textarea class="comment-input" [(ngModel)]="approvalComment" placeholder="Add comments (optional)..." rows="2"></textarea>
            <div class="approve-btns">
              <button class="btn-danger-sm" (click)="submitApproval('rejected')">✕ Reject</button>
              <button class="btn-success-sm" (click)="submitApproval('approved')">✓ Approve</button>
            </div>
          </div>
        </div>

        <!-- Renewal History -->
        <div class="detail-card">
          <h3 class="card-title">Renewal History</h3>
          <div class="history-timeline">
            <div class="history-item" *ngFor="let h of renewal.history">
              <div class="history-dot" [class]="getHistoryColor(h.action)"></div>
              <div class="history-body">
                <div class="history-action">{{ formatAction(h.action) }}</div>
                <div class="history-meta">
                  <span>{{ h.changed_by }}</span>
                  <span class="history-sep">·</span>
                  <span>{{ h.changed_by_role | titlecase }}</span>
                  <span class="history-sep">·</span>
                  <span>{{ h.created_at | date:'MMM d, y' }}</span>
                </div>
                <div class="history-remarks" *ngIf="h.remarks">{{ h.remarks }}</div>
                <div class="status-change" *ngIf="h.old_status && h.new_status">
                  <span class="old-s">{{ h.old_status }}</span>
                  <span>→</span>
                  <span class="new-s">{{ h.new_status }}</span>
                </div>
              </div>
            </div>
            <div class="empty-list" *ngIf="renewal.history.length === 0">No history recorded</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- Complete Modal -->
<div class="overlay" *ngIf="showCompleteModal" (click)="showCompleteModal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>Mark as Renewed</h3><button class="modal-close" (click)="showCompleteModal=false">✕</button></div>
    <div class="modal-body">
      <label>New Contract End Date</label>
      <input type="date" class="modal-input" [(ngModel)]="renewedDate" />
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" (click)="showCompleteModal=false">Cancel</button>
      <button class="btn-success-sm" style="padding:10px 20px" (click)="submitComplete()">Confirm Renewal</button>
    </div>
  </div>
</div>

<!-- Custom Reminder Modal -->
<div class="overlay" *ngIf="showReminderModal" (click)="showReminderModal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header"><h3>Add Custom Reminder</h3><button class="modal-close" (click)="showReminderModal=false">✕</button></div>
    <div class="modal-body">
      <label>Scheduled Date</label>
      <input type="date" class="modal-input" [(ngModel)]="customReminder.scheduled_date" />
      <label style="margin-top:12px">Recipient Email</label>
      <input type="email" class="modal-input" [(ngModel)]="customReminder.recipient_email" placeholder="email@example.com" />
      <label style="margin-top:12px">Message</label>
      <textarea class="modal-input" [(ngModel)]="customReminder.message" rows="3" placeholder="Reminder message..."></textarea>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" (click)="showReminderModal=false">Cancel</button>
      <button class="btn-primary" (click)="submitReminder()">Schedule Reminder</button>
    </div>
  </div>
</div>
  `,
  styles: [`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:host { display: block; font-family: 'Inter', sans-serif; }

.detail-root {
  min-height: 100vh;
  background: #080910;
  color: white;
  padding: 24px 32px;
}

.detail-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}

.back-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.65);
  padding: 10px 16px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.09); color: white; }
}

.topbar-actions { display: flex; gap: 10px; align-items: center; }

.status-badge {
  font-size: 0.75rem; font-weight: 700;
  padding: 5px 14px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.status-upcoming { background: rgba(52,152,219,.15); color: #5dade2; }
.status-in_progress { background: rgba(108,99,255,.15); color: #a09af5; }
.status-renewed { background: rgba(72,201,176,.15); color: #48C9B0; }
.status-expired { background: rgba(231,76,60,.15); color: #e74c3c; }
.status-cancelled { background: rgba(127,140,141,.15); color: #95a5a6; }

.btn-outline {
  padding: 10px 18px;
  background: transparent;
  border: 1px solid rgba(72,201,176,0.4);
  color: #48C9B0;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(72,201,176,0.1); }
}

.detail-loading {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; height: 60vh; color: rgba(255,255,255,0.4);
}

.spinner {
  width: 36px; height: 36px;
  border: 3px solid rgba(108,99,255,0.2);
  border-top-color: #6C63FF;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.detail-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24px; flex-wrap: wrap; gap: 16px;
}

.renewal-num-lg {
  display: block; font-size: 0.75rem; color: rgba(255,255,255,0.4);
  font-family: monospace; margin-bottom: 6px;
}

h1 { font-size: 1.6rem; font-weight: 800; line-height: 1.2; margin-bottom: 6px; }
.vendor { font-size: 0.85rem; color: rgba(255,255,255,0.45); }

.priority-pill {
  padding: 6px 16px; border-radius: 20px; font-size: 0.78rem; font-weight: 700;
}
.priority-critical { background: rgba(231,76,60,0.2); color: #e74c3c; }
.priority-high { background: rgba(230,126,34,0.2); color: #e67e22; }
.priority-medium { background: rgba(243,156,18,0.2); color: #f39c12; }
.priority-low { background: rgba(72,201,176,0.2); color: #48C9B0; }

.dates-band {
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 20px 24px; margin-bottom: 24px;
}

.date-item { display: flex; flex-direction: column; gap: 4px; }
.date-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
.date-value { font-size: 1.05rem; font-weight: 700; color: white; &.urgent { color: #e67e22; } &.success { color: #48C9B0; } }
.days-badge { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.45); &.overdue { color: #e74c3c; } }
.date-sep { font-size: 1.2rem; color: rgba(255,255,255,0.2); }

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

.col-left, .col-right { display: flex; flex-direction: column; gap: 20px; }

.detail-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; padding: 20px;
}

.card-title { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
.card-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

.info-grid { display: flex; flex-direction: column; gap: 10px; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.04); &:last-child { border: none; padding: 0; } }
.info-label { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.info-val { font-size: 0.85rem; font-weight: 600; color: white; &.mono { font-family: monospace; font-size: 0.78rem; } &.highlight { color: #48C9B0; } }

.notes-box { margin-top: 14px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px; }
.notes-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); text-transform: uppercase; display: block; margin-bottom: 6px; }
.notes-box p { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.5; }

.reminder-list, .approval-list { display: flex; flex-direction: column; gap: 10px; }
.reminder-row {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  background: rgba(255,255,255,0.03); border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.05);
  &.sent { border-color: rgba(72,201,176,0.15); }
}
.rem-type-badge { font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; background: rgba(108,99,255,0.15); color: #a09af5; flex-shrink: 0; }
.rem-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.rem-date { font-size: 0.82rem; font-weight: 600; color: white; }
.rem-email { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
.tag-sent { font-size: 0.72rem; font-weight: 600; color: #48C9B0; }
.tag-pending { font-size: 0.72rem; color: rgba(255,255,255,0.35); }

.empty-list { font-size: 0.82rem; color: rgba(255,255,255,0.25); text-align: center; padding: 20px; }

.approval-row {
  display: flex; align-items: flex-start; gap: 12px; padding: 12px;
  background: rgba(255,255,255,0.03); border-radius: 10px;
}
.ap-step { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 8px; flex-shrink: 0; }
.ap-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.ap-name { font-size: 0.85rem; font-weight: 600; color: white; }
.ap-role { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
.ap-comment { font-size: 0.78rem; color: rgba(255,255,255,0.55); font-style: italic; }
.ap-date { font-size: 0.7rem; color: rgba(255,255,255,0.3); }
.ap-status { font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; flex-shrink: 0; }
.ap-pending { background: rgba(243,156,18,0.15); color: #f39c12; }
.ap-approved { background: rgba(72,201,176,0.15); color: #48C9B0; }
.ap-rejected { background: rgba(231,76,60,0.15); color: #e74c3c; }

.approval-actions { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 10px; }
.pending-notice { font-size: 0.82rem; color: #f39c12; background: rgba(243,156,18,0.1); padding: 10px 14px; border-radius: 8px; }
.comment-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-family: 'Inter', sans-serif; font-size: 0.85rem; padding: 10px 14px; outline: none; width: 100%; resize: vertical; }
.approve-btns { display: flex; gap: 10px; }
.btn-danger-sm { flex: 1; padding: 8px; background: rgba(231,76,60,0.15); border: 1px solid rgba(231,76,60,0.3); color: #e74c3c; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; }
.btn-success-sm { flex: 1; padding: 8px; background: linear-gradient(135deg, #27ae60, #1e8449); border: none; color: white; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; }

.history-timeline { display: flex; flex-direction: column; gap: 14px; }
.history-item { display: flex; gap: 12px; }
.history-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.dot-green { background: #48C9B0; }
.dot-blue { background: #5dade2; }
.dot-purple { background: #a09af5; }
.dot-red { background: #e74c3c; }
.dot-grey { background: #7f8c8d; }
.history-body { flex: 1; }
.history-action { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); }
.history-meta { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 2px; }
.history-sep { margin: 0 4px; }
.history-remarks { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 4px; }
.status-change { display: flex; gap: 6px; align-items: center; font-size: 0.72rem; margin-top: 4px; }
.old-s { color: rgba(255,255,255,0.4); }
.new-s { color: #48C9B0; font-weight: 600; }

/* Modal */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; }
.modal { background: #131428; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 480px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); h3 { font-size: 1rem; font-weight: 700; color: white; } }
.modal-close { background: transparent; border: none; color: rgba(255,255,255,0.4); font-size: 1rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; label { font-size: 0.8rem; color: rgba(255,255,255,0.5); } }
.modal-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; font-family: 'Inter', sans-serif; font-size: 0.88rem; padding: 10px 14px; outline: none; width: 100%; }
.modal-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: flex-end; gap: 10px; }
.btn-ghost { padding: 10px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.6); font-family: 'Inter', sans-serif; font-size: 0.85rem; cursor: pointer; }
.btn-primary { padding: 10px 20px; background: linear-gradient(135deg, #6C63FF, #9B59B6); color: white; border: none; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 600; cursor: pointer; }
.btn-sm { padding: 6px 12px; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.25); color: #a09af5; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
  `]
})
export class RenewalDetailComponent implements OnInit {
  renewal: Renewal | null = null;
  loading = true;
  currentUser: User | null = null;
  approvalComment = '';
  showCompleteModal = false;
  showReminderModal = false;
  renewedDate = '';
  customReminder = { scheduled_date: '', recipient_email: '', message: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renewalService: RenewalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRenewal(id);
  }

  loadRenewal(id: number): void {
    this.loading = true;
    this.renewalService.getRenewal(id).subscribe({
      next: r => { this.renewal = r; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/renewals']); }
    });
  }

  goBack(): void { this.router.navigate(['/renewals']); }

  daysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  }

  getDaysLabel(dateStr: string): string {
    const d = this.daysUntil(dateStr);
    if (d < 0) return `${Math.abs(d)} days overdue`;
    if (d === 0) return 'Expires today';
    return `${d} days remaining`;
  }

  formatCurrency(val: number | undefined): string {
    if (!val) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }

  hasPendingApproval(): boolean {
    return this.renewal?.approvals?.some(a => a.status === 'pending' && a.approver.id === this.currentUser?.id) ?? false;
  }

  submitApproval(status: 'approved' | 'rejected'): void {
    if (!this.renewal) return;
    this.renewalService.approveRenewal(this.renewal.id, status, this.approvalComment).subscribe({
      next: () => this.loadRenewal(this.renewal!.id),
      error: err => alert(err.error?.detail || 'Approval failed.')
    });
  }

  openCompleteModal(): void {
    if (this.renewal?.proposed_end_date) {
      this.renewedDate = this.renewal.proposed_end_date;
    } else {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      this.renewedDate = d.toISOString().split('T')[0];
    }
    this.showCompleteModal = true;
  }

  submitComplete(): void {
    if (!this.renewal || !this.renewedDate) return;
    this.renewalService.completeRenewal(this.renewal.id, this.renewedDate).subscribe({
      next: () => { this.showCompleteModal = false; this.loadRenewal(this.renewal!.id); },
      error: err => alert(err.error?.detail || 'Could not complete renewal.')
    });
  }

  openReminderModal(): void {
    this.customReminder = {
      scheduled_date: '',
      recipient_email: this.renewal?.manager.email || '',
      message: ''
    };
    this.showReminderModal = true;
  }

  submitReminder(): void {
    if (!this.renewal || !this.customReminder.scheduled_date || !this.customReminder.recipient_email) {
      alert('Date and email are required.');
      return;
    }
    this.renewalService.addCustomReminder({
      renewal_id: this.renewal.id,
      ...this.customReminder
    }).subscribe({
      next: () => { this.showReminderModal = false; this.loadRenewal(this.renewal!.id); },
      error: err => alert(err.error?.detail || 'Failed to schedule reminder.')
    });
  }

  formatAction(action: string): string {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getHistoryColor(action: string): string {
    if (action.includes('CREATED')) return 'history-dot dot-blue';
    if (action.includes('APPROVED') || action.includes('COMPLETED') || action.includes('RENEWED')) return 'history-dot dot-green';
    if (action.includes('REJECTED') || action.includes('EXPIRED')) return 'history-dot dot-red';
    if (action.includes('REMINDER')) return 'history-dot dot-purple';
    return 'history-dot dot-grey';
  }
}
