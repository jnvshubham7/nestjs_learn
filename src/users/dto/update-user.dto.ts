import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';

/**
 * UPDATE USER DTO
 * 
 * For updating user profile - all fields are optional
 * since user might only want to update specific fields.
 */
export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  username?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  fullName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;
}
