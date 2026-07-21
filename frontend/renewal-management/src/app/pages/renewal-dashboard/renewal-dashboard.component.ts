import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RenewalService } from '../../services/renewal.service';
import { AuthService } from '../../services/auth.service';
import { Renewal, RenewalStats, User } from '../../models/renewal.models';

@Component({
  selector: 'app-renewal-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './renewal-dashboard.component.html',
  styleUrls: ['./renewal-dashboard.component.scss']
})
export class RenewalDashboardComponent implements OnInit {
  stats: RenewalStats | null = null;
  renewals: Renewal[] = [];
  filteredRenewals: Renewal[] = [];
  currentUser: User | null = null;
  loading = true;
  statsLoading = true;
  showCreateModal = false;
  showApprovalModal = false;
  selectedRenewal: Renewal | null = null;
  approvalComment = '';
  searchQuery = '';
  statusFilter = '';
  priorityFilter = '';
  activeTab = 'all';
  createLoading = false;
  createError = '';

  // Create form
  newRenewal = {
    contract_id: 0,
    manager_id: 0,
    original_end_date: '',
    proposed_end_date: '',
    renewal_value: null as number | null,
    notes: '',
    priority: 'medium'
  };

  users: User[] = [];

  statusLabels: Record<string, string> = {
    upcoming: 'Upcoming',
    in_progress: 'In Progress',
    renewed: 'Renewed',
    expired: 'Expired',
    cancelled: 'Cancelled'
  };

  priorityColors: Record<string, string> = {
    low: '#48C9B0', medium: '#f39c12', high: '#e67e22', critical: '#e74c3c'
  };

  constructor(
    private renewalService: RenewalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadStats();
    this.loadRenewals();
    this.loadUsers();
  }

  loadStats(): void {
    this.statsLoading = true;
    this.renewalService.getStats().subscribe({
      next: s => { this.stats = s; this.statsLoading = false; },
      error: () => { this.statsLoading = false; }
    });
  }

  loadRenewals(): void {
    this.loading = true;
    const filters: any = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.priorityFilter) filters.priority = this.priorityFilter;
    if (this.searchQuery) filters.search = this.searchQuery;

    this.renewalService.getRenewals(filters).subscribe({
      next: r => {
        this.renewals = r;
        this.applyTabFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadUsers(): void {
    this.renewalService.getUsers().subscribe({
      next: u => this.users = u,
      error: () => {}
    });
  }

  applyTabFilter(): void {
    if (this.activeTab === 'all') {
      this.filteredRenewals = this.renewals;
    } else {
      this.filteredRenewals = this.renewals.filter(r => r.status === this.activeTab);
    }
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyTabFilter();
  }

  onSearch(): void { this.loadRenewals(); }
  onFilterChange(): void { this.loadRenewals(); }
  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.activeTab = 'all';
    this.loadRenewals();
  }

  openDetail(id: number): void {
    this.router.navigate(['/renewals', id]);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newRenewal = {
      contract_id: 0,
      manager_id: this.currentUser?.id || 0,
      original_end_date: '',
      proposed_end_date: '',
      renewal_value: null,
      notes: '',
      priority: 'medium'
    };
    this.createError = '';
  }

  closeCreateModal(): void { this.showCreateModal = false; }

  submitCreate(): void {
    if (!this.newRenewal.contract_id || !this.newRenewal.original_end_date) {
      this.createError = 'Contract ID and expiry date are required.';
      return;
    }
    this.createLoading = true;
    const payload: any = {
      contract_id: Number(this.newRenewal.contract_id),
      manager_id: Number(this.newRenewal.manager_id),
      original_end_date: this.newRenewal.original_end_date,
      priority: this.newRenewal.priority
    };
    if (this.newRenewal.proposed_end_date) payload.proposed_end_date = this.newRenewal.proposed_end_date;
    if (this.newRenewal.renewal_value) payload.renewal_value = this.newRenewal.renewal_value;
    if (this.newRenewal.notes) payload.notes = this.newRenewal.notes;

    this.renewalService.createRenewal(payload).subscribe({
      next: () => {
        this.createLoading = false;
        this.showCreateModal = false;
        this.loadStats();
        this.loadRenewals();
      },
      error: err => {
        this.createLoading = false;
        this.createError = err.error?.detail || 'Failed to create renewal.';
      }
    });
  }

  openApproval(renewal: Renewal): void {
    this.selectedRenewal = renewal;
    this.approvalComment = '';
    this.showApprovalModal = true;
  }

  closeApprovalModal(): void { this.showApprovalModal = false; this.selectedRenewal = null; }

  submitApproval(status: 'approved' | 'rejected'): void {
    if (!this.selectedRenewal) return;
    this.renewalService.approveRenewal(this.selectedRenewal.id, status, this.approvalComment).subscribe({
      next: () => {
        this.closeApprovalModal();
        this.loadStats();
        this.loadRenewals();
      },
      error: err => alert(err.error?.detail || 'Approval failed.')
    });
  }

  markComplete(renewal: Renewal): void {
    const newDate = renewal.proposed_end_date || this.addYear(renewal.original_end_date);
    this.renewalService.completeRenewal(renewal.id, newDate).subscribe({
      next: () => { this.loadStats(); this.loadRenewals(); },
      error: err => alert(err.error?.detail || 'Could not complete renewal.')
    });
  }

  addYear(dateStr: string): string {
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  }

  daysUntil(dateStr: string): number {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getDaysLabel(dateStr: string): string {
    const days = this.daysUntil(dateStr);
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  }

  formatCurrency(val: number | undefined): string {
    if (!val) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  }

  logout(): void { this.authService.logout(); }

  hasPendingApproval(renewal: Renewal): boolean {
    return renewal.approvals?.some(a => a.status === 'pending' && a.approver.id === this.currentUser?.id) ?? false;
  }

  triggerExpiryCheck(): void {
    this.renewalService.triggerExpiryCheck().subscribe({
      next: (res) => { alert(res.message); this.loadStats(); this.loadRenewals(); },
      error: () => alert('Expiry check failed.')
    });
  }

  get roleLabel(): string {
    return this.currentUser?.role?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  }

  getBarPct(val: number, total: number): number {
    if (!total) return 0;
    return Math.min((val / total) * 100, 100);
  }
}
