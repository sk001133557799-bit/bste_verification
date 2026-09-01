import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { programId?: string; isPublished?: boolean }) {
    const where: any = {};
    if (params.isPublished !== undefined) where.isPublished = params.isPublished;

    const data = await this.prisma.result.findMany({
      where,
      include: {
        student: {
          include: { institute: true, program: true },
        },
        marks: { include: { subject: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, data };
  }

  async setPublishStatus(id: string, isPublished: boolean) {
    const result = await this.prisma.result.findUnique({ where: { id } });
    if (!result) throw new NotFoundException('Result not found');

    const updated = await this.prisma.result.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return { success: true, data: updated };
  }
}
