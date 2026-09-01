import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  private calculateGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A+', remarks: 'Outstanding', gpa: 4.0 };
    if (percentage >= 70) return { grade: 'A', remarks: 'Excellent', gpa: 3.7 };
    if (percentage >= 60) return { grade: 'B', remarks: 'Very Good', gpa: 3.0 };
    if (percentage >= 50) return { grade: 'C', remarks: 'Good', gpa: 2.5 };
    if (percentage >= 40) return { grade: 'D', remarks: 'Fair', gpa: 2.0 };
    if (percentage >= 33) return { grade: 'E', remarks: 'Pass', gpa: 1.0 };
    return { grade: 'F', remarks: 'Fail', gpa: 0.0 };
  }

  private generateSecurityHash(studentRoll: string, certNumber: string, passingYear: number): string {
    const salt = process.env.JWT_SECRET || 'bste_islamabad_secure_jwt_token_key_2026_super_secret';
    const data = `${studentRoll}|${certNumber}|${passingYear}|${salt}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16).toUpperCase();
  }

  async findAll(params: {
    search?: string;
    programId?: string;
    instituteId?: string;
    status?: string;
    page?: number;
    limit?: number;
    userInstituteId?: string;
  }) {
    const { search, programId, instituteId, status, page = 1, limit = 20, userInstituteId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userInstituteId) {
      where.instituteId = userInstituteId;
    } else if (instituteId) {
      where.instituteId = instituteId;
    }

    if (programId) where.programId = programId;
    if (status) where.status = status;

    if (search?.trim()) {
      where.OR = [
        { rollNumber: { contains: search.trim() } },
        { registrationNumber: { contains: search.trim() } },
        { fullName: { contains: search.trim() } },
        { cnic: { contains: search.trim() } },
      ];
    }

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: {
          institute: true,
          department: true,
          program: true,
          session: true,
          results: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              certificates: { take: 1 },
              marks: { include: { subject: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByRollNumber(rollNumber: string) {
    const clean = rollNumber.trim().toUpperCase();
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [
          { rollNumber: clean },
          { registrationNumber: clean },
          { rollNumber: { contains: clean } },
        ],
      },
      include: {
        institute: true,
        department: true,
        program: true,
        session: true,
        results: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            marks: { include: { subject: true } },
            certificates: { where: { isRevoked: false }, take: 1 },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`No verified record found for Roll Number "${clean}".`);
    }

    return {
      success: true,
      data: student,
    };
  }

  async findById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        institute: true,
        department: true,
        program: true,
        session: true,
        results: {
          include: {
            certificates: true,
            marks: { include: { subject: true } },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student record not found.');
    }

    return { success: true, data: student };
  }

  async create(dto: CreateStudentDto, currentUserId?: string, userRole?: string) {
    const cleanRoll = dto.rollNumber.trim().toUpperCase();
    const cleanReg = dto.registrationNumber.trim().toUpperCase();

    const existing = await this.prisma.student.findFirst({
      where: {
        OR: [{ rollNumber: cleanRoll }, { registrationNumber: cleanReg }],
      },
    });

    if (existing) {
      throw new ConflictException(
        `Candidate with Roll Number "${cleanRoll}" or Reg No "${cleanReg}" already exists.`,
      );
    }

    const student = await this.prisma.student.create({
      data: {
        studentId: `BSTE-STU-${Math.floor(10000 + Math.random() * 90000)}`,
        rollNumber: cleanRoll,
        registrationNumber: cleanReg,
        fullName: dto.fullName.trim(),
        fatherName: dto.fatherName.trim(),
        cnic: dto.cnic.trim(),
        dob: dto.dob || null,
        gender: dto.gender || 'Male',
        contactNo: dto.contactNo || null,
        email: dto.email || null,
        address: dto.address || null,
        photoUrl:
          dto.photoUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        instituteId: dto.instituteId,
        departmentId: dto.departmentId,
        programId: dto.programId,
        sessionId: dto.sessionId,
        passingYear: dto.passingYear || 2026,
        status: 'PASSED',
      },
    });

    // Process marks if provided
    if (dto.marksList && dto.marksList.length > 0) {
      const subjectsInDb = await this.prisma.subject.findMany({
        where: { programId: dto.programId },
      });

      let totalMax = 0;
      let totalObt = 0;
      let hasFail = false;

      const marksToCreate = dto.marksList.map((m) => {
        const subj = subjectsInDb.find((s) => s.id === m.subjectId);
        const thMax = subj?.theoryMax || 100;
        const prMax = subj?.practicalMax || 50;
        const totSubjMax = thMax + prMax;
        const totSubjObt = m.theoryObtained + m.practicalObtained;

        totalMax += totSubjMax;
        totalObt += totSubjObt;

        const pct = (totSubjObt / totSubjMax) * 100;
        if (pct < 33) hasFail = true;

        const { grade } = this.calculateGrade(pct);

        return {
          subjectId: m.subjectId,
          theoryObtained: m.theoryObtained,
          practicalObtained: m.practicalObtained,
          totalObtained: totSubjObt,
          grade,
          status: pct >= 33 ? 'PASS' : 'FAIL',
        };
      });

      const finalPct = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(2)) : 0;
      const { grade: finalGrade, gpa } = this.calculateGrade(finalPct);
      const isPublished = userRole !== 'TEACHER_EDITOR';

      const result = await this.prisma.result.create({
        data: {
          studentId: student.id,
          examSession: `${dto.passingYear || 2026} Annual Examination`,
          examinationType: 'ANNUAL',
          totalMarks: totalMax,
          obtainedMarks: totalObt,
          percentage: finalPct,
          gpa,
          grade: finalGrade,
          finalStatus: hasFail ? 'FAILED' : 'PASSED',
          isPublished,
          publishedAt: isPublished ? new Date() : null,
        },
      });

      for (const mtc of marksToCreate) {
        await this.prisma.mark.create({
          data: {
            resultId: result.id,
            ...mtc,
          },
        });
      }

      // Generate Certificate
      const certNum = `BSTE-CERT-${dto.passingYear || 2026}-${Math.floor(10000 + Math.random() * 90000)}`;
      const securityHash = this.generateSecurityHash(student.rollNumber, certNum, dto.passingYear || 2026);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

      await this.prisma.certificate.create({
        data: {
          certificateNumber: certNum,
          studentId: student.id,
          resultId: result.id,
          qrVerificationUrl: `${baseUrl}/verify/${certNum}`,
          securityHash,
          issueDate: new Date(),
          signatoryName: 'Prof. Dr. Tariq Mahmood',
          signatoryTitle: 'Controller of Examinations, BSTE',
        },
      });
    }

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'CREATE_STUDENT_NEST',
          targetEntity: 'Student',
          targetId: student.id,
          details: JSON.stringify({ roll: student.rollNumber, name: student.fullName }),
        },
      });
    }

    return {
      success: true,
      message: 'Student record created successfully',
      data: student,
    };
  }

  async update(id: string, dto: UpdateStudentDto, currentUserId?: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'UPDATE_STUDENT_NEST',
          targetEntity: 'Student',
          targetId: id,
          details: JSON.stringify(dto),
        },
      });
    }

    return { success: true, data: updated };
  }

  async delete(id: string, currentUserId?: string) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.student.delete({ where: { id } });

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'DELETE_STUDENT_NEST',
          targetEntity: 'Student',
          targetId: id,
          details: JSON.stringify({ roll: student.rollNumber, name: student.fullName }),
        },
      });
    }

    return { success: true, message: 'Student record deleted successfully.' };
  }
}
