import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Approvals & Workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Get('pending')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Get all pending teacher marks submissions' })
  @ApiResponse({ status: 200, description: 'List of pending submissions' })
  async getPending() {
    return this.approvalsService.getPending();
  }

  @Post(':id/approve')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Approve teacher submission and publish student results (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Submission approved and published' })
  async approve(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.approvalsService.approve(id, userId);
  }

  @Post(':id/reject')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Reject teacher submission with feedback remarks (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Submission rejected' })
  async reject(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.approvalsService.reject(id, reason, userId);
  }
}
