import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.program.findMany({
      include: {
        department: true,
        subjects: true,
        _count: { select: { students: true } },
      },
      orderBy: { title: 'asc' },
    });
    return { success: true, data };
  }
}
