import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async findByCertificateNumber(certNumber: string) {
    const clean = certNumber.trim().toUpperCase();
    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNumber: clean },
      include: {
        student: {
          include: { institute: true, department: true, program: true, session: true },
        },
        result: {
          include: { marks: { include: { subject: true } } },
        },
      },
    });

    if (!cert) {
      throw new NotFoundException(`Certificate "${clean}" not found in registry.`);
    }

    return { success: true, data: cert };
  }
}
