const fs = require("fs");
const path = require("path");

// Load .env manually without external dependency
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  });
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createBackup() {
  console.log("==================================================");
  console.log("💾 INITIATING BSTE CENTRAL DATABASE BACKUP");
  console.log("==================================================");

  try {
    const [
      users,
      institutes,
      departments,
      programs,
      sessions,
      subjects,
      teachers,
      students,
      results,
      marks,
      certificates,
      submissions,
      announcements,
      activityLogs,
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.institute.findMany(),
      prisma.department.findMany(),
      prisma.program.findMany(),
      prisma.academicSession.findMany(),
      prisma.subject.findMany(),
      prisma.teacher.findMany(),
      prisma.student.findMany(),
      prisma.result.findMany(),
      prisma.mark.findMany(),
      prisma.certificate.findMany(),
      prisma.submission.findMany(),
      prisma.announcement.findMany(),
      prisma.activityLog.findMany(),
    ]);

    const backupData = {
      version: "1.0",
      board: "Board of Science and Technical Education Islamabad",
      createdAt: new Date().toISOString(),
      counts: {
        users: users.length,
        institutes: institutes.length,
        departments: departments.length,
        programs: programs.length,
        sessions: sessions.length,
        subjects: subjects.length,
        teachers: teachers.length,
        students: students.length,
        results: results.length,
        marks: marks.length,
        certificates: certificates.length,
        submissions: submissions.length,
        announcements: announcements.length,
        activityLogs: activityLogs.length,
      },
      data: {
        users,
        institutes,
        departments,
        programs,
        sessions,
        subjects,
        teachers,
        students,
        results,
        marks,
        certificates,
        submissions,
        announcements,
        activityLogs,
      },
    };

    const backupsDir = path.join(__dirname, "../backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `bste_backup_${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backupData, null, 2), "utf8");

    console.log(`✅ Backup successfully created at: ${filepath}`);
    console.log(`📊 Total Records Archived: ${students.length} Students, ${results.length} Results, ${certificates.length} Certificates.`);
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Backup failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();
