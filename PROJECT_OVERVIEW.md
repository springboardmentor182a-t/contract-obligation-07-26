# ContractIQ — Complete Enterprise Contract & Compliance Lifecycle Platform

---

## 1. Executive Summary & Overview

**ContractIQ** is an end-to-end Enterprise Contract Lifecycle Management (CLM), Obligation Tracking, Compliance Auditing, and Predictive Risk Forecasting platform. Built for modern legal operations, procurement, and compliance teams, ContractIQ unifies contract ingestion, deliverable milestone tracking, automated renewal governance, regulatory risk assessment, and audit logging into a single cohesive workspace.

### Key Value Propositions
- **Centralized Contract Repository**: Full lifecycle tracking of vendor, client, and partner agreements with search, filtering, risk tagging, and financial metadata.
- **Proactive Obligation Management**: Milestone and deliverable tracking linked directly to underlying contracts with priority assignments and status tracking.
- **AI Forecast & Early Warning Engine**: Predictive analytics identifying renewal delay risks, potential obligation breaches, and regulatory compliance gaps before deadlines pass.
- **Automated Renewal Governance**: Expiry calendar with notice period alerts, financial exposure analysis, and renewal decision workflows (Renew, Renegotiate, Terminate).
- **Compliance Guardian**: Multi-framework regulatory controls (ISO 27001, GDPR DPA, SOC 2 Type II, HIPAA) with real-time audit logs and score breakdown.
- **Role-Based Workspace Control (RBAC)**: Fine-grained access control across 6 user roles with customizable department views.

---

## 2. Architecture & Technical Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                    Client (React.js)                    │
   │   React 18 | React Router v6 | UIContext | CSS System   │
   └────────────────────────────┬────────────────────────────┘
                                │ HTTP / REST API (JWT Bearer)
   ┌────────────────────────────▼────────────────────────────┐
   │                   Backend (FastAPI)                     │
   │ FastAPI REST Controllers | Pydantic | Passlib | Jose    │
   └────────────────────────────┬────────────────────────────┘
                                │ SQLAlchemy 2.0 ORM
   ┌────────────────────────────▼────────────────────────────┐
   │                   Database Engine                       │
   │  PostgreSQL (Supabase Pooler) / Local SQLite (dev.db)   │
   └─────────────────────────────────────────────────────────┘
