# Board of Science and Technical Education (BSTE) Islamabad
## Faculty & Instructor User Manual

**Target Audience:** Instructors, Departmental Heads, and Examination Evaluators  
**Portal URL:** `https://bste.edu.pk/portal/login` or `http://localhost:3000/portal/login`  

---

## 1. Teacher Portal Login

1. Go to `https://bste.edu.pk/portal/login`.
2. Enter your faculty credentials:
   - Email: `teacher@bste.edu.pk`
   - Password: `Teacher@123`
3. Click **"Sign In to Console"**.
4. You will be greeted with your **Departmental Instructor Dashboard**.

---

## 2. Scoped Dashboard & Assigned Cohorts

The Teacher Dashboard (`/portal/teacher/dashboard`) displays:
- Assigned Institute and Department (e.g. Islamabad Institute of Technology - Computer Information Technology).
- Total Students in your department.
- Total batches submitted and approved.
- Quick links for Single Entry, Excel Bulk Upload, and Submissions Tracker.

---

## 3. Method 1: Single Student Marks Entry

Navigate to **"Single Student Entry"** (`/portal/teacher/single-entry`):
1. **Step 1: Student Information:**
   - Enter Roll Number (e.g. `BSTE-2026-00130`), Registration Number, Full Name, Father Name, CNIC, and DOB.
2. **Step 2: Department & Program Selection:**
   - Select your assigned curriculum program (e.g. `DAE-CIT`) and academic session.
3. **Step 3: Dynamic Subject Marks:**
   - The system automatically loads all prescribed subjects for that program.
   - Enter Theory Obtained and Practical Obtained marks.
   - The system validates marks boundaries in real time (e.g., Theory <= 100, Practical <= 50) and computes Total, Percentage, and Letter Grade.
4. Click **"Submit Candidate Record"** — the record is queued for board administrator verification.

---

## 4. Method 2: Bulk Excel Upload System

Navigate to **"Bulk Excel Upload"** (`/portal/teacher/bulk-upload`):
1. **Step 1: Download Program Spreadsheet Template:**
   - Select your program (e.g., DAE in Computer Information Technology).
   - Click **"Download Official Excel Template (.xlsx)"**.
   - The downloaded file contains pre-formatted columns for candidate bio data and program subject marks (e.g., `CIT-313_Theory`, `CIT-313_Practical`).
2. **Step 2: Fill in Candidate Marks:**
   - Enter all students in your class into the Excel sheet.
3. **Step 3: Upload & Validate:**
   - Drag and drop your `.xlsx` file onto the upload zone.
   - The validation engine checks for duplicate roll numbers, missing fields, and out-of-bounds marks.
   - Any validation issues appear in a row-by-row error diagnostics grid.
4. **Step 4: Submit Batch:**
   - Enter a descriptive batch title (e.g., *"CIT 3rd Year Final Marks - Section A"*).
   - Click **"Import & Submit Batch"**.

---

## 5. Tracking Submissions & Approvals

Navigate to **"My Submissions"** (`/portal/teacher/submissions`):
- View all batch submissions and their review status:
  - `PENDING_APPROVAL`: Batch is under review by Board Examination Controllers.
  - `APPROVED`: Batch has been verified, approved, and published to the live public portal.
  - `REJECTED`: Batch returned by Admin with discrepancy feedback.
