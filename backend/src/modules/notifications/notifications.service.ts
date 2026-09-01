import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { publishedAt: 'desc' },
    });
    return { success: true, data };
  }
}
