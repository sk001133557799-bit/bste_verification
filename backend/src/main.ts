import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('BSTE_Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Documentation Configuration
  const config = new DocumentBuilder()
    .setTitle('BSTE Islamabad — National Examination & Verification API')
    .setDescription(
      'Official REST API and Examination Engine for Board of Science and Technical Education Islamabad. Provides automated student registry, roll number result verification, teacher marks submissions, cryptographic QR certificates, and administrative governance.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Access Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Staff, Teacher, and Administrator session authentication')
    .addTag('Users', 'User account profiles and management')
    .addTag('Roles', 'RBAC security role catalog')
    .addTag('Permissions', 'Granular capability tokens')
    .addTag('Students', 'Candidate registry, CRUD, and verified result lookup')
    .addTag('Teachers', 'Faculty and instructor assignment scoping')
    .addTag('Institutes', 'Affiliated polytechnic colleges and centers')
    .addTag('Programs', 'Curricula schemes and subjects')
    .addTag('Results', 'Examination outcome and grading engine')
    .addTag('Certificates', 'Cryptographic verification and QR target resolver')
    .addTag('Documents', 'Student Matric Sanads and CNIC verification files')
    .addTag('Reports', 'Board KPIs, statistics, and gazette analytics')
    .addTag('Audit Logs', 'Immutable security audit trail')
    .addTag('Notifications', 'Gazette announcements and notices')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'BSTE Islamabad API Documentation',
  });

  const port = process.env.BACKEND_PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 BSTE NestJS Enterprise Backend running on: http://localhost:${port}`);
  logger.log(`📚 Swagger API Documentation available at: http://localhost:${port}/api/docs`);
}

bootstrap();
