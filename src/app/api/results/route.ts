import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { calculateGrade } from "@/lib/utils";
import { logActivity } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const className = searchParams.get("className") || searchParams.get("program") || "";
    const status = searchParams.get("status") || "";
    const grade = searchParams.get("grade") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (grade) {
      whereClause.grade = grade;
    }

    if (className) {
      whereClause.student = {
        program: { contains: className, mode: "insensitive" },
      };
    }

    if (search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { student: { rollNumber: { contains: q, mode: "insensitive" } } },
        { student: { studentName: { contains: q, mode: "insensitive" } } },
        { student: { registrationNumber: { contains: q, mode: "insensitive" } } },
        { student: { cnic: { contains: q, mode: "insensitive" } } },
        { student: { program: { contains: q, mode: "insensitive" } } },
        { verificationId: { contains: q, mode: "insensitive" } },
      ];
    }

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where: whereClause,
        include: {
          student: true,
          subjects: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.result.count({ where: whereClause }),
    ]);

    // Format results to match UI expectations
    const formatted = results.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.student.studentName,
      fatherName: r.student.fatherName,
      rollNumber: r.student.rollNumber,
      registrationNumber: r.student.registrationNumber,
      className: r.student.program,
      semesterYear: r.student.semester,
      examSession: r.student.session,
      instituteName: r.student.instituteName,
      cnic: r.student.cnic,
      gender: r.student.gender,
      totalMarks: r.totalMarks,
      obtainedMarks: r.obtainedMarks,
      percentage: r.percentage,
      gpa: r.gpa,
      grade: r.grade,
      status: r.status,
      verificationId: r.verificationId,
      issueDate: r.issueDate,
      signatoryName: r.signatoryName,
      signatoryTitle: r.signatoryTitle,
      createdAt: r.createdAt,
      subjects: r.subjects.map((s) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err: any) {
    console.error("GET Results API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch student results from database." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
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
      subjects, // Array of subject objects
      issueDate,
      signatoryName,
      signatoryTitle,
    } = body;

    const prog = (className || program || "").trim();
    const sem = (semesterYear || semester || "").trim();
    const sess = (examSession || sessionYear || "").trim();

    if (!studentName || !rollNumber || !prog || !sem || !sess) {
      return NextResponse.json(
        { error: "Student Name, Roll Number, Program/Class, Semester, and Exam Session are required." },
        { status: 400 }
      );
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanReg = registrationNumber ? registrationNumber.trim().toUpperCase() : null;

    // Check duplicate student roll number
    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber: cleanRoll },
    });

    if (existingStudent) {
      // Check if student already has a result for this session
      const existingResult = await prisma.result.findFirst({
        where: { studentId: existingStudent.id },
      });
      if (existingResult) {
        return NextResponse.json(
          { error: `A result record with Roll Number "${cleanRoll}" already exists in the database.` },
          { status: 400 }
        );
      }
    }

    // Process and calculate subject marks
    let rawSubjectsList: any[] = [];
    if (Array.isArray(subjects)) {
      rawSubjectsList = subjects;
    } else if (typeof subjects === "string") {
      try {
        rawSubjectsList = JSON.parse(subjects);
      } catch {
        rawSubjectsList = [];
      }
    }

    let totalMax = 0;
    let totalObt = 0;
    let hasFail = false;

    const computedSubjects = rawSubjectsList.map((s: any) => {
      const thMax = parseInt(String(s.theoryMax || 0), 10);
      const thObt = parseInt(String(s.theoryObtained || 0), 10);
      const prMax = parseInt(String(s.practicalMax || 0), 10);
      const prObt = parseInt(String(s.practicalObtained || 0), 10);

      const subjTotalMax = thMax + prMax;
      const subjTotalObt = thObt + prObt;

      totalMax += subjTotalMax;
      totalObt += subjTotalObt;

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

    const percentage = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
    const { grade: finalGrade, gpa } = calculateGrade(percentage);
    const finalStatus = hasFail ? "FAILED" : percentage >= 33 ? "PASSED" : "FAILED";

    const seq = Math.floor(10000 + Math.random() * 90000);
    const currentYear = new Date().getFullYear();
    const verificationId = `BSTE-CERT-${currentYear}-${seq}`;

    // Execute in Prisma transaction
    const created = await prisma.$transaction(async (tx) => {
      let student = existingStudent;
      if (!student) {
        student = await tx.student.create({
          data: {
            studentName: studentName.trim(),
            fatherName: fatherName?.trim() || "N/A",
            rollNumber: cleanRoll,
            registrationNumber: cleanReg,
            program: prog,
            semester: sem,
            session: sess,
            instituteName: instituteName?.trim() || "Islamabad College of Technology (ICT)",
            cnic: cnic?.trim() || "61101-1234567-1",
            gender: gender || "Male",
          },
        });
      } else {
        student = await tx.student.update({
          where: { id: student.id },
          data: {
            studentName: studentName.trim(),
            fatherName: fatherName?.trim() || student.fatherName,
            program: prog,
            semester: sem,
            session: sess,
            instituteName: instituteName?.trim() || student.instituteName,
            cnic: cnic?.trim() || student.cnic,
            gender: gender || student.gender,
          },
        });
      }

      const result = await tx.result.create({
        data: {
          studentId: student.id,
          totalMarks: totalMax || 100,
          obtainedMarks: totalObt || 0,
          percentage,
          gpa,
          grade: finalGrade,
          status: finalStatus,
          verificationId,
          issueDate: issueDate ? new Date(issueDate) : new Date(),
          signatoryName: signatoryName?.trim() || "Muhammad Sohail",
          signatoryTitle: signatoryTitle?.trim() || "Prof. in Astrophysics and Controller of Examination",
        },
      });

      if (computedSubjects.length > 0) {
        await tx.subject.createMany({
          data: computedSubjects.map((s) => ({
            resultId: result.id,
            ...s,
          })),
        });
      }

      return { student, result };
    });

    await logActivity({
      userId: session.userId,
      action: "CREATE_RESULT",
      targetId: created.result.id,
      details: { rollNumber: cleanRoll, studentName },
    });

    return NextResponse.json({
      success: true,
      message: "Result record created successfully in Supabase PostgreSQL.",
      data: created,
    });
  } catch (err: any) {
    console.error("POST Result API Error:", err);
    return NextResponse.json(
      { error: "Failed to create result record: " + (err.message || "") },
      { status: 500 }
    );
  }
}
