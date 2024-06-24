import { Entity, Unique, PrimaryColumn, Index, Column } from 'typeorm';

@Entity()
@Unique(['recruitment_brief_id', 'pricing_rule_id'])
export class AgencyFeeQuotation {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  created_at: Date;
  @Index()
  @Column({ nullable: true })
  invalidated_at?: Date;

  @Column({ type: 'double precision' })
  agency_fee: number;
  @Column({ type: 'double precision' })
  agency_fee_rate: number;

  @Column()
  recruitment_brief_id: string;
  @Column()
  pricing_rule_id: string;
}
