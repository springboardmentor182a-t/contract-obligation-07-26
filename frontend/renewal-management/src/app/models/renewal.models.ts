// Renewal domain models matching the backend schemas

export type UserRole = 'administrator' | 'legal_manager' | 'compliance_officer' | 'contract_manager' | 'department_head' | 'employee';
export type RenewalStatus = 'upcoming' | 'in_progress' | 'renewed' | 'expired' | 'cancelled';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  department?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Contract {
  id: number;
  contract_number: string;
  title: string;
  vendor_name: string;
  category: string;
  value?: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;
  description?: string;
  created_at: string;
}

export interface RenewalApproval {
  id: number;
  step: number;
  status: ApprovalStatus;
  comments?: string;
  decided_at?: string;
  approver: User;
}

export interface RenewalReminder {
  id: number;
  reminder_type: string;
  scheduled_date: string;
  is_sent: boolean;
  sent_at?: string;
  recipient_email?: string;
  message?: string;
}

export interface RenewalHistory {
  id: number;
  action: string;
  old_status?: string;
  new_status?: string;
  changed_by: string;
  changed_by_role?: string;
  remarks?: string;
  created_at: string;
}

export interface Renewal {
  id: number;
  renewal_number: string;
  contract_id: number;
  manager_id: number;
  status: RenewalStatus;
  original_end_date: string;
  proposed_end_date?: string;
  renewed_end_date?: string;
  renewal_value?: number;
  notes?: string;
  priority: string;
  reminder_30_sent: boolean;
  reminder_60_sent: boolean;
  reminder_90_sent: boolean;
  created_at: string;
  updated_at?: string;
  contract: Contract;
  manager: User;
  approvals: RenewalApproval[];
  reminders: RenewalReminder[];
  history: RenewalHistory[];
}

export interface RenewalStats {
  total: number;
  upcoming: number;
  in_progress: number;
  renewed: number;
  expired: number;
  cancelled: number;
  expiring_in_30_days: number;
  expiring_in_60_days: number;
  expiring_in_90_days: number;
  total_renewal_value: number;
}

export interface RenewalCreate {
  contract_id: number;
  manager_id: number;
  original_end_date: string;
  proposed_end_date?: string;
  renewal_value?: number;
  notes?: string;
  priority: string;
}

export interface RenewalUpdate {
  status?: RenewalStatus;
  proposed_end_date?: string;
  renewed_end_date?: string;
  renewal_value?: number;
  notes?: string;
  priority?: string;
}
