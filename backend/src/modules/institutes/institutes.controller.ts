import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstitutesService } from './institutes.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Institutes')
@Controller('institutes')
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all affiliated polytechnic and technical institutes' })
  @ApiResponse({ status: 200, description: 'List of institutes' })
  async findAll() {
    return this.institutesService.findAll();
  }
}
