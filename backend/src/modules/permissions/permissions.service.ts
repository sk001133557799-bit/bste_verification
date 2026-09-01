import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const defaultPermissions = [
      { code: 'students:create', module: 'STUDENTS', description: 'Register new candidates' },
      { code: 'students:read', module: 'STUDENTS', description: 'View master student ledger' },
      { code: 'students:update', module: 'STUDENTS', description: 'Modify candidate bio and marks' },
      { code: 'students:delete', module: 'STUDENTS', description: 'Remove candidate records' },
      { code: 'results:publish', module: 'RESULTS', description: 'Publish results to public' },
      { code: 'results:grade', module: 'RESULTS', description: 'Enter theory and practical marks' },
      { code: 'submissions:approve', module: 'SUBMISSIONS', description: 'Approve teacher batches' },
      { code: 'submissions:submit', module: 'SUBMISSIONS', description: 'Submit batches for review' },
      { code: 'reports:export', module: 'REPORTS', description: 'Export gazette and statistics' },
      { code: 'backup:export', module: 'SETTINGS', description: 'Export full database snapshot' },
      { code: 'logs:view', module: 'AUDIT', description: 'Inspect audit trail logs' },
    ];
    return { success: true, data: defaultPermissions };
  }
}
