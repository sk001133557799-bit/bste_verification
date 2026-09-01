import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findByStudent(studentId: string) {
    const docs = await this.prisma.document.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' },
    });
    return { success: true, data: docs };
  }

  async create(data: { studentId: string; docType: string; fileUrl: string }) {
    const doc = await this.prisma.document.create({
      data: {
        studentId: data.studentId,
        docType: data.docType,
        fileUrl: data.fileUrl,
      },
    });
    return { success: true, data: doc };
  }
}
