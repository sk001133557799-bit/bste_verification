import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  async getPending() {
    const submissions = await this.prisma.submission.findMany({
      where: { status: 'PENDING_APPROVAL' },
      include: {
        teacher: { include: { user: true } },
        program: true,
        institute: true,
        results: { include: { student: true, marks: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });
    return { success: true, data: submissions };
  }

  async approve(id: string, reviewerUserId?: string) {
    const sub = await this.prisma.submission.findUnique({
      where: { id },
      include: { results: true },
    });

    if (!sub) throw new NotFoundException('Submission not found.');

    await this.prisma.submission.update({
      where: { id },
      data: {
        status: 'APPROVED',
        reviewedById: reviewerUserId,
        reviewedAt: new Date(),
      },
    });

    await this.prisma.result.updateMany({
      where: { submissionId: id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    if (reviewerUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: reviewerUserId,
          action: 'APPROVE_SUBMISSION_NEST',
          targetEntity: 'Submission',
          targetId: id,
          details: JSON.stringify({ count: sub.results.length }),
        },
      });
    }

    return {
      success: true,
      message: 'Submission approved and candidate records published to public portal.',
    };
  }

  async reject(id: string, reason?: string, reviewerUserId?: string) {
    const sub = await this.prisma.submission.findUnique({ where: { id } });
    if (!sub) throw new NotFoundException('Submission not found.');

    await this.prisma.submission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason || 'Marks discrepancy corrections required.',
        reviewedById: reviewerUserId,
        reviewedAt: new Date(),
      },
    });

    if (reviewerUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: reviewerUserId,
          action: 'REJECT_SUBMISSION_NEST',
          targetEntity: 'Submission',
          targetId: id,
          details: JSON.stringify({ reason }),
        },
      });
    }

    return {
      success: true,
      message: 'Submission rejected and returned to teacher with feedback.',
    };
  }
}
