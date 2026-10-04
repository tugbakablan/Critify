import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaEntity } from '../media/media.entity';
import { UserEntity } from '../users/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ type: 'varchar', length: 2000 })
  body: string;

  @Index('IDX_posts_media_id', { unique: true })
  @Column({ name: 'media_id', type: 'uuid', nullable: true })
  mediaId: string | null;

  @ManyToOne(() => MediaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'media_id', foreignKeyConstraintName: 'FK_posts_media' })
  media: MediaEntity | null;

  @Column({ name: 'comment_count', type: 'int', default: 0 })
  commentCount: number;

  @Index('IDX_posts_created_at')
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
