import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [totalResults, passedCount, recentResults, allResults] = await Promise.all([
      prisma.result.count(),
      prisma.result.count({ where: { status: "PASSED" } }),
      prisma.result.findMany({
        take: 8,
        include: {
          student: true,
          subjects: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.result.findMany({
        select: {
          grade: true,
          percentage: true,
          status: true,
          student: {
            select: {
              program: true,
            },
          },
        },
      }),
    ]);

    const passPercentage = totalResults > 0 ? Number(((passedCount / totalResults) * 100).toFixed(1)) : 100;
    const averageScore =
      totalResults > 0
        ? Number((allResults.reduce((acc, r) => acc + r.percentage, 0) / totalResults).toFixed(1))
        : 0;

    // Grade breakdown
    const grades = ["A+", "A", "B", "C", "D", "F"];
    const gradeDistribution = grades.map((g) => ({
      grade: g,
      count: allResults.filter((r) => r.grade === g).length,
    }));

    // Class / Program breakdown
    const classMap: Record<string, number> = {};
    allResults.forEach((r) => {
      const cls = r.student?.program || "General Program";
      classMap[cls] = (classMap[cls] || 0) + 1;
    });

    const classDistribution = Object.entries(classMap).map(([title, count]) => ({
      title,
      count,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: totalResults,
        totalResults,
        passedStudents: passedCount,
        failedStudents: totalResults - passedCount,
        passPercentage,
        averageScore,
      },
      gradeDistribution,
      classDistribution,
      recentResults: recentResults.map((r) => ({
        id: r.id,
        studentName: r.student.studentName,
        rollNumber: r.student.rollNumber,
        registrationNumber: r.student.registrationNumber,
        className: r.student.program,
        semesterYear: r.student.semester,
        examSession: r.student.session,
        totalMarks: r.totalMarks,
        obtainedMarks: r.obtainedMarks,
        percentage: r.percentage,
        grade: r.grade,
        status: r.status,
        verificationId: r.verificationId,
        subjectsCount: r.subjects.length,
        createdAt: r.createdAt,
      })),
    });
  } catch (err: any) {
    console.error("GET Reports error:", err);
    return NextResponse.json({ error: "Failed to load dashboard metrics." }, { status: 500 });
  }
}
