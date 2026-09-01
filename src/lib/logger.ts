import { db } from "@/lib/db";

interface LogParams {
  userId?: string;
  action: string;
  targetId?: string;
  details?: Record<string, any> | string;
}

export async function logActivity({ userId, action, targetId, details }: LogParams) {
  try {
    const detailsStr = typeof details === "object" ? JSON.stringify(details) : details || null;
    await db.activityLog.create({
      data: {
        userId: userId || null,
        action,
        targetId: targetId || null,
        details: detailsStr,
      },
    });
  } catch (err) {
    console.error("Activity log error:", err);
  }
}
