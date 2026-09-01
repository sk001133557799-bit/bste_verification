const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

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

async function initSuperAdmin() {
  console.log("==================================================");
  console.log("🔐 BSTE ISLAMABAD — PRODUCTION SUPER ADMIN PROVISIONING");
  console.log("==================================================");

  const email = (process.env.ADMIN_INITIAL_EMAIL || process.argv[2] || "superadmin@bste.edu.pk").toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD || process.argv[3] || "SuperAdmin@123";
  const fullName = process.env.ADMIN_INITIAL_NAME || process.argv[4] || "Prof. Muhammad Sohail";
  const username = (process.env.ADMIN_INITIAL_USERNAME || process.argv[5] || "superadmin").trim();

  try {
    // 1. Ensure SUPER_ADMIN role exists
    let superAdminRole = await prisma.role.findUnique({
      where: { name: "SUPER_ADMIN" },
    });

    if (!superAdminRole) {
      superAdminRole = await prisma.role.create({
        data: {
          name: "SUPER_ADMIN",
          description: "Full statutory administrative access to BSTE platform",
          permissions: JSON.stringify(["ALL_PERMISSIONS", "SYSTEM_SETTINGS", "USER_MANAGEMENT", "RESULTS_MANAGE"]),
        },
      });
      console.log("✓ Created SUPER_ADMIN role in database.");
    }

    // 2. Check if admin user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      console.log(`ℹ️ Super Admin account with identifier "${email}" already exists (ID: ${existing.id}).`);
      console.log("✓ Super admin provisioning check passed.");
      return;
    }

    // 3. Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName,
        roleId: superAdminRole.id,
        isActive: true,
      },
    });

    // 5. Audit Log
    await prisma.activityLog.create({
      data: {
        userId: newUser.id,
        action: "PROVISION_SUPER_ADMIN",
        targetEntity: "User",
        targetId: newUser.id,
        ipAddress: "127.0.0.1",
        details: JSON.stringify({ email, fullName, role: "SUPER_ADMIN" }),
      },
    });

    console.log("==================================================");
    console.log(`✅ Super Admin Account Provisioned Successfully:`);
    console.log(`   User ID:   ${newUser.id}`);
    console.log(`   Email:     ${newUser.email}`);
    console.log(`   Full Name: ${newUser.fullName}`);
    console.log(`   Role:      SUPER_ADMIN`);
    console.log("==================================================");
  } catch (err) {
    console.error("❌ Super Admin provisioning failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initSuperAdmin();
