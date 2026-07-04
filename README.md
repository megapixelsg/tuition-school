# EduCentre — School Management System (UI Prototype)

A **non-working, clickable UI prototype** of a multi-branch tuition centre / school
management system. Generalised from the *Digital Operations & Student Management
System* proposal (ref. Q202601001) — outlets → branches, instructors → teachers,
belt grading → level assessments, belt inventory → learning-materials inventory.

> ⚠️ Prototype only: all data is mock, nothing persists, no backend, no real
> authentication. Buttons that would trigger real behaviour show a toast instead.

## Running it

No build step. Open `index.html` in a browser, or serve statically:

```
python3 -m http.server 8000
# → http://localhost:8000
```

Fully self-contained: styling is a pre-compiled Tailwind stylesheet
(`assets/tailwind.css`), so it works offline. To regenerate after markup changes:
`npx tailwindcss@3 --content './**/*.html,./assets/app.js' -o assets/tailwind.css --minify`.

## Entry points

| Screen | Path |
|---|---|
| Login / role switcher | `index.html` |
| Operations web app (Super Admin / Branch Manager / Teacher) | `admin/dashboard.html` |
| Student & Parent portal (mobile app mock) | `portal/home.html` |

The role selector (login page or topbar) changes the sidebar navigation to show
what each role can access. Roles are visual only.

## Feature coverage (mapped to the proposal's functional scope)

### Shell & access
- Mock login with role switcher: Super Admin / Branch Manager / Teacher + parent portal
- Role-based navigation (menus differ per role)
- Responsive web layout; portal rendered in a phone frame

### 1. Student management & progress tracking — `admin/students.html`, `admin/student-profile.html`, `admin/student-form.html`
- Searchable/filterable student directory (branch, level, status)
- Student master record: particulars, guardian contacts, enrolment, medical/PDPA
- Multi-year attendance history, level progression timeline, milestones
- Remarks with manual exception flags · non-persisting add/edit form

### 2. Attendance, scheduling & billing — `admin/schedule.html`, `admin/attendance.html`, `admin/billing.html`, `admin/invoice.html`
- Weekly timetable by branch/teacher/room, class rosters, capacity indicators
- Teacher attendance marking (present/late/absent) + student self check-in via app QR
- Automated lesson counting per billing cycle ("7 of 8 lessons")
- Auto-generated invoices with 9% GST, payment statuses (paid/outstanding/overdue)
- Automated reminder queue (email → push → WhatsApp → escalation) and payment reconciliation

### 3. Assessments & inventory — `admin/assessments.html`, `admin/inventory.html`
- Configurable assessment cycles with eligibility rules
- Auto-detected eligibility list + manual overrides (approval + reason, audit-logged)
- Materials stock per branch (workbooks, kits, certificates, merchandise)
- Auto-deduction on promotion, low-stock/out-of-stock alerts, inter-branch transfers
- Monthly reconciliation report (system vs physical count)

### 4. Promotions & engagement — `admin/campaigns.html`
- Campaign setup (holiday programmes, workshops, referral drives)
- Targeted segments by branch/level/status with estimated audience
- Automated follow-up sequences · in-app parent sign-ups
- Campaign performance funnel (reach → opened → signed up → paid)

### 5. Analytics & management dashboard — `admin/dashboard.html`, `admin/reports.html`
- Active students by branch, attendance trends, revenue collected vs outstanding,
  upcoming assessment volume, inventory status
- Exportable + scheduled management reports (buttons are mock)

### 6. Security & data governance — `admin/audit.html`, `admin/settings.html`
- Audit log for payments, assessments, inventory, attendance and role changes
- Role/permission matrix, branch management, billing rules
- Backups / retention / PDPA notices (illustrative)

### 7. Student & parent portal (mobile mock) — `portal/`
- Home: next class, attendance summary, announcements, recent activity
- QR / tap self check-in feeding the teacher's roster
- Progress: level journey, milestones, attendance history, teacher notes
- Payments: lesson quota, invoices, pay-now (stub), receipts
- News: campaign sign-ups and announcement feed

## Structure

```
index.html            login + role switcher
assets/app.js         shared shell: sidebar/topbar injection, role switcher, tabs, toasts
admin/*.html          operations web app (one page per module)
portal/*.html         student/parent mobile app mock (phone frame)
```
