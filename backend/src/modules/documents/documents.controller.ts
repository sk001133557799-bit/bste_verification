import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':studentId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'TEACHER_EDITOR')
  @ApiOperation({ summary: 'List uploaded candidate documents (Sanads, CNIC)' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.documentsService.findByStudent(studentId);
  }
}
