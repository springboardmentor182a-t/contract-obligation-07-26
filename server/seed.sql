-- Seed Data for ContractIQ

-- 1. Insert Default Admin User
INSERT INTO users (id, full_name, email, role, department, job_title, phone, bio, avatar_url)
VALUES (1, 'Arjun Mehta', 'arjun.mehta@contractiq.com', 'Administrator', 'Legal Operations', 'Compliance Lead', '+1 (555) 019-2834', 'Senior legal operations leader overseeing vendor contracts, compliance strategy, and cross-functional legal reviews.', NULL)
ON CONFLICT (email) DO UPDATE 
SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, department = EXCLUDED.department, job_title = EXCLUDED.job_title, bio = EXCLUDED.bio;

-- Reset serial primary key sequence
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 2. Insert Default Settings
INSERT INTO user_settings (user_id, org_name, currency, date_format, email_notif, slack_notif, renewal_alerts, two_factor, sso)
VALUES (1, 'Acme Corp', 'USD', 'YYYY-MM-DD', TRUE, FALSE, TRUE, TRUE, FALSE)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Insert Deduplicated Notifications
INSERT INTO notifications (id, user_id, category, urgency, title, description, is_read)
VALUES
(1, 1, 'Renewals', 'critical', 'Contract Expiring Urgently', 'CTR-2024-005 (Darwinbox) expires in 25 days. No renewal initiated.', FALSE),
(2, 1, 'Approvals', 'critical', 'Approval Required', 'CTR-2024-006 (Deloitte Audit) is awaiting your legal review and approval.', FALSE),
(3, 1, 'Workflow', 'warning', 'Overdue Obligation', 'OBL-004 (Property Insurance Renewal) is overdue by 5 days.', FALSE),
(4, 1, 'Risk Alerts', 'warning', 'Risk Alert', '3 contracts flagged for missing SLA clauses — compliance risk detected.', TRUE),
(5, 1, 'Compliance', 'info', 'Compliance Score Updated', 'Compliance score increased to 84% after 3 obligations were resolved.', TRUE),
(6, 1, 'Contracts', 'info', 'New Contract Assigned', 'CTR-2024-007 (Ogilvy) has been assigned to your review queue.', TRUE),
(7, 1, 'System', 'info', 'Scheduled Audit Reminder', 'Q2 Financial Controls Audit scheduled for Jul 25 — 3 weeks away.', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

-- 4. Insert KPI snap shots
INSERT INTO analytics_snapshots (metric_key, label, value, trend)
VALUES
('signed_contracts', 'Contracts Signed (QTD)', '34', '+12%'),
('turnaround_time', 'Avg. Turnaround Time', '6.2 days', '-8%'),
('total_value', 'Total Contract Value', '$2.1M', '+18%'),
('renewal_rate', 'Renewal Rate', '91%', '+1.5%')
ON CONFLICT (metric_key) DO UPDATE 
SET value = EXCLUDED.value, trend = EXCLUDED.trend;

-- 5. Insert Monthly Volume
INSERT INTO monthly_volumes (id, month, value, sort_order)
VALUES
(1, 'Feb', 18, 1),
(2, 'Mar', 22, 2),
(3, 'Apr', 19, 3),
(4, 'May', 27, 4),
(5, 'Jun', 24, 5),
(6, 'Jul', 34, 6)
ON CONFLICT (id) DO NOTHING;

SELECT setval('monthly_volumes_id_seq', (SELECT MAX(id) FROM monthly_volumes));

-- 6. Insert FAQs
INSERT INTO faqs (id, category, question, answer, sort_order)
VALUES
(1, 'Getting Started', 'How does ContractIQ identify a missed conditional deadline?', 'ContractIQ parses clause language for conditional triggers (e.g. "within 30 days of notice") and cross-references them against linked event dates, flagging any obligation that passes its computed due date without a logged completion.', 1),
(2, 'Obligation Mapping', 'Can I assign backup owners to critical obligations?', 'Yes. Open any obligation in the Tracker, select "Assign Backup Owner," and choose a teammate. Backup owners receive the same alert cadence as the primary owner.', 2),
(3, 'Integrations & Webhooks', 'How are renewal notice periods calculated?', 'ContractIQ reads the auto-renewal clause and counts backward from the term end date using the stated notice window, then surfaces the result on the Renewal Dashboard.', 3),
(4, 'Audit & Reporting Logs', 'Can I export obligation history for an audit?', 'From Audit Logs, choose a date range and export to CSV or PDF. Exports include owner, status changes, and timestamps for every obligation in scope.', 4)
ON CONFLICT (id) DO NOTHING;

SELECT setval('faqs_id_seq', (SELECT MAX(id) FROM faqs));

-- 7. Insert Quick Actions
INSERT INTO quick_actions (id, label, description, icon, color)
VALUES
('gen_report', 'Run Compliance Audit', 'Scans repository and highlights SLA flags', 'Shield', '#3B82F6'),
('export_analytics', 'Export Quarterly Review', 'Builds powerpoint and CSV data summary', 'Download', '#10B981'),
('notify_owners', 'Ping Overdue Owners', 'Triggers Slack/Email reminders to all active owners', 'Bell', '#F59E0B'),
('clear_cache', 'Clear Pipeline Queue', 'Flushes background OCR ingestion caches', 'Repeat', '#8B5CF6'),
('backup_db', 'Trigger Backup snapshot', 'Creates secondary cold-storage backup', 'Briefcase', '#EC4899'),
('test_webhook', 'Send Webhook Ping', 'Verifies DocuSign status ping receivers', 'Plug', '#14B8A6')
ON CONFLICT (id) DO UPDATE 
SET label = EXCLUDED.label, description = EXCLUDED.description;

-- 8. Insert Compliance Controls & Audit Logs
INSERT INTO compliance_controls (id, title, status, weight, last_verified)
VALUES
('ISO-27001-A.9.1.1', 'Access Control Policy & Multi-Factor Enforcement', 'PASSED', 100, CURRENT_TIMESTAMP),
('SOC2-CC-6.1', 'Logical Access & Role-Based Authorization', 'PASSED', 100, CURRENT_TIMESTAMP),
('HIPAA-164.312(a)', 'Access Control & Data Encryption at Rest', 'PASSED', 100, CURRENT_TIMESTAMP),
('GDPR-ART-32', 'Security of Processing & Data Protection', 'PASSED', 100, CURRENT_TIMESTAMP),
('PCI-DSS-v4-3.2', 'Sensitive Authentication Data Protection', 'WARNING', 75, CURRENT_TIMESTAMP),
('NIST-800-53-AC-2', 'Account Management & Role Enforcement', 'PASSED', 100, CURRENT_TIMESTAMP),
('ISO-27001-A.12.6.1', 'Vulnerability Management Protocol', 'WARNING', 50, CURRENT_TIMESTAMP),
('SOC2-CC-7.2', 'Incident Monitoring & Anomaly Detection', 'PASSED', 100, CURRENT_TIMESTAMP),
('SOX-404-ITGC', 'IT General Controls & Change Log Audit', 'FAILED', 60, CURRENT_TIMESTAMP),
('CCPA-1798.100', 'Consumer Privacy Notice & Disclosure', 'PASSED', 100, CURRENT_TIMESTAMP),
('ISO-27001-A.8.1.1', 'Asset Inventory & Responsibility Assignment', 'PASSED', 100, CURRENT_TIMESTAMP),
('SOC2-CC-6.8', 'Unauthorized & Malicious Code Prevention', 'PASSED', 100, CURRENT_TIMESTAMP),
('NIST-800-53-SI-4', 'System Monitoring & Intrusion Detection', 'PASSED', 100, CURRENT_TIMESTAMP),
('HIPAA-164.312(e)', 'Transmission Security & TLS 1.3 Enforcement', 'PASSED', 100, CURRENT_TIMESTAMP),
('GDPR-ART-33', 'Personal Data Breach Notification Workflow', 'PASSED', 100, CURRENT_TIMESTAMP),
('ISO-27001-A.15.1.1', 'Supplier Relationship Information Security', 'PASSED', 100, CURRENT_TIMESTAMP),
('SOC2-CC-9.2', 'Vendor Risk Assessment & Contract SLA', 'PASSED', 100, CURRENT_TIMESTAMP),
('NIST-800-53-CP-9', 'Information System Backup & Recovery Testing', 'PASSED', 100, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, status = EXCLUDED.status, weight = EXCLUDED.weight;

INSERT INTO compliance_logs (id, control_id, timestamp, status, message)
VALUES
(1, 'ISO-27001-A.9.1.1', CURRENT_TIMESTAMP, 'VERIFIED', 'Access control matrix verified against active directory groups.'),
(2, 'ISO-27001-A.9.1.1', CURRENT_TIMESTAMP, 'VERIFIED', 'Quarterly privilege user review completed with zero unauthorized accounts.'),
(3, 'SOC2-CC-6.1', CURRENT_TIMESTAMP, 'VERIFIED', 'Role RBAC policies re-validated for contract management APIs.'),
(4, 'HIPAA-164.312(a)', CURRENT_TIMESTAMP, 'VERIFIED', 'AES-256 encryption keys rotated for storage volume.'),
(5, 'GDPR-ART-32', CURRENT_TIMESTAMP, 'VERIFIED', 'DPIA conducted and verified for cloud infrastructure.'),
(6, 'PCI-DSS-v4-3.2', CURRENT_TIMESTAMP, 'WARNING', '1 storage bucket missing automated key rotation rule.'),
(7, 'NIST-800-53-AC-2', CURRENT_TIMESTAMP, 'VERIFIED', 'Inactive user auto-disable policy enforced.'),
(8, 'ISO-27001-A.12.6.1', CURRENT_TIMESTAMP, 'WARNING', '2 low-priority npm package patches pending installation.'),
(9, 'SOC2-CC-7.2', CURRENT_TIMESTAMP, 'VERIFIED', 'SIEM audit alert channels verified.'),
(10, 'SOX-404-ITGC', CURRENT_TIMESTAMP, 'FAILED', 'Unapproved schema migration detected without secondary signature.'),
(11, 'CCPA-1798.100', CURRENT_TIMESTAMP, 'VERIFIED', 'Privacy policy agreement links verified on public landing.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('compliance_logs_id_seq', (SELECT MAX(id) FROM compliance_logs));

