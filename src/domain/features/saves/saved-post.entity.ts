import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntitlementEntity } from '../payments/entitlement.entity';
import { PostEntity } from '../posts/post.entity';
import { UserEntity } from '../users/user.entity';

@Entity('saved_posts')
@Index('IDX_saved_posts_user_id_created_at', ['userId', 'createdAt'])
export class SavedPostEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid', primaryKeyConstraintName: 'PK_saved_posts' })
  userId: string;

  @PrimaryColumn({ name: 'post_id', type: 'uuid', primaryKeyConstraintName: 'PK_saved_posts' })
  postId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'FK_saved_posts_user' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', foreignKeyConstraintName: 'FK_saved_posts_post' })
  post: PostEntity;

  @Column({ name: 'entitlement_id', type: 'uuid' })
  entitlementId: string;

  @ManyToOne(() => EntitlementEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entitlement_id', foreignKeyConstraintName: 'FK_saved_posts_entitlement' })
  entitlement: EntitlementEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
