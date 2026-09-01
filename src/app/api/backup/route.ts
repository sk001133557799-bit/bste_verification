import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [results, users, logs] = await Promise.all([
      db.result.findMany(),
      db.user.findMany({ select: { id: true, username: true, email: true, fullName: true, role: true } }),
      db.activityLog.findMany({ take: 100, orderBy: { createdAt: "desc" } }),
    ]);

    const backupPayload = {
      exportTimestamp: new Date().toISOString(),
      board: "Board of Science and Technical Education Islamabad",
      version: "2026.1",
      data: {
        results,
        users,
        logs,
      },
    };

    return new Response(JSON.stringify(backupPayload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="BSTE_Database_Backup_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err: any) {
    console.error("Backup API Error:", err);
    return NextResponse.json({ error: "Database backup export failed." }, { status: 500 });
  }
}
