import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

/**
 * POST ENTITY
 * 
 * Concept: Represents a blog post or social media post.
 * Shows many-to-one relationship (many posts by one author).
 * 
 * Key Concepts:
 * - @ManyToOne() - Many posts written by one user
 * - @JoinColumn() - Foreign key column linking to User
 * - @OneToMany() - One post has many comments
 * - Cascade operations - Auto-delete children if parent deleted
 */
@Entity('posts')
export class Post {
  // Unique post ID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Post title
  @Column()
  title: string;

  // Post content/body
  @Column('text')
  content: string;

  // Optional cover image URL
  @Column({ nullable: true })
  imageUrl: string;

  // Number of likes (cached for performance)
  @Column({ default: 0 })
  likesCount: number;

  // When post was created
  @CreateDateColumn()
  createdAt: Date;

  // When post was last edited
  @UpdateDateColumn()
  updatedAt: Date;

  // ===== RELATIONSHIPS =====
  
  // Foreign Key: User ID (author of the post)
  @Column()
  authorId: string;

  // Many posts belong to ONE author (User)
  // If user is deleted, cascade delete this post
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    eager: true, // Load author automatically when fetching post
  })
  @JoinColumn({ name: 'authorId' }) // Foreign key column name
  author: User;

  // One post can have many comments
  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
