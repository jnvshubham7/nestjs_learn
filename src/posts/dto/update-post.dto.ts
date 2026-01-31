import { IsString, MinLength, IsOptional, MaxLength, IsUrl } from 'class-validator';

/**
 * UPDATE POST DTO
 * 
 * All fields optional - user can update title, content, or image
 */
export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  content?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
