import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl, buildVerificationUrl } from "@/lib/qr-generator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("roll") || searchParams.get("query") || searchParams.get("rollNumber") || searchParams.get("reg");

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: "Roll Number or Registration Number is required to verify academic results." },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim().toUpperCase();

    // Query database for matching student or result
    const result = await prisma.result.findFirst({
      where: {
        OR: [
          { verificationId: { equals: cleanQuery, mode: "insensitive" } },
          { student: { rollNumber: { equals: cleanQuery, mode: "insensitive" } } },
          { student: { registrationNumber: { equals: cleanQuery, mode: "insensitive" } } },
        ],
      },
      include: {
        student: true,
        subjects: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!result) {
      return NextResponse.json(
        {
          error: "No verified result found for the provided credential. Please verify your Roll Number or Registration Number.",
        },
        { status: 404 }
      );
    }

    // Generate live verification QR code
    const verificationUrl = buildVerificationUrl(result.verificationId || result.student.rollNumber);
    const qrDataUrl = await generateQrDataUrl(verificationUrl);

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        student: {
          fullName: result.student.studentName,
          fatherName: result.student.fatherName || "N/A",
          rollNumber: result.student.rollNumber,
          registrationNumber: result.student.registrationNumber || "N/A",
          cnic: result.student.cnic || "61101-1234567-1",
          gender: result.student.gender || "Male",
          className: result.student.program,
          semesterYear: result.student.semester,
          instituteName: result.student.instituteName || "Islamabad College of Technology (ICT)",
        },
        result: {
          examSession: result.student.session,
          totalMarks: result.totalMarks,
          obtainedMarks: result.obtainedMarks,
          percentage: result.percentage,
          gpa: result.gpa || 4.0,
          grade: result.grade,
          status: result.status,
          verificationId: result.verificationId,
          issueDate: result.issueDate.toISOString(),
          signatoryName: result.signatoryName || "Muhammad Sohail",
          signatoryTitle: result.signatoryTitle || "Prof. in Astrophysics and Controller of Examination",
        },
        marks: result.subjects.map((s, idx) => ({
          id: s.id || String(idx + 1),
          code: s.subjectCode || `SUBJ-${idx + 1}`,
          name: s.subjectName || "Course Subject",
          theoryMax: s.theoryMax || 0,
          theoryObtained: s.theoryObtained || 0,
          practicalMax: s.practicalMax || 0,
          practicalObtained: s.practicalObtained || 0,
          totalMax: s.totalMax || (s.theoryMax || 0) + (s.practicalMax || 0),
          totalObtained: s.totalObtained || (s.theoryObtained || 0) + (s.practicalObtained || 0),
          grade: s.grade || "A",
          status: s.status || "PASS",
        })),
        verificationUrl,
        qrDataUrl,
      },
    });
  } catch (err: any) {
    console.error("Public Verify API Error:", err);
    return NextResponse.json(
      { error: "Database error occurred while searching academic records." },
      { status: 500 }
    );
  }
}
