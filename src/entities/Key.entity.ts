import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Manager } from './Manager.entity';
import { Session } from './Session.entity';

@Entity('keys')
export class Key {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ nullable: false })
  key: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  created_at: Date;

  @Column({ nullable: false })
  generated_by: number;

  @Column({ nullable: false })
  session_id: number;

  @ManyToOne(() => Manager, (manager) => manager.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'generated_by' })
  generatedBy: Manager;

  @ManyToOne(() => Session, (session) => session.id, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'session_id' })
  session: Session;
}
