# 🎓 BSTE Islamabad - Result Verification System & Public Portal

An enterprise-grade, digitally secured academic result verification and institutional management system built for the **Board of Science & Technical Education (BSTE) Islamabad Capital Territory, Pakistan**.

---

## 🌟 Key Features

* **🛡️ Central Cryptographic Verification**: Instant real-time verification of student examination credentials, transcripts, and diploma certificates.
* **📱 Live 2D Dynamic QR Validation**: Scannable QR codes on official certificates linking directly to central verification URLs.
* **📄 Official Result PDF Generation**: High-resolution, vector-grade A4 printable government transcripts with guilloche watermark security patterns and Controller of Examinations signature blocks.
* **🔐 Production-Grade Admin Portal**:
  * Authenticated via Supabase PostgreSQL and `bcrypt` password hashing (10 salt rounds).
  * Protected at the Edge via Next.js Middleware and HTTP-only session cookies.
  * Full Student & Result CRUD operations, dynamic search filters, and real-time pagination.
  * Bulk result imports via Excel (`.xlsx`) and CSV with transactional rollbacks.
* **⚡ Modern Tech Stack**:
  * **Framework**: Next.js 14 (App Router, TypeScript)
  * **Database & ORM**: Supabase PostgreSQL + Prisma ORM
  * **Styling & UI**: Tailwind CSS, Framer Motion, Spline 3D Scene Integration, Lucide Icons

---

## 🚀 Environment Configuration (.env)

Create a `.env` file in the root directory (see `.env.example`):

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET="your_production_jwt_secret_key"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NODE_ENV="production"
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Sync & Seeding
```bash
# Push schema to Supabase PostgreSQL
npx prisma db push

# Seed initial records and admin account
npm run prisma:seed
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
npm start
```

---

## 🏛️ Default Credentials (Seed Data)
* **Admin Login**: `/portal/login`
* **Username**: `admin`
* **Password**: `Admin@123`
