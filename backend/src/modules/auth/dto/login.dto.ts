import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'superadmin@bste.edu.pk',
    description: 'Official username or email address',
  })
  @IsNotEmpty({ message: 'Username or email is required' })
  @IsString()
  identifier: string;

  @ApiProperty({
    example: 'SuperAdmin@123',
    description: 'User account password',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
