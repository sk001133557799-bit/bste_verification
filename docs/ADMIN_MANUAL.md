# Board of Science and Technical Education (BSTE) Islamabad
## Board Administrator & Examination Controller User Manual

**Target Audience:** Super Administrators (Chairman / IT Director) & Board Administrators (Controller of Examinations)  
**Portal URL:** `https://bste.edu.pk/portal/login` or `http://localhost:3000/portal/login`  

---

## 1. Accessing the Admin Console

1. Navigate to `https://bste.edu.pk/portal/login`.
2. Enter your authorized administrator email:
   - Super Admin: `superadmin@bste.edu.pk`
   - Board Admin: `admin@bste.edu.pk`
3. Enter your secure password and click **"Sign In to Console"**.
4. Upon authentication, you will be redirected to the **Executive Dashboard**.

---

## 2. Dashboard Analytics & Monitoring

The Executive Dashboard (`/portal/admin/dashboard`) displays real-time operational statistics:
- **7 Metric Cards:** Total Students, Total Faculty, Total Institutes, Programs, Results Uploaded, Pending Approvals Queue, Board Pass Rate.
- **Visual Analytics:**
  - *Students by Year:* Track growth across academic cohorts.
  - *Grade Distribution:* Monitor candidate performance across grades `A+` through `F`.
  - *Discipline Breakdown:* Enrollment volume in DAE-CIT, DAE-CIVIL, DAE-ELECT, and BS-TECH.
  - *Recent Registrations Table:* Instant link to candidate records.
  - *Security Audit Stream:* Live log of user logins and administrative operations.

---

## 3. Student Record Management

Navigate to **"Student Management"** (`/portal/admin/students`):
1. **Search & Filter:** Search candidates by Roll Number, Full Name, CNIC, or Registration Number. Filter by Institute, Program, and Pass/Fail Status.
2. **Add Single Candidate:**
   - Click **"+ Add Student Record"**.
   - Fill in Personal Information (Photo URL, Full Name, Father Name, DOB, CNIC, Phone, Address).
   - Select Academic Hierarchy (Institute, Department, Program Scheme, Session).
   - Enter Subject Theory and Practical marks — the system auto-calculates Total Marks, Percentage, Grade, and Pass/Fail status.
   - Click **"Register & Index Candidate"**.
3. **Edit / Delete Student:** Use the action buttons on any row to adjust personal details, update marks, or remove obsolete records.

---

## 4. Faculty Management & Onboarding

Navigate to **"Faculty Management"** (`/portal/admin/teachers`):
1. **Onboard New Teacher:**
   - Click **"+ Onboard New Faculty"**.
   - Provide Full Name, Email, Username, Default Password, Designation, Institute, and Department.
   - Click **"Create Teacher Account"**.
2. **Account Controls:**
   - **Toggle Active Status:** Click **"Deactivate"** or **"Activate"** to instantly grant or suspend faculty access.
   - **Reset Password:** Click **"Reset Password"** to revert faculty credentials to the default password.

---

## 5. Review & Approval Workflow

Navigate to **"Submissions & Approvals"** (`/portal/admin/approvals`):
1. Review candidate marks batches submitted by instructors.
2. Inspect the Batch Title, Institute Name, Program, Candidate Count, and Submission Date.
3. **One-Click Actions:**
   - **"Approve & Publish Result":** Sets batch to Approved and immediately publishes candidate results to the public verification search portal.
   - **"Reject & Return":** Opens feedback dialog to send marks discrepancy remarks back to the instructor for revision.

---

## 6. Notices & Gazette Broadcasting

Navigate to **"Notices & Circulars"** (`/portal/admin/notifications`):
1. Click **"Compose New Notice"**.
2. Enter the Title, Category (Result Declaration, Date Sheet, Admission, Statutory Circular), Target Audience (`ALL`, `TEACHERS`, `STUDENTS`), and Notice Body.
3. Click **"Publish Notice"** — the notification immediately displays on the public website ticker, news page, and user dashboards.

---

## 7. Reports & Gazette Tabulations

Navigate to **"Reports & Analytics"** (`/portal/admin/reports`):
1. Select report type: **Student Registry**, **Result Gazette**, or **Faculty Register**.
2. Apply Program, Institute, or Session filters.
3. Export using:
   - **"Export Excel (.xlsx)"** for formatted spreadsheets.
   - **"Export CSV (.csv)"** for data integration.
   - **"Print Report"** for official A4 printable gazettes.

---

## 8. Audit Logs & System Settings

- **Audit Trail (`/portal/admin/logs`):** Inspect chronological activity events, user IDs, actions, and IP addresses with search and CSV export.
- **Settings (`/portal/admin/settings`):** Configure board metadata, passing marks threshold, certificate prefixes, signatory designations, and download encrypted database snapshots (`.json`).
