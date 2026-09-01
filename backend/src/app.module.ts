import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { InstitutesModule } from './modules/institutes/institutes.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { ResultsModule } from './modules/results/results.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    StudentsModule,
    TeachersModule,
    InstitutesModule,
    ProgramsModule,
    ResultsModule,
    CertificatesModule,
    DocumentsModule,
    ReportsModule,
    AuditLogsModule,
    NotificationsModule,
    ApprovalsModule,
  ],
})
export class AppModule {}
