import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InstitutesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.institute.findMany({
      include: {
        departments: true,
        _count: { select: { students: true, teachers: true } },
      },
      orderBy: { name: 'asc' },
    });
    return { success: true, data };
  }
}
