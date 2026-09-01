import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        teacherProfile: {
          include: {
            institute: true,
            department: true,
            assignments: {
              include: { program: true, session: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role.name,
        avatarUrl: user.avatarUrl,
        teacherProfile: user.teacherProfile,
        lastLoginAt: user.lastLoginAt,
      },
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        role: true,
        teacherProfile: {
          include: { institute: true, department: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        role: u.role.name,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        teacherProfile: u.teacherProfile,
      })),
    };
  }
}
