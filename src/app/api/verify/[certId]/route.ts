import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl, buildVerificationUrl } from "@/lib/qr-generator";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { certId: string } }
) {
  try {
    const { certId } = params;

    if (!certId) {
      return NextResponse.json({ error: "Certificate ID is required." }, { status: 400 });
    }

    const cleanCertId = certId.trim().toUpperCase();

    // Look up in database by verificationId, rollNumber, or registrationNumber
    const result = await prisma.result.findFirst({
      where: {
        OR: [
          { verificationId: { equals: cleanCertId, mode: "insensitive" } },
          { student: { rollNumber: { equals: cleanCertId, mode: "insensitive" } } },
          { student: { registrationNumber: { equals: cleanCertId, mode: "insensitive" } } },
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
          error: `No verified result record found for credential "${cleanCertId}".`,
        },
        { status: 404 }
      );
    }

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
          name: s.subjectName || "Subject Course",
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
    console.error("Direct Cert Verify API Error:", err);
    return NextResponse.json(
      { error: "Internal database error occurred while retrieving certificate." },
      { status: 500 }
    );
  }
}
