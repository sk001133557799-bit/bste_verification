import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { calculateGrade } from "@/lib/utils";
import { logActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await prisma.result.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        subjects: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result record not found." }, { status: 404 });
    }

    const formatted = {
      id: result.id,
      studentId: result.studentId,
      studentName: result.student.studentName,
      fatherName: result.student.fatherName,
      rollNumber: result.student.rollNumber,
      registrationNumber: result.student.registrationNumber,
      className: result.student.program,
      semesterYear: result.student.semester,
      examSession: result.student.session,
      instituteName: result.student.instituteName,
      cnic: result.student.cnic,
      gender: result.student.gender,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      percentage: result.percentage,
      gpa: result.gpa,
      grade: result.grade,
      status: result.status,
      verificationId: result.verificationId,
      issueDate: result.issueDate,
      signatoryName: result.signatoryName,
      signatoryTitle: result.signatoryTitle,
      createdAt: result.createdAt,
      subjects: result.subjects.map((s) => ({
        id: s.id,
        code: s.subjectCode,
        name: s.subjectName,
        theoryMax: s.theoryMax,
        theoryObtained: s.theoryObtained,
        practicalMax: s.practicalMax,
        practicalObtained: s.practicalObtained,
        totalMax: s.totalMax,
        totalObtained: s.totalObtained,
        marks: s.marks || s.totalObtained,
        grade: s.grade,
        status: s.status,
      })),
    };

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error("GET Result by ID error:", err);
    return NextResponse.json({ error: "Failed to fetch result." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.result.findUnique({
      where: { id: params.id },
      include: { student: true, subjects: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Result record not found." }, { status: 404 });
    }

    const body = await req.json();
    const {
      studentName,
      rollNumber,
      registrationNumber,
      className,
      program,
      semesterYear,
      semester,
      examSession,
      session: sessionYear,
      instituteName,
      cnic,
      gender,
      fatherName,
      subjects, // Array of subjects
      issueDate,
      signatoryName,
      signatoryTitle,
    } = body;

    const prog = className || program || existing.student.program;
    const sem = semesterYear || semester || existing.student.semester;
    const sess = examSession || sessionYear || existing.student.session;
    const cleanRoll = rollNumber ? rollNumber.trim().toUpperCase() : existing.student.rollNumber;
    const cleanReg = registrationNumber !== undefined ? (registrationNumber ? registrationNumber.trim().toUpperCase() : null) : existing.student.registrationNumber;

    // Check duplicate roll number if changed
    if (cleanRoll !== existing.student.rollNumber) {
      const duplicate = await prisma.student.findUnique({
        where: { rollNumber: cleanRoll },
      });
      if (duplicate && duplicate.id !== existing.studentId) {
        return NextResponse.json(
          { error: `Roll number "${cleanRoll}" is already assigned to another student.` },
          { status: 400 }
        );
      }
    }

    // Recompute subjects & marks if provided
    let totalMax = existing.totalMarks;
    let totalObt = existing.obtainedMarks;
    let percentage = existing.percentage;
    let finalGrade = existing.grade;
    let finalStatus = existing.status;
    let gpa = existing.gpa;
    let computedSubjects: any[] | null = null;

    if (subjects !== undefined) {
      let rawList: any[] = [];
      if (Array.isArray(subjects)) {
        rawList = subjects;
      } else if (typeof subjects === "string") {
        try {
          rawList = JSON.parse(subjects);
        } catch {
          rawList = [];
        }
      }

      let tMax = 0;
      let tObt = 0;
      let hasFail = false;

      computedSubjects = rawList.map((s: any) => {
        const thMax = parseInt(String(s.theoryMax || 0), 10);
        const thObt = parseInt(String(s.theoryObtained || 0), 10);
        const prMax = parseInt(String(s.practicalMax || 0), 10);
        const prObt = parseInt(String(s.practicalObtained || 0), 10);

        const subjTotalMax = thMax + prMax;
        const subjTotalObt = thObt + prObt;

        tMax += subjTotalMax;
        tObt += subjTotalObt;

        const subjPct = subjTotalMax > 0 ? (subjTotalObt / subjTotalMax) * 100 : 0;
        const isSubjPass = subjPct >= 33;
        if (!isSubjPass) hasFail = true;

        const { grade } = calculateGrade(subjPct);

        return {
          subjectCode: s.code || s.subjectCode ? String(s.code || s.subjectCode).trim().toUpperCase() : "SUBJ",
          subjectName: s.name || s.subjectName ? String(s.name || s.subjectName).trim() : "General Course",
          theoryMax: thMax,
          theoryObtained: thObt,
          practicalMax: prMax,
          practicalObtained: prObt,
          totalMax: subjTotalMax,
          totalObtained: subjTotalObt,
          marks: subjTotalObt,
          grade,
          status: isSubjPass ? "PASS" : "FAIL",
        };
      });

      totalMax = tMax || existing.totalMarks;
      totalObt = tObt;
      percentage = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
      const resGrade = calculateGrade(percentage);
      finalGrade = resGrade.grade;
      gpa = resGrade.gpa;
      finalStatus = hasFail ? "FAILED" : percentage >= 33 ? "PASSED" : "FAILED";
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update Student particulars
      await tx.student.update({
        where: { id: existing.studentId },
        data: {
          studentName: studentName ? studentName.trim() : existing.student.studentName,
          fatherName: fatherName !== undefined ? fatherName.trim() : existing.student.fatherName,
          rollNumber: cleanRoll,
          registrationNumber: cleanReg,
          program: prog.trim(),
          semester: sem.trim(),
          session: sess.trim(),
          instituteName: instituteName !== undefined ? instituteName.trim() : existing.student.instituteName,
          cnic: cnic !== undefined ? cnic.trim() : existing.student.cnic,
          gender: gender !== undefined ? gender : existing.student.gender,
        },
      });

      // 2. Update Result record
      const resUpdated = await tx.result.update({
        where: { id: params.id },
        data: {
          totalMarks: totalMax,
          obtainedMarks: totalObt,
          percentage,
          gpa,
          grade: finalGrade,
          status: finalStatus,
          issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
          signatoryName: signatoryName !== undefined ? signatoryName.trim() : existing.signatoryName,
          signatoryTitle: signatoryTitle !== undefined ? signatoryTitle.trim() : existing.signatoryTitle,
        },
      });

      // 3. Replace subjects if updated
      if (computedSubjects) {
        await tx.subject.deleteMany({
          where: { resultId: params.id },
        });

        if (computedSubjects.length > 0) {
          await tx.subject.createMany({
            data: computedSubjects.map((s) => ({
              resultId: params.id,
              ...s,
            })),
          });
        }
      }

      return resUpdated;
    });

    await logActivity({
      userId: session.userId,
      action: "UPDATE_RESULT",
      targetId: params.id,
      details: { rollNumber: cleanRoll, studentName: studentName || existing.student.studentName },
    });

    return NextResponse.json({
      success: true,
      message: "Result record updated successfully in Supabase PostgreSQL.",
      data: updated,
    });
  } catch (err: any) {
    console.error("PUT Result error:", err);
    return NextResponse.json(
      { error: "Failed to update result record: " + (err.message || "") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const existing = await prisma.result.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Result record not found." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.subject.deleteMany({
        where: { resultId: params.id },
      });
      await tx.result.delete({
        where: { id: params.id },
      });
      // If student has no other results, delete student record
      const remaining = await tx.result.count({
        where: { studentId: existing.studentId },
      });
      if (remaining === 0) {
        await tx.student.delete({
          where: { id: existing.studentId },
        });
      }
    });

    await logActivity({
      userId: session.userId,
      action: "DELETE_RESULT",
      targetId: params.id,
      details: { rollNumber: existing.student.rollNumber, studentName: existing.student.studentName },
    });

    return NextResponse.json({
      success: true,
      message: `Result for ${existing.student.studentName} (${existing.student.rollNumber}) deleted successfully.`,
    });
  } catch (err: any) {
    console.error("DELETE Result error:", err);
    return NextResponse.json(
      { error: "Failed to delete result record." },
      { status: 500 }
    );
  }
}
