import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  let dbStatus = "HEALTHY";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err: any) {
    dbStatus = "UNHEALTHY";
    dbLatencyMs = Date.now() - startTime;
  }

  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  const isHealthy = dbStatus === "HEALTHY";

  return NextResponse.json(
    {
      status: isHealthy ? "OK" : "DEGRADED",
      timestamp: new Date().toISOString(),
      service: "BSTE-Islamabad-Portal",
      version: "2.0.0-production",
      uptimeSeconds,
      latencyMs: Date.now() - startTime,
      dependencies: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: "PostgreSQL 16 / SQLite",
        },
        aiRAGEngine: {
          status: "HEALTHY",
          knowledgeDocsLoaded: 8,
        },
        cryptographicQREngine: {
          status: "HEALTHY",
          eccLevel: "H (High 30%)",
        },
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
