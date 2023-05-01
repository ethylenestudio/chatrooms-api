import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Organization } from './Organization.entity';

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ nullable: false, unique: true })
  address: string;

  @Column({ default: '0' })
  passkey: string;

  @Column({ nullable: false })
  organization_id: number;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'organization_id',
  })
  organization: Organization;

  @OneToOne(() => Organization, (organization) => organization.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  manages: Organization;
}
