import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PaymentEntity } from './payment.entity';
import { PlanEntity } from './plan.entity';

@Entity('entitlements')
@Check('CHK_entitlements_used_within_quota', '"quota" IS NULL OR "used" <= "quota"')
export class EntitlementEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_entitlements' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'FK_entitlements_user' })
  user: UserEntity;

  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  @ManyToOne(() => PlanEntity)
  @JoinColumn({ name: 'plan_id', foreignKeyConstraintName: 'FK_entitlements_plan' })
  plan: PlanEntity;

  @Index('IDX_entitlements_payment_id', { unique: true })
  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => PaymentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id', foreignKeyConstraintName: 'FK_entitlements_payment' })
  payment: PaymentEntity;

  @Column({ type: 'int', nullable: true })
  quota: number | null;

  @Column({ type: 'int', default: 0 })
  used: number;

  @Column({ name: 'valid_until', type: 'timestamptz', nullable: true })
  validUntil: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  get isUnlimited(): boolean {
    return this.quota === null;
  }

  get remaining(): number | null {
    return this.isUnlimited ? null : this.quota - this.used;
  }

  isUsable(now: Date): boolean {
    const notExpired = this.validUntil === null || this.validUntil > now;
    const hasRoom = this.isUnlimited || this.used < this.quota;
    return notExpired && hasRoom;
  }
}
