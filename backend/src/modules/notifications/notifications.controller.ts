import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get active board gazette announcements and notifications' })
  @ApiResponse({ status: 200, description: 'List of announcements' })
  async findAll() {
    return this.notificationsService.findAll();
  }
}
