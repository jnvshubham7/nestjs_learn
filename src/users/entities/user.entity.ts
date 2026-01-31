import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

/**
 * USER ENTITY
 * 
 * Concept: Entities are database models using TypeORM.
 * Each property decorated with @Column creates a column in the database.
 * 
 * Key Points:
 * - @Entity() - Makes this class a database table
 * - @PrimaryGeneratedColumn() - Auto-incrementing primary key
 * - @Column() - Regular database columns
 * - @CreateDateColumn() - Auto-set on creation
 * - @UpdateDateColumn() - Auto-updated on changes
 * - @OneToMany() - One user has many posts/comments
 */
@Entity('users')
export class User {
  // Primary Key: Unique identifier for each user
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Username: Must be unique for login
  @Column({ unique: true })
  username: string;

  // Email: Another unique identifier
  @Column({ unique: true })
  email: string;

  // Password: Hashed password (never store plain text!)
  @Column()
  password: string;

  // User's display name
  @Column()
  fullName: string;

  // Optional bio/description
  @Column({ nullable: true })
  bio: string;

  // User's avatar URL
  @Column({ nullable: true })
  avatarUrl: string;

  // Automatically set when user is created
  @CreateDateColumn()
  createdAt: Date;

  // Automatically updated when user profile changes
  @UpdateDateColumn()
  updatedAt: Date;

  // ===== RELATIONSHIPS =====
  // One user can have many posts
  // 'posts' is the property name in User entity
  // 'author' is the property name in Post entity
  @OneToMany(() => Post, (post) => post.author, {
    cascade: true, // If user is deleted, delete their posts
    onDelete: 'CASCADE',
  })
  posts: Post[];

  // One user can have many comments
  @OneToMany(() => Comment, (comment) => comment.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];
}
