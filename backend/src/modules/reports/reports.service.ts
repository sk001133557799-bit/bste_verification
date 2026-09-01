import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const [
      totalStudents,
      totalPrograms,
      totalInstitutes,
      totalTeachers,
      totalResults,
      passedResults,
      pendingSubmissions,
      instituteDist,
      programDist,
    ] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.program.count(),
      this.prisma.institute.count(),
      this.prisma.teacher.count(),
      this.prisma.result.count(),
      this.prisma.result.count({ where: { finalStatus: 'PASSED' } }),
      this.prisma.submission.count({ where: { status: 'PENDING_APPROVAL' } }),
      this.prisma.institute.findMany({
        include: { _count: { select: { students: true } } },
      }),
      this.prisma.program.findMany({
        include: { _count: { select: { students: true } } },
      }),
    ]);

    const passPercentage =
      totalResults > 0 ? Number(((passedResults / totalResults) * 100).toFixed(1)) : 100;

    return {
      success: true,
      stats: {
        totalStudents,
        totalPrograms,
        totalInstitutes,
        totalTeachers,
        totalResults,
        passPercentage,
        pendingSubmissions,
      },
      instituteDistribution: instituteDist.map((i) => ({
        code: i.code,
        name: i.name,
        studentCount: i._count.students,
      })),
      programDistribution: programDist.map((p) => ({
        code: p.code,
        title: p.title,
        studentCount: p._count.students,
      })),
    };
  }
}
