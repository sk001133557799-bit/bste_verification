import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.activityLog.findMany({
      include: {
        user: { select: { fullName: true, username: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, data };
  }
}
