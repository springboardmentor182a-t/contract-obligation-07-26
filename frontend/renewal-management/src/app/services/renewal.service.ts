import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Renewal, RenewalCreate, RenewalUpdate, RenewalStats,
  RenewalApproval, RenewalReminder, RenewalHistory, User, Contract
} from '../models/renewal.models';

@Injectable({ providedIn: 'root' })
export class RenewalService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Stats
  getStats(): Observable<RenewalStats> {
    return this.http.get<RenewalStats>(`${this.API}/renewals/stats`);
  }

  // CRUD
  createRenewal(data: RenewalCreate): Observable<Renewal> {
    return this.http.post<Renewal>(`${this.API}/renewals`, data);
  }

  getRenewals(filters?: {
    status?: string;
    priority?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Observable<Renewal[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.skip !== undefined) params = params.set('skip', filters.skip.toString());
    if (filters?.limit !== undefined) params = params.set('limit', filters.limit.toString());
    return this.http.get<Renewal[]>(`${this.API}/renewals`, { params });
  }

  getRenewal(id: number): Observable<Renewal> {
    return this.http.get<Renewal>(`${this.API}/renewals/${id}`);
  }

  updateRenewal(id: number, data: RenewalUpdate): Observable<Renewal> {
    return this.http.patch<Renewal>(`${this.API}/renewals/${id}`, data);
  }

  cancelRenewal(id: number): Observable<any> {
    return this.http.delete(`${this.API}/renewals/${id}`);
  }

  // Approval workflow
  approveRenewal(id: number, status: 'approved' | 'rejected', comments?: string): Observable<RenewalApproval> {
    return this.http.post<RenewalApproval>(`${this.API}/renewals/${id}/approve`, {
      status, comments
    });
  }

  // Complete / Renew
  completeRenewal(id: number, renewedEndDate: string): Observable<Renewal> {
    const params = new HttpParams().set('renewed_end_date', renewedEndDate);
    return this.http.post<Renewal>(`${this.API}/renewals/${id}/complete`, null, { params });
  }

  // History & Reminders
  getRenewalHistory(id: number): Observable<RenewalHistory[]> {
    return this.http.get<RenewalHistory[]>(`${this.API}/renewals/${id}/history`);
  }

  getRenewalReminders(id: number): Observable<RenewalReminder[]> {
    return this.http.get<RenewalReminder[]>(`${this.API}/renewals/${id}/reminders`);
  }

  addCustomReminder(data: {
    renewal_id: number;
    scheduled_date: string;
    recipient_email: string;
    message?: string;
  }): Observable<RenewalReminder> {
    return this.http.post<RenewalReminder>(`${this.API}/reminders/custom`, data);
  }

  // Users & Contracts
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API}/users`);
  }

  triggerExpiryCheck(): Observable<any> {
    return this.http.post(`${this.API}/system/check-expired`, null);
  }
}