```

### **Frontend Infrastructure**
- **Framework**: React.js 18 (Create React App SPA architecture)
- **Routing**: React Router DOM v6 with role-based default routing (`sidebarPermissions.js`)
- **State Management**: `UIContext.js` — unified source of truth for logged-in user profile, theme preference (`light`/`dark`), global toast notifications, and unread notification counters.
- **Styling**: Custom CSS Design System (`global.css`, modular page stylesheets) with full native Dark Mode CSS variable mapping (`data-theme="dark"`).
- **Icons & UI Assets**: Lucide React & custom SVG Icon component system.

### **Backend Infrastructure**
- **Framework**: FastAPI (Python 3.10+) utilizing synchronous, high-throughput REST controllers.
- **Database ORM**: SQLAlchemy 2.0 with connection pooling (`pool_pre_ping=True`) and resilient fallback mechanism (PostgreSQL -> local SQLite `dev.db`).
- **Security & Auth**: OAuth2 Password Flow with Bearer Tokens, JWT (`python-jose`), and Bcrypt password hashing (`passlib`).
- **Background Operations**: SMTP email dispatch for user invitations, standard CSV report generators.

---

## 3. Modular Feature Breakdown

### **3.1 Authentication & Profile Management**
- **Multi-Role Login (`/login`)**: Supports email + password authentication with role selection. Automatically navigates users to role-tailored landing pages.
- **Dynamic Profile Header Sync**: Header displays the active user's actual full name (`Arjun Mehta`, `Priya Nair`, etc.) and role dynamically synced across `UIContext` and local storage.
- **Profile Settings (`/profile`)**: Update personal details, contact number, job title, department, and bio.

### **3.2 Enterprise Executive Dashboard (`/dashboard`)**
- **Live KPI Summary**: Real-time counters for Total Active Contracts, Pending Obligations, Average Compliance Score, and Expiry Exposure.
- **Volume & Renewal Charts**: Visual representation of monthly contract volume and upcoming expiry timelines.
- **Quick Action Bar**: One-click triggers for contract upload, obligation creation, compliance audit, and team invitations.

### **3.3 Contract Repository (`/repository`)**
- **Search & Filter Grid**: Filter contracts by search query, status (*Active*, *Pending*, *Expired*, *Terminated*), department, vendor, and risk level (*Low*, *Medium*, *High*, *Critical*).
- **Contract Details Modal**: Deep dive into individual contract terms, total contract value (TCV), annual contract value (ACV), start/end dates, notice period, and associated obligations.
- **Ingestion & Upload Workflow**: Ingest new contract records with automated risk calculation and metadata extraction.

### **3.4 Obligation Tracker (`/obligations`)**
- **Deliverable Milestone Grid**: Group deliverables by status (*Due Soon*, *Overdue*, *On Track*, *Completed*).
- **Priority & Ownership**: Assign obligations to specific owners, departments, and priority levels (*High*, *Medium*, *Low*).
- **CRUD Operations**: Add new obligations, update statuses, edit due dates, and delete expired obligations with full audit logging.

### **3.5 Renewal Dashboard (`/renewal-dashboard`)**
- **Expiry Horizon Tracking**: 30-day, 60-day, and 90-day upcoming expiration timelines.
- **Financial Risk Analysis**: Total auto-renewal risk value vs manual renewal financial obligations.
- **Decision Engine**: Process contract decisions directly (*Renew Contract*, *Initiate Renegotiation*, *Terminate Agreement*).

### **3.6 AI Compliance Guardian & Controls (`/compliance`)**
- **Multi-Framework Governance**: Compliance monitoring for ISO 27001, GDPR DPA, SOC 2 Type II, and HIPAA.
- **AI Compliance Guardian**: Real-time vulnerability detection, automated compliance risk calculation, and priority remedial tasks.
- **Verification Logs**: Historical record of compliance checks and control status updates.

### **3.7 AI Forecast & Early Warning Engine (`/reports` & `/api/forecast`)**
- **Renewal Delay Prediction**: Analyzes vendor review times and historical turnaround metrics to predict potential renewal bottlenecks.
- **Overdue Obligation Forecasting**: Identifies unassigned tasks and approaching deadlines to forecast potential SLA breaches.
- **Future Compliance Risk Identification**: Flags upcoming regulatory certification expirations and missing DPA terms.
- **Early Warning Alert Center**: Interactive severity badges (*Critical*, *Warning*, *Info*) with actionable recommendations.

### **3.8 Reports & Analytics (`/reports`)**
- **Metrics & Monthly Volume**: Real-time charts fetched from `/api/analytics/metrics` and `/api/analytics/monthly-volume`.
- **One-Click CSV Exporters**: Instant downloadable CSV reports for Compliance Summaries, Obligation Status, Contract Portfolios, and Audit Trails.

### **3.9 System Audit Trail (`/audit`)**
- **Immutable Log History**: Records every critical system event including user authentication, contract updates, obligation status changes, settings updates, and role modifications.
- **Filters**: Filter audit logs by module (*Authentication*, *Contracts*, *Obligations*, *Settings*, *Users*), event type (*CREATE*, *UPDATE*, *DELETE*, *SECURITY*), and date ranges.

### **3.10 User Management & Invitations (`/user-management` & `/settings`)**
- **User Directory**: View all active workspace users, roles, departments, and statuses.
- **SMTP & Console Email Dispatch**: Send invitations to new team members with automatic temporary credential generation and email dispatch.
- **Role Assignment**: Modify user roles dynamically with instant workspace permission updates.

### **3.11 Help, Support & FAQs (`/help`)**
- **Searchable FAQ Base**: Interactive accordion FAQ list categorized by topic.
- **Support Ticket Queue**: Submit support tickets with severity levels (*Low*, *Medium*, *High*, *Urgent*) connected directly to backend DB queue.

---

## 4. Complete API Endpoint Directory

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/login` | `POST` | Authenticate user & return JWT token + user details |
| **Auth** | `/api/auth/register` | `POST` | Register new workspace account |
| **Profile** | `/api/profile` | `GET` | Retrieve logged-in user profile details |
| **Profile** | `/api/profile` | `PUT` | Update user profile details |
| **Contracts** | `/api/contracts` | `GET` | List all contracts with optional filtering |
| **Contracts** | `/api/contracts/{id}` | `GET` | Retrieve single contract details |
| **Contracts** | `/api/contracts` | `POST` | Create/ingest new contract |
| **Obligations**| `/api/obligations` | `GET` | List all contract obligations |
| **Obligations**| `/api/obligations` | `POST` | Create new obligation deliverable |
| **Obligations**| `/api/obligations/{id}` | `PUT` | Update obligation status or due date |
| **Renewals** | `/api/renewals/upcoming` | `GET` | Fetch upcoming renewals (30/60/90 days) |
| **Renewals** | `/api/renewals/{id}/action` | `POST` | Record renewal decision (Renew/Renegotiate/Terminate) |
| **Forecast** | `/api/forecast/summary` | `GET` | Get AI Forecast Engine summary metrics |
| **Forecast** | `/api/forecast/predictions` | `GET` | Get detailed predictive risk breakdown |
| **Forecast** | `/api/forecast/alerts` | `GET` | Get AI early warning alerts |
| **Analytics** | `/api/analytics/metrics` | `GET` | Fetch KPI analytics metrics |
| **Analytics** | `/api/analytics/monthly-volume`| `GET` | Fetch monthly contract volume trends |
| **Compliance**| `/api/compliance/controls` | `GET` | List regulatory compliance controls |
| **Audit** | `/api/audit` | `GET` | Retrieve searchable audit trail logs |
| **Users** | `/api/users` | `GET` | List all registered users |
| **Users** | `/api/users/invite` | `POST` | Invite new user & dispatch invitation email |
| **Settings** | `/api/settings` | `GET` | Fetch organization settings |
| **Settings** | `/api/settings` | `PATCH` | Update organization settings |
| **Settings** | `/api/settings/security/apikeys` | `GET` | List developer API keys |
| **Settings** | `/api/settings/security/apikeys` | `POST` | Generate new API key |
| **Support** | `/api/faqs` | `GET` | List all FAQ entries |
| **Support** | `/api/support/tickets` | `POST` | Submit support ticket |

