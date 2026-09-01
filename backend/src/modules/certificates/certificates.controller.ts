import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Public()
  @Get(':certId')
  @ApiOperation({ summary: 'Direct Certificate QR Verification Resolver' })
  @ApiResponse({ status: 200, description: 'Authenticated certificate and transcript details' })
  async findByCertId(@Param('certId') certId: string) {
    return this.certificatesService.findByCertificateNumber(certId);
  }
}
