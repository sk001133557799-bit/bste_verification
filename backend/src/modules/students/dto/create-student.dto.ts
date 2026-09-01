import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubjectMarkInputDto {
  @ApiProperty({ example: 'subj-cit-101-id', description: 'Subject ID' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ example: 85, description: 'Theory Marks Obtained' })
  @IsNumber()
  theoryObtained: number;

  @ApiProperty({ example: 42, description: 'Practical Marks Obtained' })
  @IsNumber()
  practicalObtained: number;
}

export class CreateStudentDto {
  @ApiProperty({ example: 'BSTE-2026-00125', description: 'Unique Examination Roll Number' })
  @IsNotEmpty()
  @IsString()
  rollNumber: string;

  @ApiProperty({ example: 'BSTE-REG-2023-0941', description: 'Unique Registration Number' })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: 'Muhammad Hamza Tariq', description: 'Student Full Name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'Tariq Mehmood Raja', description: 'Father Name' })
  @IsNotEmpty()
  @IsString()
  fatherName: string;

  @ApiProperty({ example: '61101-1234567-3', description: 'National Identity CNIC' })
  @IsNotEmpty()
  @IsString()
  cnic: string;

  @ApiPropertyOptional({ example: '2003-04-15' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: '+92-300-1122334' })
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiPropertyOptional({ example: 'hamza@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: 'Sector G-10/2, Islamabad' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiProperty({ example: 'inst-id-001' })
  @IsNotEmpty()
  @IsString()
  instituteId: string;

  @ApiProperty({ example: 'dept-cit-id' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;

  @ApiProperty({ example: 'prog-dae-cit-id' })
  @IsNotEmpty()
  @IsString()
  programId: string;

  @ApiProperty({ example: 'sess-2023-2026-id' })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({ example: 2026 })
  @IsOptional()
  @IsNumber()
  passingYear?: number;

  @ApiPropertyOptional({ type: [SubjectMarkInputDto] })
  @IsOptional()
  @IsArray()
  marksList?: SubjectMarkInputDto[];
}