---

## 5. Database Schema & Data Models

- **`User` (`users`)**: Stores user credentials, hashed passwords, roles, contact info, department, and active status.
- **`Contract` (`contracts`)**: Master contract record with vendor, TCV/ACV value, risk level, status, dates, and department.
- **`Obligation` (`obligations`)**: Deliverables linked to `contracts` with title, due date, priority, owner ID, and status.
- **`Renewal` (`renewals`)**: Expiration records linked to `contracts` with notice days, auto-renewal flag, status, and renewal date.
- **`ComplianceControl` (`compliance_controls`)**: Regulatory frameworks (ISO, GDPR, SOC2, HIPAA) with score weight and status.
- **`AuditLog` (`audit_logs`)**: Event trail capturing `user_id`, `event_type`, `action`, `module`, `description`, and `timestamp`.
- **`UserSetting` (`user_settings`)**: Per-user preferences (currency, date format, notification toggles, org name).
- **`UserInvitation` (`user_invitations`)**: Invitation tracking for newly invited team members with role and department.
- **`ApiKey` (`api_keys`)**: Masked API key credentials created by administrators.
- **`SupportTicket` (`support_tickets`)**: Support queue items logged by users.

---

## 6. User Roles & Permission Matrix

| Feature / Page | Administrator | Legal Manager | Compliance Officer | Contract Manager | Department Head | Employee |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | Full Access | Full Access | Full Access | Full Access | Department | Read-Only |
| **Contract Repo** | Full Access | Full Access | Read-Only | Full Access | Department | Read-Only |
| **Obligations** | Full Access | Full Access | Full Access | Full Access | Department | Assigned Only |
| **Renewal Dash** | Full Access | Full Access | Read-Only | Full Access | Department | Hidden |
| **Compliance** | Full Access | Full Access | Full Access | Read-Only | Read-Only | Hidden |
| **AI Forecast** | Full Access | Full Access | Full Access | Full Access | Department | Hidden |
| **Audit Logs** | Full Access | Read-Only | Full Access | Hidden | Hidden | Hidden |
| **User Mgmt** | Full Access | Read-Only | Hidden | Hidden | Hidden | Hidden |
| **Settings** | Full Access | Read-Only | Read-Only | Read-Only | Read-Only | Personal Only |

---

## 7. How to Run Locally

### **Backend Setup (FastAPI)**
```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Seed initial database records
python seed_db.py

# Start FastAPI Uvicorn Server
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

### **Frontend Setup (React.js)**
```bash
cd client
npm install
npm start
```
*Frontend runs on `http://localhost:3000` with automated proxying to FastAPI backend on `http://127.0.0.1:8000`.*

---

## 8. Demo Script for Mentor Presentation

1. **Sign In & Header State**:
   - Log in using `arjun.mehta@contractiq.com` (password: `admin@123`).
   - Point out that the header immediately updates with **Arjun Mehta (Administrator)**.
2. **Dashboard Overview**:
   - Show live operational KPIs, contract metrics, and quick action buttons.
3. **Contract Repository & Obligation Deliverables**:
   - Open `/repository` to display search filters and contract terms preview.
   - Open `/obligations` to demonstrate priority badges, status updates, and milestone tracking.
4. **AI Forecast Engine & CSV Export**:
   - Open `/reports` to present the **AI Forecast Engine**. Highlight predicted renewal delays, forecasted overdue obligations, future compliance risks, and early warning alerts.
   - Click **CSV Export** on "Contract Portfolio" to download real CSV data.
5. **Team Invitation & Email Dispatch**:
   - Open `/settings` -> `People / Invite`. Invite a test team member to trigger the SMTP / console email logger.
6. **Dark Theme**:
   - Toggle the topbar Sun/Moon icon to demonstrate dynamic dark mode across pages, modals, and data grids.
7. **Support Queue**:
   - Open `/help` and submit a support ticket to demonstrate end-to-end backend integration.

---
*ContractIQ Platform — Technical Documentation.*
