# Board of Science and Technical Education (BSTE) Islamabad
## Developer & Engineering Technical Reference Manual

**Target Audience:** Full Stack Software Engineers, DevOps Engineers, and System Architects  
**Repository:** `e:/Rsults Verification`  

---

## 1. Project Directory Structure

```text
├── src/                          # Next.js 14 Frontend Application
│   ├── app/                      # App Router routes & API endpoints
│   │   ├── (public)/             # Homepage, /about, /programs, /institutes, /departments, /news, /contact
│   │   ├── verify/               # /verify and /verify/[certificateId] (Public QR Resolver)
│   │   ├── portal/               # Authentication & Dashboards
│   │   │   ├── login/            # Staff & Teacher Portal Login
│   │   │   ├── admin/            # Executive Admin Portal (Dashboard, Students, Teachers, Approvals, Reports, Logs, Settings)
│   │   │   └── teacher/          # Teacher Portal (Dashboard, Single Entry, Bulk Upload, Submissions, Students)
│   │   ├── public/               # Dedicated Public APIs (/public/student/:roll, /public/certificate/:certId)
│   │   ├── api/                  # Next.js Serverless API Route Handlers
│   │   ├── sitemap.ts            # Dynamic SEO sitemap generator
│   │   └── robots.ts             # Web crawler search indexing rules
│   ├── components/               # Reusable UI & Public Component Library
│   │   ├── ui/                   # Card, Modal, Table, Form, Navbar, Sidebar
│   │   └── public/               # Header, Footer, ResultCard
│   └── lib/                      # Core Utilities (db, auth, logger, qr-generator, excel-validator)
├── backend/                      # NestJS 10 Enterprise Microservice Backend
│   ├── src/
│   │   ├── modules/              # 15 Modular Feature Packages (auth, students, teachers, results, certificates, approvals, etc.)
│   │   ├── common/               # Guards (JwtAuthGuard, RolesGuard), Decorators (@Roles, @CurrentUser)
│   │   ├── prisma/               # PrismaService Database Singleton
│   │   └── main.ts               # Application Bootstrap & Swagger OpenAPI Generator
├── prisma/                       # Database Schema & Migrations
│   ├── schema.prisma             # 14 Relational Entity Definitions
│   ├── seed.ts                   # Comprehensive Initial Seeder
│   └── dev.db                    # Active SQLite / PostgreSQL Connection Target
├── nginx/                        # NGINX Configuration (Rate Limiting, Reverse Proxy)
├── scripts/                      # Automated DB Backup & Disaster Recovery Scripts
├── docs/                         # System, Admin, Teacher, Student & Developer Manuals
├── Dockerfile                    # Next.js Production Container Image
├── backend/Dockerfile            # NestJS Backend Container Image
├── docker-compose.yml            # Multi-Container Production Stack
└── test_all_phases.js            # 27-Point Automated Master Test Suite
```

---

## 2. Environment Variables Specification

Create or update `.env` in the project root:

```env
# Database Connection (PostgreSQL 16 for production / SQLite for dev)
DATABASE_URL="file:./dev.db"

# JWT Authentication Secrets
JWT_SECRET="bste_islamabad_secure_jwt_token_key_2026_super_secret"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="bste_islamabad_refresh_jwt_secret_key_2026"
JWT_REFRESH_EXPIRATION="7d"

# Public Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="production"
PORT=3000
```

---

## 3. Local Installation & Development Workflow

1. **Install Root Dependencies:**
   ```bash
   npm install
   ```
2. **Install NestJS Backend Dependencies:**
   ```bash
   cd backend && npm install && cd ..
   ```
3. **Generate Prisma Client & Seed Database:**
   ```bash
   npx prisma generate
   npx ts-node prisma/seed.ts
   ```
4. **Run Development Servers:**
   - Frontend (Next.js): `npm run dev` (Port 3000)
   - Backend (NestJS): `cd backend && npm run start:dev` (Port 4000)

---

## 4. REST API Endpoint Reference

### Public Endpoints (No Authentication Required):
- `GET /public/student/:rollNumber` — Fetch verified student record, marks breakdown, and QR code.
- `GET /public/certificate/:certificateId` — Verify certificate authenticity and cryptographic security hash.
- `GET /api/notifications` — Fetch published public gazette announcements.

### Administrative Endpoints (`SUPER_ADMIN` / `ADMIN` Required):
- `GET /api/reports` — Analytics KPIs and chart distributions.
- `GET /api/students` & `POST /api/students` — Student CRUD and paginated query.
- `GET /api/teachers` & `POST /api/teachers` — Teacher onboarding and status toggle.
- `GET /api/submissions` & `PUT /api/submissions` — Batch approval and result publishing.
- `GET /api/logs` — Real-time security audit trail.
- `GET /api/backup` — Export encrypted full database JSON snapshot.

### NestJS Microservice Documentation:
- Swagger OpenAPI interactive documentation is available at `http://localhost:4000/api/docs`.

---

## 5. Automated Test Suite Execution

Run the master 27-point end-to-end automated test suite:
```bash
node test_all_phases.js
```
Expected output: **27/27 Tests Passing**.
