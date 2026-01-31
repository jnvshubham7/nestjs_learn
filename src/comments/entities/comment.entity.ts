import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

/**
 * COMMENT ENTITY
 * 
 * Concept: Represents comments on posts.
 * Shows multiple many-to-one relationships:
 * - Many comments by one user
 * - Many comments on one post
 */
@Entity('comments')
export class Comment {
  // Unique comment ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Comment text content
  @Column('text')
  content: string;

  // When comment was created
  @CreateDateColumn()
  createdAt: Date;

  // When comment was last updated
  @UpdateDateColumn()
  updatedAt: Date;

  // ===== FOREIGN KEYS =====
  
  // Foreign key to User (who wrote the comment)
  @Column()
  authorId: string;

  // Foreign key to Post (which post this comments on)
  @Column()
  postId: string;

  // ===== RELATIONSHIPS =====

  // Many comments written by ONE user
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    eager: true, // Load author info automatically
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  // Many comments on ONE post
  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;
}
