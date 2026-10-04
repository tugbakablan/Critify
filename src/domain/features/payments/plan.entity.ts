import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plans')
export class PlanEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_plans' })
  id: string;

  @Index('IDX_plans_code', { unique: true })
  @Column({ type: 'varchar', length: 30 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'price_cents', type: 'int' })
  priceCents: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ name: 'save_quota', type: 'int', nullable: true })
  saveQuota: number | null;

  @Column({ name: 'duration_days', type: 'int', nullable: true })
  durationDays: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
