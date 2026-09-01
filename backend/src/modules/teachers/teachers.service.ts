import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const teachers = await this.prisma.teacher.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, username: true, phone: true, isActive: true, lastLoginAt: true } },
        institute: true,
        department: true,
        assignments: {
          include: { program: true, session: true },
        },
        submissions: {
          orderBy: { submittedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { user: { createdAt: 'desc' } },
    });
    return { success: true, data: teachers };
  }

  async getAssigned(teacherUserId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherUserId },
      include: {
        institute: true,
        department: true,
        assignments: {
          include: { program: true, session: true },
        },
        submissions: {
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found.');
    }

    return { success: true, data: teacher };
  }

  async create(dto: CreateTeacherDto, currentUserId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email.toLowerCase() }, { username: dto.username.toLowerCase() }],
      },
    });

    if (existing) {
      throw new ConflictException('A user with this email or username already exists.');
    }

    let role = await this.prisma.role.findUnique({
      where: { name: 'TEACHER_EDITOR' },
    });

    if (!role) {
      role = await this.prisma.role.create({
        data: {
          name: 'TEACHER_EDITOR',
          description: 'Departmental Faculty & Marks Entry Editor',
        },
      });
    }

    const passwordHash = await bcrypt.hash(dto.password || 'Teacher@123', 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        username: dto.username.toLowerCase().trim(),
        passwordHash,
        phone: dto.phone || null,
        roleId: role.id,
      },
    });

    const teacher = await this.prisma.teacher.create({
      data: {
        userId: user.id,
        designation: dto.designation,
        qualification: dto.qualification || null,
        specialization: dto.specialization || null,
        cnic: dto.cnic || null,
        instituteId: dto.instituteId,
        departmentId: dto.departmentId,
      },
      include: {
        user: true,
        institute: true,
        department: true,
      },
    });

    // Create assignment if program is provided
    if (dto.programId) {
      await this.prisma.teacherAssignment.create({
        data: {
          teacherId: teacher.id,
          instituteId: dto.instituteId,
          programId: dto.programId,
          sessionId: dto.sessionId || null,
        },
      });
    }

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'CREATE_TEACHER_ACCOUNT',
          targetEntity: 'Teacher',
          targetId: teacher.id,
          details: JSON.stringify({ name: dto.fullName, email: dto.email }),
        },
      });
    }

    return {
      success: true,
      message: 'Teacher account created successfully',
      data: teacher,
    };
  }

  async update(id: string, dto: UpdateTeacherDto, currentUserId?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) throw new NotFoundException('Teacher profile not found.');

    if (dto.fullName || dto.email || dto.phone) {
      await this.prisma.user.update({
        where: { id: teacher.userId },
        data: {
          ...(dto.fullName && { fullName: dto.fullName.trim() }),
          ...(dto.email && { email: dto.email.toLowerCase().trim() }),
          ...(dto.phone && { phone: dto.phone }),
        },
      });
    }

    const updated = await this.prisma.teacher.update({
      where: { id },
      data: {
        ...(dto.designation && { designation: dto.designation }),
        ...(dto.cnic && { cnic: dto.cnic }),
        ...(dto.instituteId && { instituteId: dto.instituteId }),
        ...(dto.departmentId && { departmentId: dto.departmentId }),
      },
      include: {
        user: true,
        institute: true,
        department: true,
      },
    });

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'UPDATE_TEACHER_ACCOUNT',
          targetEntity: 'Teacher',
          targetId: id,
          details: JSON.stringify(dto),
        },
      });
    }

    return { success: true, data: updated };
  }

  async toggleStatus(id: string, currentUserId?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) throw new NotFoundException('Teacher not found.');

    const newStatus = !teacher.user.isActive;
    await this.prisma.user.update({
      where: { id: teacher.userId },
      data: { isActive: newStatus },
    });

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: newStatus ? 'ACTIVATE_TEACHER' : 'DEACTIVATE_TEACHER',
          targetEntity: 'Teacher',
          targetId: id,
          details: JSON.stringify({ isActive: newStatus }),
        },
      });
    }

    return {
      success: true,
      message: `Teacher account ${newStatus ? 'activated' : 'deactivated'} successfully.`,
      isActive: newStatus,
    };
  }

  async resetPassword(id: string, newPass?: string, currentUserId?: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) throw new NotFoundException('Teacher not found.');

    const passwordToSet = newPass || 'Teacher@123';
    const passwordHash = await bcrypt.hash(passwordToSet, 10);

    await this.prisma.user.update({
      where: { id: teacher.userId },
      data: { passwordHash },
    });

    if (currentUserId) {
      await this.prisma.activityLog.create({
        data: {
          userId: currentUserId,
          action: 'RESET_TEACHER_PASSWORD',
          targetEntity: 'Teacher',
          targetId: id,
          details: JSON.stringify({ userId: teacher.userId }),
        },
      });
    }

    return {
      success: true,
      message: `Password reset successfully. Default password is: ${passwordToSet}`,
    };
  }
}
