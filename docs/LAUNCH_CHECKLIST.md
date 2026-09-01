# Board of Science and Technical Education (BSTE) Islamabad
## Production Launch & Maintenance Checklist

**Status:** Ready for Production Deployment  
**Target Domain:** `https://bste.edu.pk`  

---

## 1. Pre-Flight Verification Checklist

| Area | Item | Status | Verification Method |
| :--- | :--- | :---: | :--- |
| **Frontend** | Responsive Design | ✅ PASS | Verified on Desktop (1920px), Laptop (1366px), Tablet (768px), and Mobile (375px) |
| **Frontend** | SEO & Meta Tags | ✅ PASS | Dynamic `sitemap.xml`, `robots.txt`, and OpenGraph metadata generated |
| **Frontend** | PDF Generation | ✅ PASS | `html2canvas` + `jspdf` generates standard A4 result certificates |
| **Verification** | Public Student Lookup | ✅ PASS | `GET /public/student/BSTE-2026-00125` returns verified student with marks & QR |
| **Verification** | Certificate QR Code | ✅ PASS | Dynamic 2D QR Code resolves directly to `/verify/{certificateId}` |
| **Backend** | NestJS Microservices | ✅ PASS | 15 Modules running on port 4000 with Swagger UI at `/api/docs` |
| **Security** | Authentication & RBAC | ✅ PASS | JWT Access (15m) + Refresh (7d) cookies, bcrypt password hashing |
| **Security** | CNIC Data Privacy | ✅ PASS | Masked on all public displays (`61101-*******-3`) |
| **Security** | Rate Limiting | ✅ PASS | NGINX rate-limit zone set to `10 req/s` on search endpoints |
| **Database** | Indexes & Optimization | ✅ PASS | Indexed queries on `rollNumber`, `registrationNumber`, and `certificateNumber` |
| **Backup** | Automated Snapshots | ✅ PASS | `scripts/backup_db.js` generates full JSON database snapshots |
| **DevOps** | Docker Compose Stack | ✅ PASS | Containerized PostgreSQL 16, NestJS, Next.js, and NGINX |
| **DevOps** | CI/CD Automation | ✅ PASS | `.github/workflows/ci-cd.yml` configured for automated test & deploy |

---

## 2. Production Deployment Steps

1. **Provision Production Host:**
   - Linux Server (Ubuntu 22.04 LTS) with Docker Engine and Docker Compose installed.
2. **Clone & Configure Environment:**
   ```bash
   git clone https://github.com/bste-islamabad/results-portal.git
   cd results-portal
   cp .env.example .env
   # Populate production DATABASE_URL and JWT_SECRET
   ```
3. **Launch Docker Services:**
   ```bash
   docker-compose up -d --build
   ```
4. **Run Production Database Seed / Migration:**
   ```bash
   docker-compose exec frontend npx prisma db push
   docker-compose exec frontend npx ts-node prisma/seed.ts
   ```
5. **Attach SSL Certificates (Let's Encrypt / Certbot):**
   ```bash
   sudo certbot --nginx -d bste.edu.pk -d www.bste.edu.pk
   ```

---

## 3. Maintenance & Disaster Recovery Protocol

### Daily Operations:
- **Nightly Automated Database Backup:** Scheduled cron executing `node scripts/backup_db.js` with offsite S3 synchronization.
- **Audit Trail Monitoring:** Review `/portal/admin/logs` weekly for unauthorized access attempts or unusual marks modification patterns.

### Disaster Recovery:
- In the event of primary server failure:
  1. Spin up standby container instance.
  2. Restore database using `node scripts/restore_db.js <backup-file.json>`.
  3. Re-route DNS records to standby IP address.
