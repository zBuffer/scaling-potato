import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class RecruitmentBrief {
  @PrimaryColumn()
  id: string;
  @Index()
  @Column()
  author: string;
  @Column()
  created_at: Date;
  @Index()
  @Column()
  updated_at: Date;
  @Index()
  @Column({ nullable: true })
  published_at?: Date;

  @Index()
  @Column()
  job_title: string;
  @Index()
  @Column({ length: 4095, nullable: true })
  job_role_description?: string;
  @Index()
  @Column({ type: 'double precision' })
  annual_salary: number;

  @Index()
  @Column()
  job_location_id: string;
  @Index()
  @Column()
  job_classification_id: string;
  @Index()
  @Column()
  pricing_rule_id: string;
}
