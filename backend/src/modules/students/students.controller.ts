import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'TEACHER_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List and search master student records with pagination' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'instituteId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('search') search?: string,
    @Query('programId') programId?: string,
    @Query('instituteId') instituteId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: any,
  ) {
    const userInstituteId = user?.role === 'TEACHER_EDITOR' ? user.instituteId : undefined;
    return this.studentsService.findAll({
      search,
      programId,
      instituteId,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      userInstituteId,
    });
  }

  @Public()
  @Get('verify/:rollNumber')
  @ApiOperation({ summary: 'Public Fast Verified Student Result Lookup by Roll Number' })
  @ApiResponse({ status: 200, description: 'Verified candidate record and marks' })
  @ApiResponse({ status: 404, description: 'No verified record found' })
  async verifyByRoll(@Param('rollNumber') rollNumber: string) {
    return this.studentsService.findByRollNumber(rollNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single candidate record by ID' })
  async findById(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'TEACHER_EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new student record with marks and certificate' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  async create(@Body() dto: CreateStudentDto, @CurrentUser() user: any) {
    return this.studentsService.create(dto, user?.userId, user?.role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update student personal info and status (Admin Only)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.studentsService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete student record (Admin Only)' })
  async delete(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.studentsService.delete(id, userId);
  }
}
