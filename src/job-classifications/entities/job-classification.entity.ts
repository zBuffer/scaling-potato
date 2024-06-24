import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JobClassification {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255, nullable: true })
  label?: string;
}
