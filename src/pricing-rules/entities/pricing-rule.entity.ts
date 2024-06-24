import { Column, Entity, Index, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['job_location_id', 'job_classification_id', 'version'])
export class PricingRule {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255, nullable: true })
  author?: string;
  @Index()
  @Column({ type: 'int' })
  version: number;
  @Column()
  created_at: Date;
  @Column({ nullable: true })
  invalidated_at?: Date | null;

  @Column({ type: 'double precision' })
  rate_recruitment_fee: number;
  @Column({ type: 'double precision' })
  rate_agency_fee: number;

  @Index()
  @Column()
  job_location_id: string;

  @Index()
  @Column()
  job_classification_id: string;
}
