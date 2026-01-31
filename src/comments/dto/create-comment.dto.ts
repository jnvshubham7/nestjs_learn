import { IsString, MinLength } from 'class-validator';

/**
 * CREATE COMMENT DTO
 * 
 * Validates comment creation.
 * postId comes from route parameter, not body.
 * authorId is extracted from JWT token.
 */
export class CreateCommentDto {
  /**
   * Comment text content
   */
  @IsString()
  @MinLength(1, { message: 'Comment cannot be empty' })
  content: string;
}
