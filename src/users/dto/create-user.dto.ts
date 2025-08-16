import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Lessor = 'Lessor',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(['User', 'Lessor', 'Admin'])
  @IsOptional()
  role?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  DLN: string;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;
}
