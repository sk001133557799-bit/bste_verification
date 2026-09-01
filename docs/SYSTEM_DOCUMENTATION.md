# Board of Science and Technical Education (BSTE) Islamabad
## Enterprise System Architecture & Technical Documentation

**System Title:** National Student Record Management, Result Gazette & Cryptographic Verification Platform  
**Authority:** Board of Science and Technical Education (BSTE) Islamabad Capital Territory, Pakistan  
**Document Version:** 2.0 (Production Release)  
**Release Date:** August 2026  

---

## 1. Executive Overview

The **Board of Science and Technical Education (BSTE) Islamabad** digital platform is an enterprise-grade academic record governance, result tabulation, and public verification system. It provides end-to-end digital infrastructure for:
1. **Accredited Polytechnic & Technical College Governance:** Managing institutes, departments, curriculum schemes (DAE, DIT, BS-Tech), and faculty assignments.
2. **Candidate Examination Lifecycle:** Candidate registration, single/bulk marks entry, live calculation of percentages and GPA, and multi-tier board review workflows.
3. **Cryptographic Public Verification:** Instant verification of examination diplomas and transcripts via student roll number or 2D QR code scanning, eliminating academic fraud.
4. **Institutional Reporting & Gazettes:** Automated generation of gazette registers, pass/fail analytics, and exportable reports in PDF, Excel, and CSV.

---

## 2. Technology Stack & Component Topology

```mermaid
graph TD
    User([Public / Candidate / Employer]) -->|HTTPS :443| NGINX[NGINX Reverse Proxy & Rate Limiter]
    Faculty([Teacher / Examiner]) -->|HTTPS :443| NGINX
    Admin([Super Admin / Board Controller]) -->|HTTPS :443| NGINX

    NGINX -->|Port 3000| NextApp[Next.js 14 Frontend & SSR Server]
    NGINX -->|Port 4000| NestAPI[NestJS 10 Enterprise API Server]

    NextApp -->|Prisma Client| DB[(Central PostgreSQL 16 Database)]
    NestAPI -->|Prisma Client| DB

    NextApp -->|Cryptographic QR| QREngine[High-Density QR Code Generator]
    NextApp -->|PDF Generation| PDFEngine[A4 Print Engine / jsPDF]
    NestAPI -->|OpenAPI 3.0| Swagger[/api/docs]
```

### Component Breakdown:
- **Frontend Layer:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Canvas/jsPDF.
- **Backend Microservices:** NestJS 10, TypeScript, Passport JWT, class-validator, Swagger OpenAPI.
- **Database Layer:** PostgreSQL 16 (production) / SQLite (development), Prisma ORM with strict indexing.
- **Security & Networking:** NGINX reverse proxy with DDoS rate limiting (10 req/s on `/public/`), SSL termination, and HTTP-only JWT cookies.

---

## 3. Database Schema Overview

The database schema is structured into 14 normalized relational entities:
- `users`: Board administrators, faculty instructors, and staff accounts.
- `institutes`: Affiliated polytechnic colleges with college code, district, and contact metadata.
- `departments`: Academic departments (Computer, Civil, Electrical, Applied Sciences).
- `programs`: Technical curriculum schemes (e.g. `DAE-CIT`, `DAE-CIVIL`, `DIT`).
- `academic_sessions`: Academic cohorts (e.g. `2023-2026`, `2024-2027`).
- `subjects`: Theory and Practical curriculum courses with maximum marks and credit hours.
- `teachers` & `teacher_assignments`: Instructor profiles, designations, and departmental permissions.
- `students`: Comprehensive candidate bio data, roll numbers, registration numbers, and masked CNICs.
- `results`: Final examination outcome, total marks, percentage, GPA, grade, and publishing state.
- `marks`: Granular subject marks (Theory Obtained, Practical Obtained, Total Obtained, Grade, Status).
- `certificates`: Cryptographic diploma record with unique Certificate ID (`BSTE-CERT-2026-XXXXX`), security hash, and signatory metadata.
- `submissions`: Batch marks submission queue for teacher-to-admin approval workflow.
- `announcements`: Official board circulars, gazette announcements, and date sheets.
- `activity_logs`: Immutable audit trail capturing user ID, action, target entity, timestamp, and IP address.

---

## 4. Security & Data Integrity Architecture

1. **Authentication:** Dual JWT token architecture (15-minute access token + 7-day sliding refresh token). Passwords hashed using bcrypt with salt rounds = 10.
2. **Role-Based Access Control (RBAC):**
   - `SUPER_ADMIN`: Full statutory authority (system configuration, database backups, user management).
   - `ADMIN`: Examination controller operations (student registration, result publishing, report generation).
   - `TEACHER_EDITOR`: Scoped instructor access restricted strictly to assigned departmental cohorts.
3. **Data Privacy (CNIC Masking):** Public APIs and result cards mask national identity numbers (`61101-*******-3`) and conceal internal database keys.
4. **Anti-Scraping & Rate Limiting:** High-frequency lookups trigger NGINX rate-limiting throttles and visual CAPTCHA verification challenges.
