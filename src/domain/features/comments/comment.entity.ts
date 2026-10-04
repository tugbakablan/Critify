import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostEntity } from '../posts/post.entity';
import { UserEntity } from '../users/user.entity';

@Entity('comments')
@Index('IDX_comments_post_id_created_at', ['postId', 'createdAt'])
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_comments' })
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', foreignKeyConstraintName: 'FK_comments_post' })
  post: PostEntity;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', foreignKeyConstraintName: 'FK_comments_author' })
  author: UserEntity;

  @Column({ type: 'varchar', length: 1000 })
  body: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
