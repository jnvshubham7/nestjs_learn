import { IsString, MinLength, MaxLength, IsOptional, IsUrl } from 'class-validator';

/**
 * CREATE POST DTO
 * 
 * Validates data when creating a new post.
 * Note: authorId is automatically set from JWT token,
 * not included in request body.
 */
export class CreatePostDto {
  /**
   * Post title
   * Should be concise but descriptive
   */
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  /**
   * Main post content
   * Can be markdown formatted
   */
  @IsString()
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content: string;

  /**
   * Optional cover image URL
   */
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
