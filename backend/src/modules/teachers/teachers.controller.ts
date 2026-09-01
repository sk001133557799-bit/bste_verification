import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Teachers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'List all faculty teachers and instructors (Admin Only)' })
  @ApiResponse({ status: 200, description: 'List of teachers' })
  async findAll() {
    return this.teachersService.findAll();
  }

  @Get('me/assigned')
  @Roles('TEACHER_EDITOR')
  @ApiOperation({ summary: 'Get assigned institute, department, and programs for current instructor' })
  async getAssigned(@CurrentUser('userId') userId: string) {
    return this.teachersService.getAssigned(userId);
  }

  @Post('create')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Onboard and create new teacher account (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  async create(@Body() dto: CreateTeacherDto, @CurrentUser('userId') userId: string) {
    return this.teachersService.create(dto, userId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Update teacher profile details (Admin Only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTeacherDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.teachersService.update(id, dto, userId);
  }

  @Put(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Toggle teacher active/inactive status (Admin Only)' })
  async toggleStatus(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.teachersService.toggleStatus(id, userId);
  }

  @Post(':id/reset-password')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Reset teacher account password (Admin Only)' })
  async resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.teachersService.resetPassword(id, newPassword, userId);
  }
}
