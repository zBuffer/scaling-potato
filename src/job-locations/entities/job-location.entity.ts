import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class JobLocation {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255, nullable: true })
  label?: string;
}
