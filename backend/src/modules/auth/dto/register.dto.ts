import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'instructor_cit', description: 'Unique username' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'instructor@bste.edu.pk', description: 'Official email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Teacher@123', description: 'Strong password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Engr. M. Farhan', description: 'Full legal name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ example: '+92-300-1122334', description: 'Contact phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'TEACHER_EDITOR', description: 'Role name (ADMIN, TEACHER_EDITOR)' })
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @ApiPropertyOptional({ example: 'BSTE-INST-001', description: 'Assigned Institute Code' })
  @IsOptional()
  @IsString()
  instituteCode?: string;
}
