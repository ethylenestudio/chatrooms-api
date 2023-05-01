import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Manager } from './Manager.entity';
import { Organization } from './Organization.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: true })
  created_by: number;

  @Column()
  organization_id: number;

  @ManyToOne(() => Manager, (manager) => manager.id, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'created_by' })
  creator: Manager;

  @ManyToOne(() => Organization, (organization) => organization.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
