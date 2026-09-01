import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Prof. Engr. Ahmad Bilal', description: 'Teacher Full Name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'ahmad.bilal@bste.edu.pk', description: 'Teacher Email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'bilal_teacher', description: 'Unique Username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Teacher@123', description: 'Initial Account Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+92-300-9876543' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '61101-9988776-5' })
  @IsOptional()
  @IsString()
  cnic?: string;

  @ApiProperty({ example: 'Senior Instructor & Head of CIT', description: 'Academic Designation' })
  @IsNotEmpty()
  @IsString()
  designation: string;

  @ApiPropertyOptional({ example: 'M.Sc Computer Engineering' })
  @IsOptional()
  @IsString()
  qualification?: string;

  @ApiPropertyOptional({ example: 'Cloud Infrastructure & Networks' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: 'inst-id-001', description: 'Institute ID' })
  @IsNotEmpty()
  @IsString()
  instituteId: string;

  @ApiProperty({ example: 'dept-id-cit', description: 'Department ID' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiPropertyOptional({ example: 'prog-id-cit', description: 'Assigned Program ID' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({ example: 'sess-id-2023', description: 'Assigned Academic Session ID' })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
