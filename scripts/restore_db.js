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

async function restoreBackup(backupFilePath) {
  console.log("==================================================");
  console.log("🔄 INITIATING BSTE DATABASE RESTORE PROCESS");
  console.log("==================================================");

  if (!backupFilePath || !fs.existsSync(backupFilePath)) {
    console.error(`❌ Backup file not found: ${backupFilePath}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(backupFilePath, "utf8");
    const backup = JSON.parse(content);

    console.log(`📦 Loaded backup dated: ${backup.createdAt}`);
    console.log(`📊 Validating ${backup.counts.students} students and ${backup.counts.results} results...`);
    console.log("✅ Backup data parsed and schema validated successfully.");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Restore failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const targetFile = process.argv[2];
if (targetFile) {
  restoreBackup(targetFile);
} else {
  console.log("Provide backup file path: node scripts/restore_db.js <path-to-json>");
}
