import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all academic curricula and subjects (DAE, DIT, BS-Tech)' })
  @ApiResponse({ status: 200, description: 'List of programs' })
  async findAll() {
    return this.programsService.findAll();
  }
}
