import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
} from 'typeorm';
import { Manager } from './Manager.entity';

@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn({ type: 'int8' })
    id: number;

    @Column({ nullable: false, unique: true })
    name: string;

    @Column({ nullable: true })
    manager_id: number;

    @OneToOne(() => Manager, (manager) => manager.id, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'manager_id' })
    manager: Manager;
}
